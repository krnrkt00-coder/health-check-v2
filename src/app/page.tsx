"use client";

import { useEffect, useMemo, useState } from "react";

type WorkStatus = "出勤" | "休暇" | "有休" | "半休" | "代休" | "欠勤" | "在宅";

type RecordItem = {
  id: string;
  person: string;
  date: string;
  status: WorkStatus;
  temperature: string;
  symptoms: string[];
  otherSymptom: string;
  note: string;
  updatedAt: string;
};

type AppState = {
  people: string[];
  records: RecordItem[];
};

const DEFAULT_PEOPLE = ["佐藤", "鈴木", "高橋", "田中"];
const STATUSES: WorkStatus[] = ["出勤", "休暇", "有休", "半休", "代休", "欠勤", "在宅"];
const SYMPTOMS = ["発熱", "せき", "のどの痛み", "だるさ", "頭痛", "腹痛", "下痢", "吐き気"];

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const EMPTY: AppState = { people: DEFAULT_PEOPLE, records: [] };

function initialForm(person = DEFAULT_PEOPLE[0], date = today()) {
  return { person, date, status: "出勤" as WorkStatus, temperature: "", symptoms: [] as string[], otherSymptom: "", note: "" };
}

function concern(r: Pick<RecordItem, "temperature" | "symptoms" | "otherSymptom">) {
  const t = Number(r.temperature);
  return (Number.isFinite(t) && t >= 37.5) || r.symptoms.length > 0 || r.otherSymptom.trim().length > 0;
}

async function readState(): Promise<AppState> {
  try {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (!res.ok) return EMPTY;
    const data = await res.json();
    return {
      people: Array.isArray(data.people) && data.people.length ? data.people : DEFAULT_PEOPLE,
      records: Array.isArray(data.records) ? data.records : [],
    };
  } catch {
    return EMPTY;
  }
}

