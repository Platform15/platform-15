/* =========================================================
   منصة 15 — الهيكل المشترك (Header + Sidebar + Admin FAB)
   ========================================================= */

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
  courses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  projects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`,
  quiz: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="2"/></svg>`,
  tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>`,
  network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v6M12 13l-5.5 4M12 13l5.5 4"/></svg>`,
  security: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/></svg>`,
  community: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  messages: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v14H7l-3 3z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.7 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9.06A1.7 1.7 0 0 0 10.1 3l0-.09a2 2 0 0 1 4 0V3a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9.06c.14.6.55 1.1 1.13 1.34H21a2 2 0 0 1 0 4h-.09c-.6.14-1.1.55-1.34 1.13z"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>`
};

const NAV = [
  { group: "التعلّم", icon: "📚", items: [
    { key: "dashboard", label: "الرئيسية", href: "index.html", icon: ICONS.home },
    { key: "courses", label: "الدورات", href: "courses.html", icon: ICONS.courses },
    { key: "projects", label: "المشاريع", href: "projects.html", icon: ICONS.projects },
    { key: "quizzes", label: "الاختبارات", href: "quizzes.html", icon: ICONS.quiz }
  ]},
  { group: "الأدوات", icon: "🧰", items: [
    { key: "ide", label: "IDE", href: "tools.html#ide", icon: ICONS.tools },
    { key: "terminal", label: "Terminal", href: "tools.html#terminal", icon: ICONS.tools }
  ]},
  { group: "المجتمع", icon: "👥", items: [
    { key: "community", label: "المنشورات", href: "community.html", icon: ICONS.community },
    { key: "chatrooms", label: "غرف الدردشة", href: "chatrooms.html", icon: ICONS.chat },
    { key: "messages", label: "الرسائل", href: "messages.html", icon: ICONS.messages, badgeKey: "messages" }
  ]},
  { group: "الحساب", icon: "⚙️", items: [
    { key: "notifications", label: "إشعاراتي", href: "notifications.html", icon: ICONS.bell, badgeKey: "notifications" },
    { key: "profile", label: "ملفي الشخصي", href: "profile.html", icon: ICONS.user },
    { key: "settings", label: "الإعدادات", href: "settings.html", icon: ICONS.settings }
  ]}
];

function unreadCount(kind){
  if(kind === "notifications") return STATE.notifications.filter(n=>n.unread).length;
  if(kind === "messages") return STATE.messages.reduce((a,m)=>a+m.unread,0);
  return 0;
}

function buildHeader(){
  const u = STATE.user;
  return `
  <header class="app-header">
    <button class="header-menu-btn" id="sidebarToggle" aria-label="القائمة">☰</button>
    <a href="index.html" class="brand"><span class="brand-badge">15</span><span class="brand-name">منصة</span></a>
    <button class="header-menu-btn header-search-toggle" id="searchToggle" aria-label="بحث">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    </button>
    <div class="header-search" id="headerSearch">
      <input type="text" placeholder="ابحث عن درس، دورة، أو أي شيء...">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    </div>
    <div class="header-actions">
      <button class="icon-btn" id="themeToggle" title="الوضع الليلي/النهاري">🌙</button>
      <a class="icon-btn" href="notifications.html" title="الإشعارات">
        ${ICONS.bell}
        ${unreadCount('notifications') ? `<span class="badge-dot">${unreadCount('notifications')}</span>` : ""}
      </a>
      <div class="header-account">
        <button class="flex items-center gap-8" id="accountBtn" style="background:none;border:none;color:inherit;">
          <div class="avatar-fallback">${u.name.charAt(0)}</div>
          <div class="account-info"><b>${u.name}</b><span>مستخدم</span></div>
        </button>
        <div class="account-menu" id="accountMenu">
          <a href="profile.html">${ICONS.user} ملفي الشخصي</a>
          <a href="settings.html">${ICONS.settings} الإعدادات</a>
          <hr>
          <a href="login.html" id="logoutLink">${ICONS.logout} تسجيل خروج</a>
        </div>
      </div>
    </div>
  </header>`;
}

