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

const STORAGE_KEY = "health-check-v2-state";
const DEFAULT_PEOPLE = ["佐藤", "鈴木", "高橋", "田中"];
const STATUS_OPTIONS: WorkStatus[] = ["出勤", "休暇", "有休", "半休", "代休", "欠勤", "在宅"];
const SYMPTOM_OPTIONS = ["発熱", "せき", "のどの痛み", "だるさ", "頭痛", "腹痛", "下痢", "吐き気"];

const today = () => new Date().toISOString().slice(0, 10);

const makeEmptyForm = (person = DEFAULT_PEOPLE[0], date = today()) => ({
  person,
  date,
  status: "出勤" as WorkStatus,
  temperature: "",
  symptoms: [] as string[],
  otherSymptom: "",
  note: "",
});

function loadState(): AppState {
  if (typeof window === "undefined") return { people: DEFAULT_PEOPLE, records: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { people: DEFAULT_PEOPLE, records: [] };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      people: Array.isArray(parsed.people) && parsed.people.length > 0 ? parsed.people : DEFAULT_PEOPLE,
      records: Array.isArray(parsed.records) ? parsed.records : [],
    };
  } catch {
    return { people: DEFAULT_PEOPLE, records: [] };
  }
}

function isConcern(record: Pick<RecordItem, "temperature" | "symptoms" | "otherSymptom">) {
  const temp = Number(record.temperature);
  return (Number.isFinite(temp) && temp >= 37.5) || record.symptoms.length > 0 || record.otherSymptom.trim().length > 0;
}

