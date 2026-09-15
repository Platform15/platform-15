/* =========================================================
   منصة 15 — تلوين الكود في المحررات بأسلوب Visual Studio Code
   -----------------------------------------------------------
   يحوّل أي <textarea> إلى محرر أكواد حقيقي بتلوين تركيبي (Syntax
   Highlighting) عبر مكتبة CodeMirror (تُحمَّل من CDN مرة واحدة فقط
   عند أول استخدام)، مع سمة ألوان مطابقة لثيم VS Code Dark+
   (معرَّفة في css/style.css ضمن .cm-s-mansa-vscode)، وشريط تبويب
   اختياري يشبه شكل نافذة VS Code.
   ========================================================= */

(function(){

  const CM_VERSION = "5.65.16";
  const CM_BASE = `https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}`;

  let loadPromise = null;
  function loadScript(src){
    return new Promise((resolve, reject)=>{
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("تعذّر تحميل محرر الأكواد: " + src));
      document.head.appendChild(s);
    });
  }

  function loadCodeMirror(){
    if(window.CodeMirror) return Promise.resolve();
    if(loadPromise) return loadPromise;
    loadPromise = (async ()=>{
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${CM_BASE}/lib/codemirror.min.css`;
      document.head.appendChild(link);

      await loadScript(`${CM_BASE}/lib/codemirror.min.js`);
      await Promise.all([
        loadScript(`${CM_BASE}/mode/javascript/javascript.min.js`),
        loadScript(`${CM_BASE}/mode/python/python.min.js`),
        loadScript(`${CM_BASE}/mode/clike/clike.min.js`),
        loadScript(`${CM_BASE}/addon/edit/matchbrackets.min.js`),
        loadScript(`${CM_BASE}/addon/selection/active-line.min.js`)
      ]);
    })();
    return loadPromise;
  }

  const LANG_MODE  = { javascript: "javascript", python: "python", cpp: "text/x-c++src" };
  const LANG_LABEL = { javascript: "script.js", python: "main.py", cpp: "main.cpp" };
  const LANG_DOT   = { javascript: "#f0db4f", python: "#3776ab", cpp: "#00599c" };

  /**
   * يحوّل عنصر <textarea> موجود إلى محرر VS Code-style.
   * opts: { lang: "javascript"|"python"|"cpp", tabBar: bool, minHeight: "280px" }
   * يعيد Promise<{ cm, setLang(lang), getValue(), setValue(v) }>
   */
  window.mountCodeEditor = async function(textareaEl, opts){
    opts = opts || {};
    let lang = opts.lang || "javascript";

    try{
      await loadCodeMirror();
    }catch(e){
      console.error(e);
      return null; // نفشل بهدوء — تبقى الـ textarea العادية تعمل كما هي
    }

    const cm = CodeMirror.fromTextArea(textareaEl, {
      mode: LANG_MODE[lang] || "javascript",
      theme: "mansa-vscode",
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      indentUnit: 4,
      tabSize: 4,
      viewportMargin: Infinity
    });

    if(opts.minHeight){
      cm.getWrapperElement().style.minHeight = opts.minHeight;
    }

    let dotEl = null, labelEl = null;
    if(opts.tabBar){
      const wrapper = cm.getWrapperElement();
      const shell = document.createElement("div");
      shell.className = "ide-window";
      wrapper.parentNode.insertBefore(shell, wrapper);

      const tabbar = document.createElement("div");
      tabbar.className = "ide-tabbar";
      tabbar.innerHTML = `<div class="ide-tab"><span class="ide-lang-dot"></span><span class="ide-tab-label"></span></div>`;
      shell.appendChild(tabbar);
      shell.appendChild(wrapper);

      dotEl = tabbar.querySelector(".ide-lang-dot");
      labelEl = tabbar.querySelector(".ide-tab-label");
    }

    function applyLangUI(){
      if(dotEl) dotEl.style.background = LANG_DOT[lang] || "#888";
      if(labelEl) labelEl.textContent = LANG_LABEL[lang] || "file";
    }
    applyLangUI();

    function setLang(newLang){
      lang = newLang;
      cm.setOption("mode", LANG_MODE[lang] || "javascript");
      applyLangUI();
    }

    // إعادة رسم أولى بعد تركيب العنصر في DOM لضمان قياسات صحيحة
    setTimeout(()=> cm.refresh(), 30);

    return {
      cm,
      setLang,
      getValue: () => cm.getValue(),
      setValue: (v) => cm.setValue(v || "")
    };
  };

})();