function buildSidebar(activeKey){
  const groups = NAV.map(g => `
    <div class="sidebar-group">
      <div class="sidebar-group-label"><span>${g.icon}</span> ${g.group}</div>
      ${g.items.map(it => {
        const count = it.badgeKey ? unreadCount(it.badgeKey) : 0;
        return `<a class="sidebar-link ${it.key===activeKey?'active':''}" href="${it.href}">
          ${it.icon}<span>${it.label}</span>
          ${count ? `<span class="mini-badge">${count}</span>` : ""}
        </a>`;
      }).join("")}
    </div>`).join("");

  return `
  <aside class="sidebar" id="sidebar">
    ${groups}
    <div class="sidebar-cta">
      <b>15</b>
      <p>معًا نحو مستقبل أفضل</p>
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
}

function buildAdminFab(){
  if(!STATE.user.isAdmin) return "";
  return `
  <button class="admin-fab" id="adminFabBtn" title="إنشاء جديد">＋</button>
  <div class="admin-menu" id="adminMenu">
    <a href="#">📚 دورة جديدة</a>
    <a href="#">📖 وحدة جديدة</a>
    <a href="#" id="newLessonMenuItem">📝 درس جديد</a>
    <a href="#">🧪 مشروع جديد</a>
    <a href="#">❓ اختبار جديد</a>
    <a href="#">💬 منشور جديد</a>
    <a href="#" id="newAdMenuItem">📢 إعلان جديد</a>
  </div>`;
}

/* =========================================================
   نافذة "درس جديد" — تظهر فقط للأدمن، عبر زر ＋ العائم.
   تحتوي محرر كود بتلوين فعلي حيّ (Syntax Highlighting) باستخدام
   Prism.js، يُحمَّل بشكل كسول (lazy) فقط عند فتح النافذة أول مرة
   حتى لا يُبطئ تحميل بقية الصفحات.
   ========================================================= */
const LESSON_CODE_LANGS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "markup", label: "HTML" },
  { value: "css", label: "CSS" }
];

function buildLessonModal(){
  if(!STATE.user.isAdmin) return "";
  return `
  <div class="modal-overlay" id="lessonModalOverlay">
    <div class="modal-panel" style="max-width:560px;">
      <h3>📝 إنشاء درس جديد</h3>
      <form id="lessonForm">
        <div class="row-2col" style="grid-template-columns:1fr 1fr;gap:10px;">
          <div class="field">
            <label>الدورة</label>
            <select id="lessonCourseSelect" required></select>
          </div>
          <div class="field">
            <label>الوحدة</label>
            <select id="lessonModuleSelect" required></select>
          </div>
        </div>
        <div class="field">
          <label>عنوان الدرس</label>
          <input id="lessonTitleInput" type="text" placeholder="مثال: المصفوفات ثنائية الأبعاد" required maxlength="80">
        </div>
        <div class="field">
          <label>وصف الدرس (اختياري)</label>
          <textarea id="lessonContentInput" rows="2" placeholder="ملخص قصير عن محتوى الدرس..." maxlength="600"></textarea>
        </div>
        <div class="field">
          <label class="flex items-center justify-between" style="margin-bottom:6px;">
            <span>مقتطف كود الدرس (اختياري) — يُلوَّن تلقائيًا أثناء الكتابة</span>
          </label>
          <select id="lessonCodeLang" style="width:auto;margin-bottom:8px;">
            ${LESSON_CODE_LANGS.map(l => `<option value="${l.value}">${l.label}</option>`).join("")}
          </select>
          <div class="code-editor" id="lessonCodeEditor">
            <pre class="code-highlight" id="lessonCodeHighlight" aria-hidden="true"><code class="language-javascript" id="lessonCodeHighlightInner"></code></pre>
            <textarea id="lessonCodeInput" class="code-input" spellcheck="false" placeholder="اكتب أو الصق كود الدرس هنا..."></textarea>
          </div>
        </div>
        <div class="flex gap-8" style="margin-top:6px;">
          <button type="button" class="btn btn-outline btn-block" id="cancelLessonBtn">إلغاء</button>
          <button type="submit" class="btn btn-gold btn-block" id="submitLessonBtn">إنشاء الدرس</button>
        </div>
      </form>
    </div>
  </div>`;
}

/* =========================================================
   نافذة "إعلان جديد" — تظهر فقط للأدمن، عبر زر ＋ العائم.
   تأخذ فقط معرّف الناشر (Publisher ID) ومعرّف وحدة الإعلان
   (Ad Slot ID) من حساب Google AdSense الخاص بك — لا حاجة للصق
   أي كود HTML/JS، الوسم الحقيقي يُبنى تلقائيًا عند العرض.
   ========================================================= */
function buildAdModal(){
  if(!STATE.user.isAdmin) return "";
  return `
  <div class="modal-overlay" id="adModalOverlay">
    <div class="modal-panel" style="max-width:480px;">
      <h3>📢 نشر إعلان Google AdSense</h3>
      <p class="section-sub" style="margin-top:-6px;">
        من لوحة تحكم AdSense: أنشئ وحدة إعلانية جديدة، ثم انسخ من كودها
        <b>معرّف الناشر</b> (data-ad-client) و<b>معرّف الوحدة</b> (data-ad-slot)
        وألصقهما هنا. سيظهر الإعلان تلقائيًا ضمن بطاقة "📢 إعلاناتك" في الصفحة الرئيسية.
      </p>
      <form id="adForm">
        <div class="field">
          <label>تسمية داخلية (لتمييزه في القائمة فقط، اختياري)</label>
          <input id="adLabelInput" type="text" placeholder="مثال: بانر الصفحة الرئيسية" maxlength="60">
        </div>
        <div class="field">
          <label>معرّف الناشر (Publisher ID)</label>
          <input id="adClientInput" type="text" placeholder="ca-pub-XXXXXXXXXXXXXXXX" required pattern="ca-pub-[0-9]{10,20}" style="direction:ltr;text-align:left;">
        </div>
        <div class="field">
          <label>معرّف وحدة الإعلان (Ad Slot ID)</label>
          <input id="adSlotInput" type="text" placeholder="1234567890" required pattern="[0-9]{6,15}" style="direction:ltr;text-align:left;">
        </div>
        <div class="field">
          <label>تنسيق الإعلان</label>
          <select id="adFormatSelect">
            <option value="auto" selected>تلقائي / متجاوب (موصى به)</option>
            <option value="rectangle">مستطيل ثابت (300×250)</option>
            <option value="horizontal">شريط أفقي</option>
          </select>
        </div>
        <div class="flex gap-8" style="margin-top:6px;">
          <button type="button" class="btn btn-outline btn-block" id="cancelAdBtn">إلغاء</button>
          <button type="submit" class="btn btn-gold btn-block" id="submitAdBtn">نشر الإعلان</button>
        </div>
      </form>
    </div>
  </div>`;
}

let __prismLoadPromise = null;
function ensurePrismLoaded(){
  if(window.Prism) return Promise.resolve();
  if(__prismLoadPromise) return __prismLoadPromise;
  const PRISM_VERSION = "1.29.0";
  const BASE = `https://cdnjs.cloudflare.com/ajax/libs/prism/${PRISM_VERSION}`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${BASE}/themes/prism-tomorrow.min.css`;
  document.head.appendChild(link);

  __prismLoadPromise = new Promise((resolve) => {
    const core = document.createElement("script");
    core.src = `${BASE}/prism.min.js`;
    core.onload = () => {
      const autoloader = document.createElement("script");
      autoloader.src = `${BASE}/plugins/autoloader/prism-autoloader.min.js`;
      autoloader.onload = () => {
        if(window.Prism && Prism.plugins && Prism.plugins.autoloader){
          Prism.plugins.autoloader.languages_path = `${BASE}/components/`;
        }
        resolve();
      };
      autoloader.onerror = () => resolve(); // نكمل بدون تلوين لو فشل التحميل (لا كسر للنموذج)
      document.head.appendChild(autoloader);
    };
    core.onerror = () => resolve();
    document.head.appendChild(core);
  });
  return __prismLoadPromise;
}

