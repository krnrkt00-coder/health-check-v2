<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>毎日の健康チェック</title>
  <style>
    :root{
      --bg:#f5f7fb;
      --card:#ffffff;
      --text:#1f2937;
      --muted:#6b7280;
      --line:#e5e7eb;
      --primary:#2563eb;
      --primary2:#1d4ed8;
      --good:#10b981;
      --warn:#f59e0b;
      --bad:#ef4444;
      --shadow: 0 10px 30px rgba(15,23,42,.08);
      --radius:18px;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;
      background: linear-gradient(180deg,#f8fbff 0%, var(--bg) 100%);
      color:var(--text);
    }
    .wrap{
      max-width:1200px;
      margin:0 auto;
      padding:24px 16px 40px;
    }
    .hero{
      display:grid;
      gap:14px;
      margin-bottom:18px;
    }
    .title{
      display:flex;
      align-items:center;
      gap:12px;
      flex-wrap:wrap;
    }
    .badge{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:8px 12px;
      border-radius:999px;
      background:#cfeeff;
      color:#0f5f8f;
      font-weight:700;
      font-size:13px;
    }
    h1{margin:0;font-size:clamp(26px,4vw,38px);line-height:1.2;}
    .sub{color:var(--muted);margin:0;line-height:1.7;}
    .grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:18px;}
    @media (max-width:900px){.grid{grid-template-columns:1fr}}
    .card{
      background:var(--card);
      border:1px solid rgba(229,231,235,.9);
      border-radius:var(--radius);
      box-shadow:var(--shadow);
      padding:18px;
    }
    .card h2{margin:0 0 14px;font-size:18px;}
    .form{display:grid;gap:14px;}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    @media (max-width:640px){.row{grid-template-columns:1fr}}
    label{display:block;font-size:13px;font-weight:700;margin:0 0 6px;color:#374151;}
    input, select, textarea{
      width:100%;border:1px solid var(--line);border-radius:14px;padding:12px 14px;font:inherit;background:#fff;outline:none;transition:.15s;
    }
    textarea{min-height:92px;resize:vertical}
    input:focus, select:focus, textarea:focus{border-color:#93c5fd;box-shadow:0 0 0 4px rgba(37,99,235,.08);}
    .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;}
    button{appearance:none;border:none;border-radius:14px;padding:12px 16px;font:inherit;font-weight:700;cursor:pointer;transition:.15s;}
    .btn-primary{background:var(--primary);color:#fff;}
    .btn-primary:hover{background:var(--primary2)}
    .btn-ghost{background:#eef2ff;color:#3730a3;}
    .btn-danger{background:#fee2e2;color:#b91c1c;}
    .btn-light{background:#f3f4f6;color:#111827;}
    .btn-mini{padding:10px 12px;border-radius:12px;font-size:13px;}
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;}
    @media (max-width:640px){.stats{grid-template-columns:1fr}}
    .stat{background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;padding:14px;}
    .stat .k{font-size:12px;color:var(--muted);margin-bottom:6px;}
    .stat .v{font-size:24px;font-weight:800;}
    .table-wrap{overflow:auto;border:1px solid var(--line);border-radius:16px;}
    table{width:100%;border-collapse:collapse;min-width:760px;background:#fff;}
    thead th{position:sticky;top:0;background:#f8fafc;color:#374151;font-size:13px;text-align:left;border-bottom:1px solid var(--line);padding:12px 10px;white-space:nowrap;}
    tbody td{border-bottom:1px solid #f1f5f9;padding:12px 10px;vertical-align:top;font-size:14px;}
    tbody tr:hover{background:#fbfdff}
    .pill{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap;}
    .ok{background:#dcfce7;color:#166534}
    .ng{background:#fee2e2;color:#991b1b}
    .maybe{background:#fef3c7;color:#92400e}
    .small{color:var(--muted);font-size:12px;line-height:1.6;}
    .footer-note{margin-top:10px;color:var(--muted);font-size:12px;line-height:1.6;}
    .topline{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
    .hint{font-size:13px;color:var(--muted);}
    .person-panel{display:grid;gap:14px;margin-bottom:18px;}
    .person-list{display:flex;flex-wrap:wrap;gap:8px;}
    .person-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;background:#f3f4f6;font-size:13px;}
    .person-chip button{padding:0;width:22px;height:22px;border-radius:999px;background:#e5e7eb;color:#374151;line-height:22px;font-size:14px;}
    .attendance-row{display:flex;gap:12px;flex-wrap:wrap;}
    .attendance-option{display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:#fff;cursor:pointer;user-select:none;}
    .attendance-option input{width:auto;}
    .symptom-grid{display:flex;flex-wrap:wrap;gap:8px;}
    .symptom-chip{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;border-radius:999px;padding:10px 12px;cursor:pointer;}
    .symptom-chip input{width:auto;}
    .divider-space{height:8px;}
    .shared-banner{
      margin:0 0 16px;
      padding:12px 14px;
      border-radius:14px;
      background:#eff6ff;
      color:#1d4ed8;
      border:1px solid #bfdbfe;
      font-size:13px;
      line-height:1.6;
    }
    .modal-backdrop{
      position:fixed;inset:0;background:rgba(15,23,42,.45);display:none;align-items:center;justify-content:center;padding:18px;z-index:9999;
    }
    .modal{
      width:min(520px,100%);background:#fff;border-radius:20px;padding:18px;box-shadow:0 20px 50px rgba(0,0,0,.2);
    }
    .modal h3{margin:0 0 8px;font-size:18px;}
    .modal p{margin:0 0 14px;color:var(--muted);line-height:1.6;}
    .modal-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;}
    .status-badge{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;}
    .status-work{background:#dcfce7;color:#166534;}
    .status-off{background:#f3f4f6;color:#374151;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div class="title">
        <span class="badge">毎日の健康チェック</span>
        <h1>健康記録</h1>
      </div>
      <p class="sub">名前を登録して、毎日の体調を選んで記録できます。記録は共有用ストレージに保存されます。</p>
    </div>

    <div class="shared-banner">
      <strong>共有データについて:</strong> 既定ではブラウザごとの保存です。全員で同じデータを見るには、下の「共有ストレージ設定」でURLとキーを入れてください。
      共有先を設定しない場合は、各端末で別々のデータになります。
    </div>

    <div class="grid">
      <section class="card">
        <div class="topline">
          <h2>共有ストレージ設定</h2>
          <div class="hint">同じURL・同じキーを全員に設定</div>
        </div>
        <div class="row">
          <div>
            <label for="apiBase">共有API URL</label>
            <input id="apiBase" type="text" placeholder="例: https://your-app.vercel.app/api" />
          </div>
          <div>
            <label for="apiKey">共有キー</label>
            <input id="apiKey" type="text" placeholder="例: health-check-001" />
          </div>
        </div>
        <div class="actions">
          <button type="button" id="saveApi" class="btn-primary">保存</button>
          <button type="button" id="testApi" class="btn-ghost">接続確認</button>
        </div>
        <div id="apiStatus" class="footer-note">未設定です。設定すると全員で同じデータを見られます。</div>
      </section>

      <section class="card">
        <div class="topline">
          <h2>名前の登録</h2>
          <div class="hint">追加だけでOKです</div>
        </div>

        <div class="person-panel">
          <div class="row">
            <div>
              <label for="newPerson">登録する名前</label>
              <input id="newPerson" type="text" placeholder="例：田中 太郎" />
            </div>
            <div style="display:flex;align-items:end;gap:10px;">
              <button type="button" id="addPerson" class="btn-primary" style="width:100%;">追加</button>
            </div>
          </div>

          <div>
            <div class="small" style="margin-bottom:8px;">登録済みの名前</div>
            <div id="personList" class="person-list"></div>
          </div>
        </div>

        <h2>入力</h2>
        <form id="checkForm" class="form">
          <div class="row">
            <div>
              <label for="date">日付</label>
              <input id="date" type="date" required />
            </div>
            <div>
              <label for="name">名前</label>
              <select id="name" required>
                <option value="">名前を選択してください</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div>
              <label for="temp">体温（℃）</label>
              <input id="temp" type="number" step="0.1" min="30" max="45" placeholder="例：36.5" required />
            </div>
            <div>
              <label>出勤・休暇</label>
              <div class="attendance-row">
                <label class="attendance-option"><input type="radio" name="attendance" value="出勤" checked /> <span>出勤</span></label>
                <label class="attendance-option"><input type="radio" name="attendance" value="休暇" /> <span>休暇</span></label>
              </div>
            </div>
          </div>

          <div>
            <label>症状</label>
            <div class="symptom-grid">
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="発熱" /> <span>発熱</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="せき" /> <span>せき</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="のどの痛み" /> <span>のどの痛み</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="だるさ" /> <span>だるさ</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="頭痛" /> <span>頭痛</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="腹痛" /> <span>腹痛</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="下痢" /> <span>下痢</span></label>
              <label class="symptom-chip"><input type="checkbox" class="symptom-checkbox" value="吐き気" /> <span>吐き気</span></label>
            </div>
          </div>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">その他の症状</span>
            <input id="otherSymptom" type="text" placeholder="自由記述" />
          </label>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">備考</span>
            <input id="note" type="text" placeholder="連絡事項があれば入力" />
          </label>

          <div class="divider-space"></div>

          <div class="actions">
            <button type="submit" class="btn-primary">登録する</button>
            <button type="button" id="clearForm" class="btn-light">クリア</button>
            <button type="button" id="resetAll" class="btn-danger">全削除</button>
          </div>
        </form>
      </section>
    </div>

    <div class="grid" style="margin-top:18px;">
      <section class="card">
        <h2>集計</h2>
        <div class="stats">
          <div class="stat"><div class="k">登録人数</div><div class="v" id="countPeople">0</div></div>
          <div class="stat"><div class="k">今日の記録</div><div class="v" id="countToday">0</div></div>
          <div class="stat"><div class="k">要確認</div><div class="v" id="countAlert">0</div></div>
        </div>
        <div class="card" style="box-shadow:none;border-radius:16px;border:1px solid #e5e7eb;padding:14px;background:#f8fafc;">
          <div class="topline" style="margin-bottom:8px;">
            <h2 style="margin:0;font-size:16px;">未入力者</h2>
            <div id="selectedDateInfo" class="status-badge status-work">対象日: -</div>
          </div>
          <div id="missingPeople" class="person-list"></div>
        </div>
      </section>

      <section class="card">
        <div class="topline">
          <div>
            <h2>記録一覧</h2>
            <p class="small">日付とキーワードで絞り込みできます。</p>
          </div>
          <div class="hint" id="syncHint">未同期</div>
        </div>
        <div class="row" style="margin-bottom:12px;">
          <label class="relative block">
            <span class="mb-1 block text-sm font-medium text-slate-700">検索</span>
            <input id="search" placeholder="検索..." />
          </label>
          <label class="relative block">
            <span class="mb-1 block text-sm font-medium text-slate-700">日付</span>
            <input id="dateFilter" type="date" />
          </label>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>日付</th>
                <th>名前</th>
                <th>出勤・休暇</th>
                <th>体温</th>
                <th>症状</th>
                <th>備考</th>
                <th>判定</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="list"></tbody>
          </table>
        </div>
      </section>
    </div>
  </div>

  <div id="shareModal" class="modal-backdrop">
    <div class="modal">
      <h3>共有データ設定</h3>
      <p>全員が同じデータを見るには、共有API URLと共有キーが必要です。未設定のままだと、各端末で別々に保存されます。</p>
      <div class="modal-actions">
        <button type="button" id="closeModal" class="btn-light">閉じる</button>
      </div>
    </div>
  </div>

  <script>
    const STORAGE_KEY = "health_check_records_v2";
    const PEOPLE_KEY = "health_check_people_v2";
    const SHARED_CONFIG_KEY = "health_check_shared_config_v1";

    const DEFAULT_PEOPLE = ["佐藤", "鈴木", "高橋", "田中"];
    const symptomOptions = ["発熱","せき","のどの痛み","だるさ","頭痛","腹痛","下痢","吐き気"];

    const form = document.getElementById("checkForm");
    const dateEl = document.getElementById("date");
    const nameEl = document.getElementById("name");
    const tempEl = document.getElementById("temp");
    const otherSymptomEl = document.getElementById("otherSymptom");
    const noteEl = document.getElementById("note");
    const listEl = document.getElementById("list");
    const countPeopleEl = document.getElementById("countPeople");
    const countTodayEl = document.getElementById("countToday");
    const countAlertEl = document.getElementById("countAlert");
    const missingPeopleEl = document.getElementById("missingPeople");
    const selectedDateInfoEl = document.getElementById("selectedDateInfo");
    const searchEl = document.getElementById("search");
    const dateFilterEl = document.getElementById("dateFilter");
    const newPersonEl = document.getElementById("newPerson");
    const addPersonBtn = document.getElementById("addPerson");
    const personListEl = document.getElementById("personList");
    const clearFormBtn = document.getElementById("clearForm");
    const resetAllBtn = document.getElementById("resetAll");
    const syncHintEl = document.getElementById("syncHint");
    const apiBaseEl = document.getElementById("apiBase");
    const apiKeyEl = document.getElementById("apiKey");
    const saveApiBtn = document.getElementById("saveApi");
    const testApiBtn = document.getElementById("testApi");
    const apiStatusEl = document.getElementById("apiStatus");
    const shareModal = document.getElementById("shareModal");
    const closeModal = document.getElementById("closeModal");

    function todayISO() {
      const d = new Date();
      const tz = d.getTimezoneOffset() * 60000;
      return new Date(d - tz).toISOString().slice(0, 10);
    }

    function normalizeName(name) {
      return String(name || "").trim();
    }

    function escapeHTML(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function loadLocalState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { people: [...DEFAULT_PEOPLE], records: [] };
        const parsed = JSON.parse(raw);
        return {
          people: Array.isArray(parsed.people) && parsed.people.length ? parsed.people : [...DEFAULT_PEOPLE],
          records: Array.isArray(parsed.records) ? parsed.records : [],
        };
      } catch {
        return { people: [...DEFAULT_PEOPLE], records: [] };
      }
    }

    function saveLocalState(state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadSharedConfig() {
      try {
        const raw = localStorage.getItem(SHARED_CONFIG_KEY);
        return raw ? JSON.parse(raw) : { apiBase: "", apiKey: "" };
      } catch {
        return { apiBase: "", apiKey: "" };
      }
    }

    function saveSharedConfig(config) {
      localStorage.setItem(SHARED_CONFIG_KEY, JSON.stringify(config));
    }

    async function sharedFetch(path, options = {}) {
      const config = loadSharedConfig();
      if (!config.apiBase || !config.apiKey) return null;
      const url = `${config.apiBase.replace(/\/$/, "")}${path}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "x-health-key": config.apiKey,
          ...(options.headers || {}),
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }

    async function syncToShared() {
      const config = loadSharedConfig();
      if (!config.apiBase || !config.apiKey) {
        syncHintEl.textContent = "未同期（ローカル保存のみ）";
        return;
      }
      try {
        await sharedFetch("/sync", {
          method: "POST",
          body: JSON.stringify({
            people: state.people,
            records: state.records,
          }),
        });
        syncHintEl.textContent = "共有ストレージに保存しました";
      } catch (e) {
        syncHintEl.textContent = "共有ストレージに接続できません";
      }
    }

    async function loadFromShared() {
      const config = loadSharedConfig();
      if (!config.apiBase || !config.apiKey) return null;
      try {
        const data = await sharedFetch("/sync");
        if (data && Array.isArray(data.people) && Array.isArray(data.records)) {
          return {
            people: data.people.length ? data.people : [...DEFAULT_PEOPLE],
            records: data.records,
          };
        }
      } catch {
        return null;
      }
      return null;
    }

    let state = loadLocalState();
    dateEl.value = todayISO();
    dateFilterEl.value = todayISO();
    selectedDateInfoEl.textContent = `対象日: ${todayISO()}`;

    const sharedConfig = loadSharedConfig();
    apiBaseEl.value = sharedConfig.apiBase || "";
    apiKeyEl.value = sharedConfig.apiKey || "";

    function getAttendanceValue() {
      const checked = document.querySelector('input[name="attendance"]:checked');
      return checked ? checked.value : "出勤";
    }

    function setAttendanceValue(value) {
      const target = document.querySelector(`input[name="attendance"][value="${CSS.escape(value)}"]`);
      if (target) target.checked = true;
    }

    function getSymptomValues() {
      return Array.from(document.querySelectorAll(".symptom-checkbox:checked")).map((el) => el.value);
    }

    function clearSymptomValues() {
      document.querySelectorAll(".symptom-checkbox").forEach((el) => (el.checked = false));
    }

    function judge(record) {
      if (record.attendance === "休暇") return { text: "休暇", cls: "status-off" };
      const temp = Number(record.temperature);
      const symptomsCount = (record.symptoms?.length || 0) + (record.otherSymptom ? 1 : 0);
      if ((Number.isFinite(temp) && temp >= 37.5) || symptomsCount > 0) {
        return { text: "注意", cls: "ng" };
      }
      return { text: "正常", cls: "ok" };
    }

    function formatSymptoms(record) {
      const items = [...(record.symptoms || []), record.otherSymptom].filter(Boolean);
      return items.length ? items.join("、") : "-";
    }

    function renderPeopleSelect(selectedValue = "") {
      const current = selectedValue || nameEl.value || state.people[0] || "";
      nameEl.innerHTML = `<option value="">名前を選択してください</option>` + state.people.map((p) => {
        const safe = escapeHTML(p);
        const selected = p === current ? "selected" : "";
        return `<option value="${safe}" ${selected}>${safe}</option>`;
      }).join("");
      if (!current && state.people[0]) nameEl.value = state.people[0];
    }

    function renderPeopleChips() {
      personListEl.innerHTML = state.people.length
        ? state.people.map((p, index) => `
            <span class="person-chip">
              <span>${escapeHTML(p)}</span>
              <button type="button" data-remove-person="${index}" aria-label="削除">×</button>
            </span>
          `).join("")
        : `<span class="small">まだ名前が登録されていません。</span>`;

      document.querySelectorAll("[data-remove-person]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-remove-person"));
          const removed = state.people[idx];
          if (!window.confirm(`${removed} を一覧から削除しますか？`)) return;
          state.people.splice(idx, 1);
          state.records = state.records.filter((r) => r.person !== removed);
          if (state.people.length === 0) state.people = [...DEFAULT_PEOPLE];
          if (!state.people.includes(form.person)) form.person = state.people[0] || "";
          saveLocalState(state);
          syncToShared();
          renderPeopleSelect(form.person);
          renderPeopleChips();
          render();
        });
      });
    }

    function isAbnormal(record) {
      return judge(record).text === "注意";
    }

    function render() {
      const currentDate = dateFilterEl.value || todayISO();
      selectedDateInfoEl.textContent = `対象日: ${currentDate}`;
      const today = todayISO();

      const search = searchEl.value.toLowerCase().trim();
      const visibleRecords = state.records
        .filter((r) => (!dateFilterEl.value ? true : r.date === dateFilterEl.value))
        .filter((r) => {
          const text = `${r.person} ${r.date} ${r.temperature} ${r.attendance} ${formatSymptoms(r)} ${r.note}`.toLowerCase();
          return text.includes(search);
        })
        .sort((a, b) => `${b.date} ${b.createdAt}`.localeCompare(`${a.date} ${a.createdAt}`));

      const dailyRecords = state.records.filter((r) => r.date === currentDate);
      const completedCount = state.people.filter((p) => dailyRecords.some((r) => r.person === p && r.attendance !== "休暇")).length;
      const abnormalCount = dailyRecords.filter((r) => r.attendance !== "休暇" && isAbnormal(r)).length;
      const missingPeople = state.people.filter((p) => !dailyRecords.some((r) => r.person === p) || dailyRecords.some((r) => r.person === p && r.attendance === "休暇"));

      countPeopleEl.textContent = String(state.people.length);
      countTodayEl.textContent = String(state.records.filter((r) => r.date === today && r.attendance !== "休暇").length);
      countAlertEl.textContent = String(abnormalCount);

      missingPeopleEl.innerHTML = missingPeople.length
        ? missingPeople.map((p) => `<span class="pill maybe">${escapeHTML(p)}</span>`).join("")
        : `<span class="small">すべて入力済みです。</span>`;

      const attendanceText = getAttendanceValue();
      const rows = visibleRecords.map((record) => {
        const j = judge(record);
        const tempText = record.attendance === "休暇" ? "-" : (record.temperature ? `${record.temperature} ℃` : "-");
        return `
          <tr>
            <td>${escapeHTML(record.date)}</td>
            <td>${escapeHTML(record.person)}</td>
            <td><span class="status-badge ${record.attendance === "休暇" ? "status-off" : "status-work"}">${escapeHTML(record.attendance || "出勤")}</span></td>
            <td>${escapeHTML(tempText)}</td>
            <td>${escapeHTML(formatSymptoms(record))}</td>
            <td>${escapeHTML(record.note || "-")}</td>
            <td><span class="pill ${j.cls}">${j.text}</span></td>
            <td><button type="button" class="btn-light btn-mini" data-del="${record.id}">削除</button></td>
          </tr>
        `;
      }).join("");

      listEl.innerHTML = rows || `<tr><td colspan="8" class="px-4 py-10 text-center text-slate-500">条件に一致する記録がありません。</td></tr>`;

      document.querySelectorAll("[data-del]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-del");
          state.records = state.records.filter((r) => r.id !== id);
          saveLocalState(state);
          syncToShared();
          render();
        });
      });

      apiStatusEl.textContent = loadSharedConfig().apiBase && loadSharedConfig().apiKey
        ? `共有設定あり: ${loadSharedConfig().apiBase}`
        : "未設定です。設定すると全員で同じデータを見られます。";

      return attendanceText;
    }

    async function initSharedLoad() {
      const shared = await loadFromShared();
      if (shared) {
        state = shared;
        saveLocalState(state);
      }
      renderPeopleSelect(state.people[0] || "");
      renderPeopleChips();
      render();
    }

    addPersonBtn.addEventListener("click", () => {
      const trimmed = normalizeName(newPersonEl.value);
      if (!trimmed) return;
      if (!state.people.includes(trimmed)) {
        state.people.push(trimmed);
        state.people.sort((a, b) => a.localeCompare(b, "ja"));
        saveLocalState(state);
        syncToShared();
      }
      newPersonEl.value = "";
      renderPeopleSelect(trimmed);
      renderPeopleChips();
      render();
    });

    newPersonEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addPersonBtn.click();
      }
    });

    saveApiBtn.addEventListener("click", async () => {
      const config = {
        apiBase: apiBaseEl.value.trim(),
        apiKey: apiKeyEl.value.trim(),
      };
      saveSharedConfig(config);
      apiStatusEl.textContent = config.apiBase && config.apiKey ? "共有設定を保存しました。" : "未設定です。";
      await syncToShared();
      const shared = await loadFromShared();
      if (shared) {
        state = shared;
        saveLocalState(state);
        renderPeopleSelect(form.person);
        renderPeopleChips();
        render();
      }
    });

    testApiBtn.addEventListener("click", async () => {
      const config = loadSharedConfig();
      if (!config.apiBase || !config.apiKey) {
        shareModal.style.display = "flex";
        return;
      }
      try {
        const res = await sharedFetch("/sync");
        apiStatusEl.textContent = res ? "接続できました。" : "接続できませんでした。";
      } catch {
        apiStatusEl.textContent = "接続できませんでした。";
      }
    });

    closeModal.addEventListener("click", () => {
      shareModal.style.display = "none";
    });

    shareModal.addEventListener("click", (e) => {
      if (e.target === shareModal) shareModal.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.person) return;
      const attendance = getAttendanceValue();
      const selectedSymptoms = getSymptomValues();
      const nextRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        person: form.person,
        date: form.date,
        attendance,
        temperature: attendance === "休暇" ? "" : form.temperature,
        symptoms: attendance === "休暇" ? [] : selectedSymptoms,
        otherSymptom: attendance === "休暇" ? "" : otherSymptomEl.value.trim(),
        note: attendance === "休暇" ? "休暇" : noteEl.value.trim(),
        createdAt: new Date().toISOString(),
      };

      state.records = state.records.filter((r) => !(r.person === nextRecord.person && r.date === nextRecord.date));
      state.records.unshift(nextRecord);
      saveLocalState(state);
      await syncToShared();

      dateFilterEl.value = form.date;
      selectedDateInfoEl.textContent = `対象日: ${form.date}`;
      if (attendance !== "休暇") {
        tempEl.value = "";
        otherSymptomEl.value = "";
        noteEl.value = "";
        clearSymptomValues();
      }
      render();
    });

    clearFormBtn.addEventListener("click", () => {
      tempEl.value = "";
      otherSymptomEl.value = "";
      noteEl.value = "";
      clearSymptomValues();
      setAttendanceValue("出勤");
      render();
    });

    resetAllBtn.addEventListener("click", async () => {
      if (!window.confirm("すべての記録を削除しますか？")) return;
      state = { people: [...DEFAULT_PEOPLE], records: [] };
      saveLocalState(state);
      await syncToShared();
      form.person = state.people[0] || "";
      form.date = todayISO();
      form.temperature = "";
      form.symptoms = [];
      form.otherSymptom = "";
      form.note = "";
      dateEl.value = todayISO();
      dateFilterEl.value = todayISO();
      searchEl.value = "";
      newPersonEl.value = "";
      setAttendanceValue("出勤");
      clearSymptomValues();
      renderPeopleSelect(form.person);
      renderPeopleChips();
      render();
    });

    searchEl.addEventListener("input", render);
    dateFilterEl.addEventListener("change", render);
    document.querySelectorAll('.symptom-checkbox').forEach((el) => {
      el.addEventListener('change', render);
    });
    document.querySelectorAll('input[name="attendance"]').forEach((el) => {
      el.addEventListener('change', render);
    });
    [tempEl, otherSymptomEl, noteEl].forEach((el) => el.addEventListener("input", render));

    initSharedLoad();
  </script>
</body>
</html>
