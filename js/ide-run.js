/* =========================================================
   منصة 15 — تنفيذ حقيقي للكود داخل المتصفح (بدون سيرفر)
   -----------------------------------------------------------
   - JavaScript: ينفَّذ فعليًا داخل iframe معزول (sandbox) — آمن
     لأنه لا يستطيع الوصول لصفحة المنصة نفسها أو أي كوكيز/بيانات.
   - Python: عبر Pyodide (Python مُصرَّف إلى WebAssembly) — ينفَّذ
     بالكامل في متصفح المستخدم، مجاني تمامًا وبلا أي تكلفة سيرفر.
   - C++ وغيرها: تحتاج مترجم حقيقي (مرحلة قادمة عبر حاويات
     معزولة كما في خارطة الطريق) — لا نزيّف نتيجتها هنا.
   ========================================================= */

/* =========================================================
   طبقة تشغيل اللغات المُصرَّفة (C++ الآن عبر Piston، وكل اللغات
   لاحقًا عبر Judge0 المُستضاف ذاتيًا)
   -----------------------------------------------------------
   المرحلة الحالية (قبل 10,000 متابع): Piston API العامة المجانية
   (https://github.com/engineer-man/piston) — بدون أي سيرفر خاص بنا،
   ولا حاجة لأي حساب أو مفتاح. حد استخدام تقريبي: ~5 طلبات/ثانية
   لكل IP، وبدون ضمان توفر رسمي (خدمة مجتمعية تطوعية مجانية).

   المرحلة القادمة (بعد 10,000 متابع): Judge0 مُستضاف ذاتيًا على
   VPS رخيص (~5-7$/شهر). للتفعيل حينها:
     1) شغّل Judge0 عبر Docker على سيرفرك (راجع docs.judge0.com).
     2) بدّل COMPILER_BACKEND أدناه إلى "judge0".
     3) ضع رابط سيرفرك في JUDGE0_BASE_URL أدناه.
   كل اللغات (Python, C++, C, Java, Go, Rust...) تعمل تلقائيًا
   حينها بدون أي تعديل إضافي في هذا الملف — الكود مكتوب مسبقًا
   ليدعم أي لغة يوفّرها سيرفر Judge0 عبر جلب قائمة لغاته ديناميكيًا.
   ========================================================= */

const COMPILER_BACKEND = "piston"; // "piston" (الآن) | "judge0" (بعد 10,000 متابع)
const JUDGE0_BASE_URL = "";        // ضع رابط سيرفر Judge0 الخاص بك هنا عند الانتقال إليه

const PISTON_BASE = "https://emkc.org/api/v2/piston";
let _pistonRuntimes = null;

async function getPistonRuntime(langKey){
  if(!_pistonRuntimes){
    const res = await fetch(`${PISTON_BASE}/runtimes`);
    _pistonRuntimes = await res.json();
  }
  const match = _pistonRuntimes.find(r => r.language === langKey || (r.aliases||[]).includes(langKey));
  if(!match) throw new Error(`اللغة ${langKey} غير مدعومة حاليًا عبر Piston`);
  return match;
}