function highlightLessonCode(){
  const textarea = document.getElementById("lessonCodeInput");
  const codeEl = document.getElementById("lessonCodeHighlightInner");
  if(!textarea || !codeEl) return;
  const lang = document.getElementById("lessonCodeLang").value;
  const code = textarea.value;
  codeEl.className = "language-" + lang;

  if(window.Prism && Prism.languages && Prism.languages[lang]){
    codeEl.innerHTML = Prism.highlight(code + "\n", Prism.languages[lang], lang);
  }else if(window.Prism){
    // اللغة لم تُحمَّل بعد عبر autoloader — أعد المحاولة بعد لحظة قصيرة
    codeEl.textContent = code + "\n";
    setTimeout(() => { if(document.getElementById("lessonCodeInput")) highlightLessonCode(); }, 300);
  }else{
    codeEl.textContent = code + "\n";
  }
}

function syncLessonEditorScroll(){
  const ta = document.getElementById("lessonCodeInput");
  const pre = document.getElementById("lessonCodeHighlight");
  if(!ta || !pre) return;
  pre.scrollTop = ta.scrollTop;
  pre.scrollLeft = ta.scrollLeft;
}

function populateLessonCourseSelect(){
  const sel = document.getElementById("lessonCourseSelect");
  if(!sel) return;
  const eligible = STATE.courses.filter(c => Array.isArray(c.modules) && c.modules.length);
  sel.innerHTML = eligible.map(c => `<option value="${c.id}">${c.icon} ${escapeHTML(c.title)}</option>`).join("");
  populateLessonModuleSelect();
}
function populateLessonModuleSelect(){
  const courseSel = document.getElementById("lessonCourseSelect");
  const modSel = document.getElementById("lessonModuleSelect");
  if(!courseSel || !modSel) return;
  const course = STATE.courses.find(c => c.id === courseSel.value) || STATE.courses.find(c => Array.isArray(c.modules) && c.modules.length);
  if(!course) { modSel.innerHTML = ""; return; }
  modSel.innerHTML = course.modules.map((m, i) => `<option value="${i}">${i+1}. ${escapeHTML(m.title)}</option>`).join("");
}