function statusTone(status: WorkStatus) {
  switch (status) {
    case "出勤":
      return "bg-sky-100 text-sky-700 ring-sky-200";
    case "休暇":
    case "有休":
      return "bg-emerald-100 text-emerald-700 ring-emerald-200";
    case "半休":
      return "bg-amber-100 text-amber-700 ring-amber-200";
    case "代休":
      return "bg-violet-100 text-violet-700 ring-violet-200";
    case "欠勤":
      return "bg-rose-100 text-rose-700 ring-rose-200";
    case "在宅":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<AppState>({ people: DEFAULT_PEOPLE, records: [] });
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(today());
  const [newPerson, setNewPerson] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(DEFAULT_PEOPLE[0]);
  const [form, setForm] = useState(() => makeEmptyForm(DEFAULT_PEOPLE[0]));

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [loaded, state]);

  useEffect(() => {
    if (!state.people.includes(selectedPerson)) {
      const nextPerson = state.people[0] ?? "";
      setSelectedPerson(nextPerson);
      setForm((prev) => ({ ...prev, person: nextPerson }));
    }
  }, [selectedPerson, state.people]);

  const visibleRecords = useMemo(() => {
    return [...state.records]
      .filter((record) => (filterDate ? record.date === filterDate : true))
      .filter((record) => {
        const text = `${record.person} ${record.date} ${record.status} ${record.temperature} ${record.symptoms.join(" ")} ${record.otherSymptom} ${record.note}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filterDate, search, state.records]);

  const selectedDateRecords = state.records.filter((record) => record.date === filterDate);
  const completedPeople = new Set(selectedDateRecords.map((record) => record.person));
  const missingPeople = state.people.filter((person) => !completedPeople.has(person));

  const concernCount = state.records.filter((record) => isConcern(record)).length;
  const attendanceCount = selectedDateRecords.filter((record) => record.status === "出勤").length;
  const leaveCount = selectedDateRecords.filter((record) => record.status !== "出勤").length;

  const upsertRecord = (next: Omit<RecordItem, "id" | "updatedAt">) => {
    setState((prev) => {
      const updatedAt = new Date().toISOString();
      const nextRecord: RecordItem = {
        ...next,
        id: `${next.date}-${next.person}`,
        updatedAt,
      };
      const filtered = prev.records.filter((record) => !(record.person === next.person && record.date === next.date));
      return { ...prev, records: [nextRecord, ...filtered] };
    });
  };

  const addPerson = () => {
    const name = newPerson.trim();
    if (!name || state.people.includes(name)) return;
    setState((prev) => ({ ...prev, people: [name, ...prev.people] }));
    setNewPerson("");
    setSelectedPerson(name);
    setForm((prev) => ({ ...prev, person: name }));
  };

  const removePerson = (name: string) => {
    if (!confirm(`${name} を削除しますか？`)) return;
    setState((prev) => ({
      people: prev.people.filter((person) => person !== name),
      records: prev.records.filter((record) => record.person !== name),
    }));
    if (selectedPerson === name) {
      const nextPerson = state.people.find((person) => person !== name) ?? DEFAULT_PEOPLE[0];
      setSelectedPerson(nextPerson);
      setForm((prev) => ({ ...prev, person: nextPerson }));
    }
  };

  const clearAll = () => {
    if (!confirm("すべての記録を削除しますか？")) return;
    setState({ people: DEFAULT_PEOPLE, records: [] });
    setSelectedPerson(DEFAULT_PEOPLE[0]);
    setForm(makeEmptyForm(DEFAULT_PEOPLE[0]));
    setNewPerson("");
    setSearch("");
    setFilterDate(today());
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-sky-400 to-cyan-300 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium ring-1 ring-white/20">毎日の健康チェック</div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">健康記録</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
                名前を登録して、出勤・休暇・有休・半休・代休・欠勤・在宅と体調をまとめて記録できます。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="登録人数" value={state.people.length} hint="名前の追加・削除ができます" />
              <StatCard label="今日の出勤" value={attendanceCount} hint={`対象日: ${filterDate}`} />
              <StatCard label="要確認" value={concernCount} hint="37.5℃以上 or 症状あり" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">名前の登録</h2>
                  <p className="text-sm text-slate-500">追加だけでOK。登録した人を入力フォームで選択できます。</p>
                </div>
                <div className="text-xs text-slate-400">{loaded ? "保存済み" : "読み込み中"}</div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addPerson();
                  }}
                  placeholder="例：田中 太郎"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={addPerson}
                  className="rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
                >
                  追加
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {state.people.map((person) => (
                  <div key={person} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPerson(person);
                        setForm((prev) => ({ ...prev, person }));
                      }}
                      className="font-medium hover:text-sky-700"
                    >
                      {person}
                    </button>
                    <button type="button" onClick={() => removePerson(person)} className="rounded-full px-1 text-slate-400 hover:text-rose-500" aria-label={`${person}を削除`}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">入力</h2>
                  <p className="text-sm text-slate-500">選択した人の記録を日付ごとに保存します。</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${isConcern(form) ? "bg-amber-100 text-amber-800 ring-amber-200" : "bg-emerald-100 text-emerald-800 ring-emerald-200"}`}>
                  {isConcern(form) ? "注意あり" : "異常なし"}
                </div>
              </div>

              <form
                className="mt-5 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.person) return;
                  upsertRecord({
                    person: form.person,
                    date: form.date,
                    status: form.status,
                    temperature: form.temperature,
                    symptoms: form.symptoms,
                    otherSymptom: form.otherSymptom.trim(),
                    note: form.note.trim(),
                  });
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">日付</span>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">名前</span>
                    <select
                      value={form.person}
                      onChange={(e) => {
                        const person = e.target.value;
                        setSelectedPerson(person);
                        setForm((prev) => ({ ...prev, person }));
                      }}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                    >
                      {state.people.map((person) => (
                        <option key={person} value={person}>
                          {person}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">出勤・休暇</span>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <PillButton key={status} active={form.status === status} onClick={() => setForm((prev) => ({ ...prev, status }))}>
                        {status}
                      </PillButton>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">体温（℃）</span>
                    <input
                      type="number"
                      step="0.1"
                      min="34"
                      max="42"
                      value={form.temperature}
                      onChange={(e) => setForm((prev) => ({ ...prev, temperature: e.target.value }))}
                      placeholder="例：36.5"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">備考</span>
                    <input
                      type="text"
                      value={form.note}
                      onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="連絡事項があれば入力"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                    />
                  </label>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">症状</span>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_OPTIONS.map((item) => (
                      <PillButton
                        key={item}
                        active={form.symptoms.includes(item)}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            symptoms: prev.symptoms.includes(item) ? prev.symptoms.filter((s) => s !== item) : [...prev.symptoms, item],
                          }))
                        }
                      >
                        {item}
                      </PillButton>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-between">
                  <label className="block flex-1">
                    <span className="mb-1 block text-sm font-medium text-slate-700">その他の症状</span>
                    <input
                      type="text"
                      value={form.otherSymptom}
                      onChange={(e) => setForm((prev) => ({ ...prev, otherSymptom: e.target.value }))}
                      placeholder="自由記述"
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                    />
                  </label>

                  <div className="flex items-end gap-3 sm:self-end">
                    <button
                      type="button"
                      onClick={() => setForm(makeEmptyForm(selectedPerson || state.people[0] || "", form.date))}
                      className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      クリア
                    </button>
                    <button
                      type="submit"
                      className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                    >
                      登録する
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold">集計</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <StatCard label="登録人数" value={state.people.length} />
                <StatCard label="対象日の記録済み" value={`${completedPeople.size}/${state.people.length}`} hint="休暇系は未入力に含めません" />
                <StatCard label="未入力人数" value={missingPeople.length} />
                <StatCard label="出勤 / 休暇系" value={`${attendanceCount} / ${leaveCount}`} />
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-700">未入力者</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {missingPeople.length ? (
                    missingPeople.map((person) => (
                      <span key={person} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200">
                        {person}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">全員入力済みです。</span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">今日の一覧</h2>
                  <p className="text-sm text-slate-500">日付とキーワードで絞り込みできます。</p>
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400"
                />
              </div>

              <div className="mt-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="検索..."
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-400"
                />
              </div>

              <div className="mt-4 space-y-3">
                {visibleRecords.length ? (
                  visibleRecords.map((record) => (
                    <div key={record.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{record.person}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {record.date} ・ {record.temperature ? `${record.temperature}℃` : "-"}
                          </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusTone(record.status)}`}>{record.status}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {record.symptoms.length ? (
                          record.symptoms.map((s) => (
                            <span key={s} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">症状なし</span>
                        )}
                      </div>
                      {(record.otherSymptom || record.note) && <div className="mt-3 text-sm text-slate-600">{record.otherSymptom || record.note}</div>}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                    条件に一致する記録がありません。
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              全削除
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}