async function runViaPiston(langKey, code){
  const rt = await getPistonRuntime(langKey);
  const res = await fetch(`${PISTON_BASE}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: rt.language, version: rt.version, files: [{ content: code }] })
  });
  if(!res.ok) throw new Error("تعذّر الاتصال بخدمة التشغيل العامة (Piston) — قد يكون هناك ضغط مؤقت، حاول بعد قليل");
  const data = await res.json();
  let out = "";
  if(data.compile && (data.compile.stderr || data.compile.code !== 0)){
    out += "🔧 أخطاء الترجمة (Compile):\n" + (data.compile.stderr || data.compile.output || "") + "\n\n";
  }
  if(data.run){
    if(data.run.stdout) out += data.run.stdout;
    if(data.run.stderr) out += "\n❌ " + data.run.stderr;
  }
  return out.trim() || "(نُفّذ الكود بدون أي مخرجات)";
}

async function runViaJudge0(langName, code){
  if(!JUDGE0_BASE_URL) throw new Error("لم يُضبط رابط سيرفر Judge0 بعد — راجع JUDGE0_BASE_URL في أعلى js/ide-run.js");
  const langsRes = await fetch(`${JUDGE0_BASE_URL}/languages`);
  const langs = await langsRes.json();
  const found = langs.find(l => l.name.toLowerCase().includes(langName.toLowerCase()));
  if(!found) throw new Error(`اللغة ${langName} غير متاحة على سيرفر Judge0 الحالي`);
  const submitRes = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_code: code, language_id: found.id })
  });
  if(!submitRes.ok) throw new Error("تعذّر الاتصال بسيرفر Judge0 الخاص بك");
  const data = await submitRes.json();
  const out = (data.compile_output ? "🔧 " + data.compile_output + "\n\n" : "") + (data.stdout || "") + (data.stderr ? "\n❌ " + data.stderr : "");
  return out.trim() || "(بدون مخرجات)";
}

async function runCompiledLanguage(pistonLangKey, judge0LangName, code){
  return COMPILER_BACKEND === "judge0" ? runViaJudge0(judge0LangName, code) : runViaPiston(pistonLangKey, code);
}

let _pyodideInstance = null;
let _pyodideLoading = null;

async function ensurePyodide(onStatus){
  if(_pyodideInstance) return _pyodideInstance;
  if(_pyodideLoading) return _pyodideLoading;
  _pyodideLoading = (async ()=>{
    if(onStatus) onStatus("جاري تحميل مترجم بايثون (Pyodide) لأول مرة... قد يستغرق بضع ثوانٍ");
    if(!window.loadPyodide){
      await new Promise((resolve, reject)=>{
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
        s.onload = resolve;
        s.onerror = () => reject(new Error("تعذّر تحميل Pyodide — تحقق من اتصال الإنترنت"));
        document.head.appendChild(s);
      });
    }
    _pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" });
    return _pyodideInstance;
  })();
  return _pyodideLoading;
}

function runJavaScriptSandboxed(code){
  return new Promise((resolve)=>{
    const logs = [];
    const iframe = document.createElement("iframe");
    iframe.sandbox = "allow-scripts"; // بلا allow-same-origin: لا يمكنه لمس صفحة المنصة أو تخزينها
    iframe.style.display = "none";
    const listener = (ev)=>{
      if(!ev.data || ev.data.__mansa15_run !== true) return;
      window.removeEventListener("message", listener);
      iframe.remove();
      resolve(ev.data.logs.join("\n") || "(نُفّذ الكود بدون أي مخرجات console.log)");
    };
    window.addEventListener("message", listener);
    const userCode = String(code).replace(/<\/script>/g, "<\\/script>");
    iframe.srcdoc = `<script>
      const logs = [];
      const cap = (...a) => logs.push(a.map(x => { try { return typeof x === "string" ? x : JSON.stringify(x); } catch(e){ return String(x); } }).join(" "));
      console.log = cap; console.error = (...a)=>cap("❌", ...a); console.warn = (...a)=>cap("⚠️", ...a);
      try {
        ${userCode}
      } catch(e) {
        logs.push("❌ خطأ: " + e.message);
      }
      parent.postMessage({ __mansa15_run: true, logs }, "*");
    <\/script>`;
    document.body.appendChild(iframe);
    setTimeout(()=>{ // حماية من كود يعلق في حلقة لا نهائية
      window.removeEventListener("message", listener);
      if(iframe.parentNode){ iframe.remove(); resolve("⏱️ توقّف التنفيذ (تجاوز الوقت المسموح — تحقق من عدم وجود حلقة لا نهائية)"); }
    }, 3000);
  });
}

async function runPythonSandboxed(code, onStatus){
  const pyodide = await ensurePyodide(onStatus);
  let output = "";
  pyodide.setStdout({ batched: (s)=>{ output += s + "\n"; } });
  pyodide.setStderr({ batched: (s)=>{ output += "❌ " + s + "\n"; } });
  try{
    await pyodide.runPythonAsync(code);
  }catch(e){
    output += "❌ خطأ: " + e.message;
  }
  return output || "(نُفّذ الكود بدون أي مخرجات print)";
}

async function runUserCode(lang, code, outEl, statusCb){
  outEl.style.color = "#d4d4d4";
  if(lang === "javascript"){
    outEl.textContent = "⏳ جاري التنفيذ...";
    const result = await runJavaScriptSandboxed(code);
    outEl.textContent = result;
  } else if(lang === "python"){
    outEl.textContent = "⏳ جاري تجهيز بايثون...";
    try{
      const result = await runPythonSandboxed(code, (msg)=>{ outEl.textContent = msg; });
      outEl.textContent = result;
    }catch(e){
      outEl.style.color = "#e6524a";
      outEl.textContent = "تعذّر تشغيل بايثون: " + e.message;
    }
  } else if(lang === "cpp"){
    outEl.textContent = COMPILER_BACKEND === "judge0" ? "⏳ جاري الاتصال بسيرفر Judge0..." : "⏳ جاري الاتصال بخدمة التشغيل العامة (Piston)...";
    try{
      const result = await runCompiledLanguage("c++", "C++", code);
      outEl.textContent = result;
    }catch(e){
      outEl.style.color = "#e6524a";
      outEl.textContent = "تعذّر تشغيل C++: " + e.message;
    }
  } else {
    outEl.style.color = "#e6a23c";
    outEl.textContent = "لغة " + lang + " تحتاج مترجمًا حقيقيًا على الخادم (حاويات معزولة) — قادمة في مرحلة لاحقة من خارطة الطريق.\nجرّب الآن JavaScript أو Python، وكلاهما ينفَّذ فعليًا ✅.";
  }
}