function openLessonModal(){
  populateLessonCourseSelect();
  document.getElementById("lessonModalOverlay").classList.add("open");
  ensurePrismLoaded().then(highlightLessonCode);
}
function closeLessonModal(){
  const overlay = document.getElementById("lessonModalOverlay");
  overlay.classList.remove("open");
  document.getElementById("lessonForm").reset();
  highlightLessonCode();
}

function initLessonModal(){
  if(!document.getElementById("lessonModalOverlay")) return; // غير أدمن — لا نافذة أصلًا

  const newLessonItem = document.getElementById("newLessonMenuItem");
  newLessonItem?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("adminMenu")?.classList.remove("open");
    openLessonModal();
  });

  document.getElementById("cancelLessonBtn").addEventListener("click", closeLessonModal);
  document.getElementById("lessonModalOverlay").addEventListener("click", (e) => {
    if(e.target.id === "lessonModalOverlay") closeLessonModal();
  });

  document.getElementById("lessonCourseSelect").addEventListener("change", populateLessonModuleSelect);
  document.getElementById("lessonCodeLang").addEventListener("change", highlightLessonCode);

  const codeInput = document.getElementById("lessonCodeInput");
  codeInput.addEventListener("input", highlightLessonCode);
  codeInput.addEventListener("scroll", syncLessonEditorScroll);
  // مزامنة عرض التاب (Tab) داخل الكود بدل الانتقال بين الحقول
  codeInput.addEventListener("keydown", (e) => {
    if(e.key === "Tab"){
      e.preventDefault();
      const start = codeInput.selectionStart, end = codeInput.selectionEnd;
      codeInput.value = codeInput.value.slice(0, start) + "  " + codeInput.value.slice(end);
      codeInput.selectionStart = codeInput.selectionEnd = start + 2;
      highlightLessonCode();
    }
  });

  document.getElementById("lessonForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const courseId = document.getElementById("lessonCourseSelect").value;
    const moduleIndex = parseInt(document.getElementById("lessonModuleSelect").value, 10);
    const title = document.getElementById("lessonTitleInput").value.trim();
    if(!title) return;
    const content = document.getElementById("lessonContentInput").value.trim();
    const codeLang = document.getElementById("lessonCodeLang").value;
    const code = document.getElementById("lessonCodeInput").value;

    const submitBtn = document.getElementById("submitLessonBtn");
    submitBtn.disabled = true; submitBtn.textContent = "جارٍ الإنشاء...";

    const created = addLessonToModule(courseId, moduleIndex, { title, content, code, codeLang });

    submitBtn.disabled = false; submitBtn.textContent = "إنشاء الدرس";

    if(created){
      showToast("✅ تم إنشاء الدرس بنجاح");
      closeLessonModal();
    }else{
      showToast("⚠️ تعذّر إنشاء الدرس — تحقّق من العنوان");
    }
  });
}