async function writeState(state: AppState) {
  await fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<AppState>(EMPTY);
  const [personInput, setPersonInput] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(DEFAULT_PEOPLE[0]);
  const [filterDate, setFilterDate] = useState(today());
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(() => initialForm(DEFAULT_PEOPLE[0]));

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await readState();
      if (!mounted) return;
      setState(data);
      const first = data.people[0] ?? DEFAULT_PEOPLE[0];
      setSelectedPerson(first);
      setForm((f) => ({ ...f, person: first }));
      setLoaded(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = window.setTimeout(() => void writeState(state), 350);
    return () => window.clearTimeout(t);
  }, [loaded, state]);

  useEffect(() => {
    if (!state.people.includes(selectedPerson)) {
      const first = state.people[0] ?? DEFAULT_PEOPLE[0];
      setSelectedPerson(first);
      setForm((f) => ({ ...f, person: first }));
    }
  }, [selectedPerson, state.people]);

  const visibleRecords = useMemo(
    () =>
      [...state.records]
        .filter((r) => (filterDate ? r.date === filterDate : true))
        .filter((r) => `${r.person} ${r.date} ${r.status} ${r.temperature} ${r.symptoms.join(" ")} ${r.otherSymptom} ${r.note}`.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [filterDate, search, state.records]
  );

  const todayRecords = state.records.filter((r) => r.date === filterDate);
  const recordedPeople = new Set(todayRecords.map((r) => r.person));
  const missingPeople = state.people.filter((p) => !recordedPeople.has(p));
  const attendanceCount = todayRecords.filter((r) => r.status === "出勤").length;
  const leaveCount = todayRecords.filter((r) => r.status !== "出勤").length;
  const concernCount = state.records.filter(concern).length;

  const upsert = (next: Omit<RecordItem, "id" | "updatedAt">) => {
    setState((prev) => {
      const item: RecordItem = { ...next, id: `${next.date}-${next.person}`, updatedAt: new Date().toISOString() };
      return { ...prev, records: [item, ...prev.records.filter((r) => !(r.person === next.person && r.date === next.date))] };
    });
  };

  const addPerson = () => {
    const name = personInput.trim();
    if (!name || state.people.includes(name)) return;
    setState((prev) => ({ ...prev, people: [name, ...prev.people] }));
    setPersonInput("");
    setSelectedPerson(name);
    setForm((f) => ({ ...f, person: name }));
  };

  const removePerson = (name: string) => {
    if (!confirm(`${name} を削除しますか？`)) return;
    setState((prev) => ({
      people: prev.people.filter((p) => p !== name),
      records: prev.records.filter((r) => r.person !== name),
    }));
    if (selectedPerson === name) {
      const first = state.people.find((p) => p !== name) ?? DEFAULT_PEOPLE[0];
      setSelectedPerson(first);
      setForm((f) => ({ ...f, person: first }));
    }
  };

  const clearAll = () => {
    if (!confirm("すべての記録を削除しますか？")) return;
    setState(EMPTY);
    setSelectedPerson(DEFAULT_PEOPLE[0]);
    setForm(initialForm(DEFAULT_PEOPLE[0]));
    setPersonInput("");
    setSearch("");
    setFilterDate(today());
  };

  return (
    <main className="page">
      <div className="container">
        <header className="hero">
          <div className="heroTop">毎日の健康チェック</div>
          <h1>健康記録</h1>
          <p>
            名前を登録して、出勤・休暇・有休・半休・代休・欠勤・在宅と体調をまとめて記録できます。Supabase に保存するので、
            PC とスマホで同じデータを見られます。
          </p>
          <div className="stats">
            <div className="stat"><span>登録人数</span><strong>{state.people.length}</strong><small>名前の追加・削除ができます</small></div>
            <div className="stat"><span>今日の出勤</span><strong>{attendanceCount}</strong><small>対象日: {filterDate}</small></div>
            <div className="stat"><span>要確認</span><strong>{concernCount}</strong><small>37.5℃以上 or 症状あり</small></div>
          </div>
        </header>

        <div className="grid">
          <section className="card">
            <div className="cardHead">
              <div>
                <h2>名前の登録</h2>
                <p>追加だけでOK。登録した人を入力フォームで選択できます。</p>
              </div>
              <div className="muted">{loaded ? "保存済み" : "読み込み中"}</div>
            </div>
            <div className="inlineRow">
              <input
                value={personInput}
                onChange={(e) => setPersonInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addPerson(); }}
                placeholder="例：田中 太郎"
              />
              <button onClick={addPerson}>追加</button>
            </div>
            <div className="chips">
              {state.people.map((p) => (
                <span key={p} className="chip">
                  <button
                    onClick={() => { setSelectedPerson(p); setForm((f) => ({ ...f, person: p })); }}
                    className="chipName"
                    type="button"
                  >{p}</button>
                  <button onClick={() => removePerson(p)} className="chipX" type="button">×</button>
                </span>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="cardHead">
              <div>
                <h2>入力</h2>
                <p>選択した人の記録を日付ごとに保存します。</p>
              </div>
              <div className={`badge ${concern(form) ? "warn" : "ok"}`}>{concern(form) ? "注意あり" : "異常なし"}</div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (!form.person) return; upsert({
              person: form.person,
              date: form.date,
              status: form.status,
              temperature: form.temperature,
              symptoms: form.symptoms,
              otherSymptom: form.otherSymptom.trim(),
              note: form.note.trim(),
            }); }}>

              <div className="two">
                <label><span>日付</span><input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></label>
                <label><span>名前</span><select value={form.person} onChange={(e) => { const p = e.target.value; setSelectedPerson(p); setForm((f) => ({ ...f, person: p })); }}>{state.people.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
              </div>

              <div className="section">
                <span>出勤・休暇</span>
                <div className="row">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" className={`pill ${form.status === s ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, status: s }))}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="two">
                <label><span>体温（℃）</span><input type="number" step="0.1" min="34" max="42" placeholder="例：36.5" value={form.temperature} onChange={(e) => setForm((f) => ({ ...f, temperature: e.target.value }))} /></label>
                <label><span>備考</span><input type="text" placeholder="連絡事項があれば入力" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} /></label>
              </div>

              <div className="section">
                <span>症状</span>
                <div className="row">
                  {SYMPTOMS.map((s) => (
                    <button key={s} type="button" className={`pill ${form.symptoms.includes(s) ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, symptoms: f.symptoms.includes(s) ? f.symptoms.filter((x) => x !== s) : [...f.symptoms, s] }))}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="bottomRow">
                <label className="grow"><span>その他の症状</span><input type="text" placeholder="自由記述" value={form.otherSymptom} onChange={(e) => setForm((f) => ({ ...f, otherSymptom: e.target.value }))} /></label>
                <div className="actions">
                  <button type="button" className="secondary" onClick={() => setForm(initialForm(selectedPerson || state.people[0] || DEFAULT_PEOPLE[0], form.date))}>クリア</button>
                  <button type="submit" className="primary">登録する</button>
                </div>
              </div>
            </form>
          </section>

          <aside className="card">
            <h2>集計</h2>
            <div className="miniGrid">
              <div className="mini"><span>登録人数</span><strong>{state.people.length}</strong></div>
              <div className="mini"><span>対象日の記録済み</span><strong>{recordedPeople.size}/{state.people.length}</strong></div>
              <div className="mini"><span>未入力人数</span><strong>{missingPeople.length}</strong></div>
              <div className="mini"><span>出勤 / 休暇系</span><strong>{attendanceCount} / {leaveCount}</strong></div>
            </div>
            <div className="box">
              <div className="boxTitle">未入力者</div>
              <div className="row">
                {missingPeople.length ? missingPeople.map((p) => <span key={p} className="tag">{p}</span>) : <span className="muted">全員入力済みです。</span>}
              </div>
            </div>
          </aside>

          <aside className="card">
            <div className="cardHead">
              <div>
                <h2>今日の一覧</h2>
                <p>日付とキーワードで絞り込みできます。</p>
              </div>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            </div>
            <div className="searchWrap"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="検索..." /></div>

            <div className="list">
              {visibleRecords.length ? visibleRecords.map((r) => (
                <div key={r.id} className="item">
                  <div className="itemTop">
                    <div>
                      <strong>{r.person}</strong>
                      <small>{r.date} ・ {r.temperature ? `${r.temperature}℃` : "-"}</small>
                    </div>
                    <span className="status" style={{ background: statusBg(r.status), color: statusFg(r.status) }}>{r.status}</span>
                  </div>
                  <div className="row">
                    {r.symptoms.length ? r.symptoms.map((s) => <span key={s} className="symptom">{s}</span>) : <span className="muted">症状なし</span>}
                  </div>
                  {(r.otherSymptom || r.note) && <div className="note">{r.otherSymptom || r.note}</div>}
                </div>
              )) : <div className="empty">条件に一致する記録がありません。</div>}
            </div>
          </aside>

          <button className="danger" onClick={clearAll} type="button">全削除</button>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f8fafc; color: #0f172a; font-family: Arial, Helvetica, sans-serif; }
        button, input, select { font: inherit; }
        .page { min-height: 100vh; }
        .container { max-width: 1280px; margin: 0 auto; padding: 24px 16px 40px; }
        .hero { border-radius: 28px; padding: 28px; background: linear-gradient(135deg, #0ea5e9, #38bdf8 55%, #67e8f9); color: white; box-shadow: 0 18px 50px rgba(14, 165, 233, .18); }
        .heroTop { display: inline-block; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.18); border-radius: 999px; padding: 6px 12px; font-size: 13px; font-weight: 700; }
        .hero h1 { margin: 14px 0 8px; font-size: 36px; line-height: 1.1; letter-spacing: -.5px; }
        .hero p { margin: 0; max-width: 840px; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,.96); }
        .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }
        .stat, .card, .mini, .item, .empty, .box { background: white; border: 1px solid #e2e8f0; border-radius: 22px; box-shadow: 0 8px 24px rgba(15,23,42,.05); }
        .stat { padding: 18px; min-height: 112px; }
        .stat span, .mini span { display: block; font-size: 13px; font-weight: 700; color: #64748b; }
        .stat strong { display: block; margin-top: 8px; font-size: 28px; font-weight: 800; color: #0f172a; }
        .stat small { display: block; margin-top: 6px; color: #64748b; font-size: 12px; line-height: 1.5; }
        .grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 24px; margin-top: 24px; }
        .card { padding: 20px; }
        .card h2 { margin: 0; font-size: 20px; }
        .card p, .muted { margin: 6px 0 0; color: #64748b; font-size: 14px; line-height: 1.6; }
        .cardHead { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
        .inlineRow { display: grid; grid-template-columns: 1fr auto; gap: 12px; margin-top: 16px; }
        input, select { width: 100%; border: 1px solid #cbd5e1; border-radius: 16px; padding: 12px 14px; outline: none; background: white; }
        input:focus, select:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,.15); }
        button { border: none; cursor: pointer; }
        .inlineRow > button, .primary, .secondary, .danger { border-radius: 16px; padding: 12px 16px; font-weight: 800; }
        .inlineRow > button, .primary { background: #0f172a; color: white; }
        .secondary { background: #fff; color: #334155; border: 1px solid #cbd5e1; }
        .danger { width: 100%; margin-top: 12px; background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
        .chips, .row, .list { display: flex; flex-wrap: wrap; gap: 8px; }
        .chips { margin-top: 14px; }
        .chip { display: inline-flex; align-items: center; gap: 8px; background: #f1f5f9; border-radius: 999px; padding: 8px 12px; }
        .chipName { background: transparent; color: inherit; font-weight: 700; }
        .chipX { background: transparent; color: #94a3b8; font-size: 18px; line-height: 1; }
        .section { margin-top: 18px; }
        .section > span { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #334155; }
        .pill { padding: 8px 12px; border-radius: 999px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
        .pill.active { background: #0f172a; color: white; border-color: #0f172a; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
        .two label, .grow { display: block; }
        .two span, .grow span { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; color: #334155; }
        .bottomRow { display: flex; gap: 14px; align-items: flex-end; justify-content: space-between; margin-top: 18px; }
        .grow { flex: 1; min-width: 240px; }
        .actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 8px 12px; font-size: 12px; font-weight: 800; border: 1px solid transparent; white-space: nowrap; }
        .badge.ok { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
        .badge.warn { background: #fef3c7; color: #92400e; border-color: #fde68a; }
        .miniGrid { display: grid; gap: 12px; margin-top: 16px; }
        .mini { padding: 14px 16px; }
        .mini strong { display: block; margin-top: 8px; font-size: 22px; font-weight: 800; }
        .box { margin-top: 14px; padding: 16px; background: #f8fafc; }
        .boxTitle { font-size: 14px; font-weight: 800; color: #334155; }
        .tag, .symptom { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 10px; font-size: 12px; }
        .tag { background: white; border: 1px solid #e2e8f0; }
        .searchWrap { margin-top: 14px; }
        .list { display: grid; gap: 12px; margin-top: 14px; }
        .item { padding: 16px; }
        .itemTop { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
        .item small { display: block; margin-top: 6px; color: #64748b; font-size: 12px; }
        .status { display: inline-flex; padding: 7px 12px; border-radius: 999px; font-size: 12px; font-weight: 800; }
        .symptom { background: #fff7ed; color: #b45309; border: 1px solid #fed7aa; }
        .note { margin-top: 12px; color: #475569; font-size: 14px; line-height: 1.65; }
        .empty { padding: 28px; text-align: center; color: #64748b; }
        @media (max-width: 1000px) {
          .grid, .stats { grid-template-columns: 1fr; }
          .hero { padding: 22px; }
          .hero h1 { font-size: 30px; }
        }
        @media (max-width: 640px) {
          .two, .inlineRow { grid-template-columns: 1fr; }
          .bottomRow { flex-direction: column; align-items: stretch; }
          .actions { width: 100%; }
          .actions > button { flex: 1; }
        }
      `}</style>
    </main>
  );
}