function openAdModal(){
  document.getElementById("adModalOverlay").classList.add("open");
}
function closeAdModal(){
  const overlay = document.getElementById("adModalOverlay");
  overlay.classList.remove("open");
  document.getElementById("adForm").reset();
}

function initAdModal(){
  if(!document.getElementById("adModalOverlay")) return; // غير أدمن — لا نافذة أصلًا

  const newAdItem = document.getElementById("newAdMenuItem");
  newAdItem?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("adminMenu")?.classList.remove("open");
    openAdModal();
  });

  document.getElementById("cancelAdBtn").addEventListener("click", closeAdModal);
  document.getElementById("adModalOverlay").addEventListener("click", (e) => {
    if(e.target.id === "adModalOverlay") closeAdModal();
  });

  document.getElementById("adForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const label = document.getElementById("adLabelInput").value.trim();
    const clientId = document.getElementById("adClientInput").value.trim();
    const slotId = document.getElementById("adSlotInput").value.trim();
    const format = document.getElementById("adFormatSelect").value;

    const submitBtn = document.getElementById("submitAdBtn");
    submitBtn.disabled = true; submitBtn.textContent = "جارٍ النشر...";

    const { ad, shared, error } = await createAd({ label, clientId, slotId, format });

    submitBtn.disabled = false; submitBtn.textContent = "نشر الإعلان";

    if(!ad){
      showToast("⚠️ تحقّق من صيغة معرّف الناشر (ca-pub-...) ومعرّف الوحدة (أرقام فقط)");
      return;
    }
    showToast(shared ? "✅ تم نشر الإعلان — يظهر الآن لكل المستخدمين" : "✅ تم حفظ الإعلان محليًا فقط عندك");
    closeAdModal();
  });
}

async function guardAuth(){
  // لا يعمل الحارس إلا إذا تم إعداد Supabase فعليًا؛ غير ذلك تبقى المنصة مفتوحة كما كانت
  if(!window.supabaseClient) return;
  try{
    const { data: { session } } = await supabaseClient.auth.getSession();
    if(!session) location.href = "login.html";
  }catch(e){
    console.warn("تعذّر التحقق من الجلسة:", e.message || e);
  }
}
guardAuth();

function initShell(){
  const body = document.body;
  const activeKey = body.dataset.page || "";
  document.getElementById("shell-header").innerHTML = buildHeader();
  document.getElementById("shell-sidebar").innerHTML = buildSidebar(activeKey);

  const fabHolder = document.createElement("div");
  fabHolder.innerHTML = buildAdminFab() + buildLessonModal() + buildAdModal();
  while(fabHolder.firstChild) document.body.appendChild(fabHolder.firstChild);
  initLessonModal();
  initAdModal();

  // Sidebar toggle (mobile)
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  document.getElementById("sidebarToggle").addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
  });
  overlay.addEventListener("click", ()=>{
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  });

  // Search toggle (mobile)
  const searchToggle = document.getElementById("searchToggle");
  if(searchToggle){
    searchToggle.addEventListener("click", ()=>{
      document.getElementById("headerSearch").classList.toggle("open");
    });
  }

  // Account dropdown
  const accountBtn = document.getElementById("accountBtn");
  const accountMenu = document.getElementById("accountMenu");
  accountBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    accountMenu.classList.toggle("open");
  });
  document.addEventListener("click", ()=> accountMenu.classList.remove("open"));

  // Logout (Supabase sign-out عند التوفّر)
  const logoutLink = document.getElementById("logoutLink");
  if(logoutLink && window.supabaseClient){
    logoutLink.addEventListener("click", async (e)=>{
      e.preventDefault();
      await supabaseClient.auth.signOut();
      location.href = "login.html";
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("mansa15_theme") || "dark";
  if(savedTheme==="light"){ document.documentElement.setAttribute("data-theme","light"); themeBtn.textContent="☀️"; }
  themeBtn.addEventListener("click", ()=>{
    const isLight = document.documentElement.getAttribute("data-theme")==="light";
    if(isLight){ document.documentElement.removeAttribute("data-theme"); themeBtn.textContent="🌙"; localStorage.setItem("mansa15_theme","dark"); }
    else{ document.documentElement.setAttribute("data-theme","light"); themeBtn.textContent="☀️"; localStorage.setItem("mansa15_theme","light"); }
  });

  // Admin fab menu
  bindAdminFabToggle();
}

function bindAdminFabToggle(){
  const adminBtn = document.getElementById("adminFabBtn");
  if(!adminBtn) return;
  const adminMenu = document.getElementById("adminMenu");
  adminBtn.addEventListener("click", (e)=>{ e.stopPropagation(); adminMenu.classList.toggle("open"); });
  document.addEventListener("click", ()=> adminMenu.classList.remove("open"));
}

/* =========================================================
   في الوضع السحابي (Supabase)، القيمة المحلية لـ STATE.user.isAdmin
   غير موثوقة عند التحميل الأول (تبدأ false افتراضيًا لكل مستخدم
   جديد ريثما يتأكّد checkIsAdmin() في data.js من جدول admins
   الحقيقي). هذا المستمع يُظهر أزرار الأدمن فعليًا فقط بعد ذلك
   التأكيد، ويخفيها إن كانت القيمة المحلية القديمة (المخزَّنة سابقًا
   في هذا المتصفح) خاطئة.
   ========================================================= */
document.addEventListener("adminStatusReady", (e) => {
  const isAdmin = !!(e.detail && e.detail.isAdmin);

  if(isAdmin && !document.getElementById("adminFabBtn")){
    const holder = document.createElement("div");
    holder.innerHTML = buildAdminFab() + buildLessonModal() + buildAdModal();
    while(holder.firstChild) document.body.appendChild(holder.firstChild);
    initLessonModal();
    initAdModal();
    bindAdminFabToggle();
  }

  if(!isAdmin){
    document.getElementById("adminFabBtn")?.remove();
    document.getElementById("adminMenu")?.remove();
    document.getElementById("lessonModalOverlay")?.remove();
    document.getElementById("adModalOverlay")?.remove();
  }
});

if(localStorage.getItem("mansa15_theme")==="light"){
  document.documentElement.setAttribute("data-theme","light");
}
document.addEventListener("DOMContentLoaded", initShell);

function showToast(msg){
  let t = document.getElementById("toast");
  if(!t){ t = document.createElement("div"); t.id="toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> t.classList.remove("show"), 2600);
}
