/* =========================================================
   منصة 15 — طبقة البيانات (Mock/Local Data Layer)
   لا يوجد سيرفر بعد؛ كل شيء مخزّن في localStorage حاليًا.
   عند بناء الباك-إند الحقيقي، استبدل الدوال هنا بنداءات API
   بدون الحاجة لتغيير أي صفحة (نفس الأسماء والمخرجات).
   ========================================================= */

const DB_KEY = "mansa15_state_v1";

const SEED = {
  // إعدادات عامة للمنصة — الأدمن يعدّلها يدويًا هنا حتى يتم ربط عدّاد متابعين حقيقي (Instagram/Telegram/TikTok API إلخ).
  platform: {
    followersCount: 1250,       // 👈 حدّث هذا الرقم يدويًا كل فترة بعدد المتابعين الفعلي
    freeToolsThreshold: 10000,  // IDE ومحاكي الطرفية مجانيان بالكامل قبل الوصول لهذا الرقم
    freeToolsGraceMessage: "بعد وصولنا لهذا الهدف، ستبقى الأدوات متاحة لكن قد تُضاف خطة مدفوعة اختيارية لموارد إضافية (تشغيل أطول، تخزين مشاريع أكبر...)."
  },
  user: {
    name: "Abderrahmane",
    handle: "@abderrahmane",
    level: 3,
    levelName: "المبتدئ المتقدم",
    xp: 120,
    xpNext: 400,
    streakDays: 5,
    lessonsDone: 3,
    achievements: 2,
    isAdmin: false, // فقط للوضع المحلي بدون Supabase (تجربة سريعة على جهازك). بمجرد ربط Supabase، صلاحية الأدمن الحقيقية تُحدَّد من جدول admins عبر checkIsAdmin() أدناه — لا من هذه القيمة.
    badges: ["⭐", "🔥", "💻", "🛡️"]
  },
  courses: [
    {
      id: "cpp",
      title: "البرمجة C++",
      subtitle: "من الصفر إلى الاحتراف",
      icon: "💻",
      color: "#4dc98a",
      status: "in_progress", // in_progress | available | roadmap
      totalLessons: 56,
      doneLessons: 18,
      modules: [
        { title: "مفاهيم أساسية في البرمجة", lessons: 6, done: 6, state: "done" },
        { title: "المتغيرات وأنواع البيانات", lessons: 8, done: 8, state: "done" },
        { title: "الشروط والحلقات", lessons: 10, done: 4, state: "current" },
        { title: "الدوال والمصفوفات", lessons: 12, done: 0, state: "locked" },
        { title: "البرمجة الكائنية (OOP)", lessons: 14, done: 0, state: "locked" },
        { title: "مشروع تخرّج المستوى الأول", lessons: 6, done: 0, state: "locked" }
      ]
    },
    {
      id: "ai",
      title: "الذكاء الاصطناعي",
      subtitle: "تعلم أساسيات الذكاء الاصطناعي وتطبيقاته",
      icon: "🧠",
      color: "#b98af0",
      status: "roadmap",
      roadmap: ["أساسيات الرياضيات والإحصاء", "Python لتحليل البيانات", "تعلم الآلة (Machine Learning)", "الشبكات العصبية", "معالجة اللغة الطبيعية", "مشروع تطبيقي بالذكاء الاصطناعي"]
    },
    {
      id: "networks",
      title: "الشبكات",
      subtitle: "أساسيات الشبكات وأنظمة الاتصال",
      icon: "🌐",
      color: "#4a90e6",
      status: "roadmap",
      roadmap: ["مقدمة في الشبكات", "نموذج OSI و TCP/IP", "عنونة IP والتوجيه", "بروتوكولات الشبكات", "أمن الشبكات الأساسي", "مختبر عملي على المحاكي"]
    },
    {
      id: "security",
      title: "الأمن السيبراني",
      subtitle: "احم الأنظمة والشبكات من التهديدات",
      icon: "🛡️",
      color: "#e6524a",
      status: "roadmap",
      roadmap: ["أساسيات الحاسوب", "الشبكات", "Linux", "Web Security", "Cryptography", "Penetration Testing", "Advanced Security"]
    }
  ],
  notifications: [
    { id: 1, type: "system", title: "مرحبًا بك في منصة 15", body: "أكمل ملفك الشخصي لتحصل على شارة الانطلاقة 🚀", time: "قبل 3 ساعات", unread: true },
    { id: 2, type: "social", title: "تعليق جديد", body: "Sara علّقت على منشورك في المجتمع", time: "قبل 5 ساعات", unread: true },
    { id: 3, type: "learning", title: "أكمل من حيث توقفت", body: "لم تُكمل «الشروط والحلقات» منذ يومين", time: "أمس", unread: true },
    { id: 4, type: "learning", title: "درس جديد متاح", body: "تمت إضافة وحدة «الدوال والمصفوفات»", time: "قبل يومين", unread: false }
  ],
  messages: [
    { id: "m1", name: "Mohamed", last: "شكرًا على المساعدة! 🙏", time: "10:24", unread: 2,
      thread: [{ from: "them", text: "أهلًا، كيف حللت تمرين الحلقات؟" }, { from: "me", text: "استخدمت for بدل while، جرّب كذا" }, { from: "them", text: "شكرًا على المساعدة! 🙏" }] },
    { id: "m2", name: "Sara", last: "هل بدأت مشروع C++ الجديد؟", time: "أمس", unread: 0,
      thread: [{ from: "them", text: "هل بدأت مشروع C++ الجديد؟" }, { from: "me", text: "لسا، بخلص الوحدة الحالية أول" }] },
    { id: "m3", name: "Youssef", last: "تمام، نتكلم بكرا", time: "الإثنين", unread: 0,
      thread: [{ from: "me", text: "نكمل التحدي بكرا؟" }, { from: "them", text: "تمام، نتكلم بكرا" }] }
  ],
  // غرف الدردشة الافتراضية + أي غرف ينشئها المستخدمون (تُحفظ محليًا إن لم يُربط Supabase بعد)
  chatrooms: [
    { id: "general", name: "الغرفة العامة", description: "نقاشات عامة عن التعلم والمنصة.", icon: "💬", color: "#d9a441", online: 214, builtin: true },
    { id: "programming", name: "غرفة البرمجة", description: "نقاش تقني حول C++ ولغات البرمجة.", icon: "💻", color: "#4dc98a", online: 96, builtin: true },
    { id: "security", name: "غرفة الأمن السيبراني", description: "نقاشات حول أساسيات الأمن والشبكات.", icon: "🛡️", color: "#e6524a", online: 41, builtin: true }
  ],
  community: [
    { id: 1, name: "Mohamed", time: "منذ 10 دقائق", title: "أول برنامج C++ لي 🎉", body: "أنهيت تمرين حاسبة بسيطة اليوم، شعور رائع أن ترى الكود يعمل لأول مرة!", likes: 14, comments: 4 },
    { id: 2, name: "Lina", time: "منذ ساعتين", title: "سؤال عن الحلقات المتداخلة", body: "ليش لازم نستخدم break جوا الحلقة الداخلية؟ حد يشرحلي بمثال بسيط؟", likes: 6, comments: 9 },
    { id: 3, name: "Youssef", time: "منذ 5 ساعات", title: "خارطة طريق الأمن السيبراني", body: "متحمس جدًا لإطلاق مسار الأمن السيبراني الكامل، حد عنده خبرة سابقة في الموضوع؟", likes: 21, comments: 12 }
  ],
  // إعلانات Google AdSense التي ينشرها الأدمن عبر زر ＋ ← "إعلان جديد".
  // كل عنصر يحمل فقط معرّف الناشر (ca-pub-...) ومعرّف وحدة الإعلان —
  // لا يُخزَّن أي كود HTML خام هنا، ويُبنى وسم <ins> عند العرض فقط
  // (نفس فلسفة بقية الحقول: بيانات خام، والعرض/التلوين يحدث في الواجهة).
  ads: []
};

/* =========================================================
   بوابة "مجاني حتى 10,000 متابع" — تُستخدم في tools.html
   لتحديد ما إذا كان IDE ومحاكي الطرفية مفتوحَين بالكامل.
   ========================================================= */
function isToolsFree(){
  const p = STATE.platform || SEED.platform;
  return p.followersCount < p.freeToolsThreshold;
}
function followersProgressPct(){
  const p = STATE.platform || SEED.platform;
  return Math.min(100, Math.round((p.followersCount / p.freeToolsThreshold) * 100));
}

function loadState(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      // توافق مع نسخ محفوظة قديمة لا تحتوي مفاتيح جديدة (مثل platform)
      for(const key in SEED){ if(!(key in parsed)) parsed[key] = SEED[key]; }
      return parsed;
    }
  }catch(e){}
  localStorage.setItem(DB_KEY, JSON.stringify(SEED));
  return JSON.parse(JSON.stringify(SEED));
}
function saveState(state){
  localStorage.setItem(DB_KEY, JSON.stringify(state));
  pushStateToCloud(state); // مزامنة بالخلفية، لا تعطّل الحفظ المحلي الفوري
}
function resetState(){
  localStorage.setItem(DB_KEY, JSON.stringify(SEED));
  location.reload();
}

/* =========================================================
   غرف الدردشة — أي مستخدم (وليس الأدمن فقط) يمكنه إنشاء غرفة.
   نحفظها محليًا دائمًا (تعمل فورًا حتى بدون Supabase)، ونحاول
   أيضًا رفعها لجدول chatrooms المشترك في Supabase إن كان معدًّا
   ليراها بقية المستخدمين الحقيقيين مباشرة.
   ========================================================= */
/* =========================================================
   تعقيم النصوص التي يُدخلها المستخدمون قبل عرضها — لمنع أي
   محاولة لإدخال وسوم HTML مثل <img>/<video>/<iframe> ضمن
   حقول نصية (اسم الغرفة، الوصف...). المنصة لا تحتوي أي رفع
   صور أو فيديوهات فعلي؛ هذا يمنع أيضًا "تحايل" أي مستخدم على
   ذلك عبر لصق وسم HTML كنص عادي.
   ========================================================= */
function stripTags(str){
  return String(str || "").replace(/<[^>]*>/g, "");
}
function escapeHTML(str){
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function addLocalChatroom(room){
  if(!Array.isArray(STATE.chatrooms)) STATE.chatrooms = [];
  STATE.chatrooms.push(room);
  saveState(STATE);
  return room;
}

async function createChatroom({ name, description, icon, color }){
  // تعقيم كل نص يُدخله المستخدم: لا يُسمح بأي وسم HTML (وبالتالي
  // لا صور <img> ولا فيديوهات <video>/<iframe>) — نص عادي فقط.
  const cleanName = stripTags(name).trim().slice(0, 60);
  const cleanDesc = stripTags(description).trim().slice(0, 140);
  const allowedIcons = ["💬","💻","🛡️","🧠","🌐","🎮","📚","🚀"];
  const cleanIcon = allowedIcons.includes(icon) ? icon : "💬";

  const room = {
    id: (crypto.randomUUID ? crypto.randomUUID() : "room-" + Date.now()),
    name: cleanName,
    description: cleanDesc,
    icon: cleanIcon,
    color: color || "#d9a441",
    online: 1,
    builtin: false,
    createdByName: STATE.user.name
  };

  if(!cleanName){
    return { room: null, shared: false, error: "الاسم مطلوب" };
  }

  // وضع محلي (بدون Supabase): يبقى محفوظًا في هذا المتصفح فقط
  if(!window.supabaseClient){
    addLocalChatroom(room);
    return { room, shared: false };
  }

  // وضع سحابي: يظهر فورًا لكل المستخدمين عبر جدول chatrooms المشترك
  try{
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user){ addLocalChatroom(room); return { room, shared: false }; }

    const { data, error } = await supabaseClient
      .from("chatrooms")
      .insert({
        name: room.name,
        description: room.description,
        icon: room.icon,
        color: room.color,
        created_by: user.id,
        created_by_name: STATE.user.name
      })
      .select()
      .single();

    if(error) throw error;

    const sharedRoom = {
      id: data.id, name: stripTags(data.name), description: stripTags(data.description),
      icon: allowedIcons.includes(data.icon) ? data.icon : "💬", color: data.color, online: 1, builtin: false,
      createdByName: stripTags(data.created_by_name)
    };
    return { room: sharedRoom, shared: true };
  }catch(e){
    console.warn("تعذّر إنشاء الغرفة على Supabase، تم حفظها محليًا فقط:", e.message || e);
    addLocalChatroom(room);
    return { room, shared: false };
  }
}

async function fetchCloudChatrooms(){
  if(!window.supabaseClient) return [];
  const allowedIcons = ["💬","💻","🛡️","🧠","🌐","🎮","📚","🚀"];
  try{
    const { data, error } = await supabaseClient
      .from("chatrooms")
      .select("*")
      .order("created_at", { ascending: false });
    if(error) throw error;
    // تعقيم أي بيانات قادمة من الخادم أيضًا (دفاع مزدوج): لا وسوم HTML
    return (data || []).map(r => ({
      id: r.id, name: stripTags(r.name), description: stripTags(r.description),
      icon: allowedIcons.includes(r.icon) ? r.icon : "💬", color: r.color, online: 1, builtin: false,
      createdByName: stripTags(r.created_by_name)
    }));
  }catch(e){
    console.warn("تعذّر جلب غرف الدردشة من Supabase:", e.message || e);
    return [];
  }
}

/* =========================================================
   إنشاء درس جديد داخل وحدة معيّنة (زر ＋ إنشاء ← درس جديد،
   متاح للأدمن فقط). يُحفظ محليًا حاليًا (لا يوجد جدول lessons
   في Supabase بعد) — بنفس فلسفة بقية البيانات في هذا الملف.
   حقل الكود يُخزَّن كنص خام فقط؛ التلوين (syntax highlighting)
   يحدث في الواجهة عبر Prism.js عند العرض، وليس هنا أبدًا —
   حتى لا يُخزَّن أي HTML قابل للتنفيذ.
   ========================================================= */
function addLessonToModule(courseId, moduleIndex, lesson){
  const course = STATE.courses.find(c => c.id === courseId);
  if(!course || !Array.isArray(course.modules) || !course.modules[moduleIndex]) return null;
  const mod = course.modules[moduleIndex];

  const cleanTitle = stripTags(lesson.title).trim().slice(0, 80);
  if(!cleanTitle) return null;

  const allowedLangs = ["javascript", "python", "cpp", "markup", "css"];
  const cleanLang = allowedLangs.includes(lesson.codeLang) ? lesson.codeLang : "javascript";

  if(!Array.isArray(mod.items)) mod.items = [];
  const newLesson = {
    id: (crypto.randomUUID ? crypto.randomUUID() : "lesson-" + Date.now()),
    title: cleanTitle,
    content: stripTags(lesson.content || "").trim().slice(0, 600),
    code: String(lesson.code || "").slice(0, 4000), // نص خام — يُلوَّن عند العرض فقط عبر Prism
    codeLang: cleanLang,
    createdAt: Date.now()
  };
  mod.items.push(newLesson);
  mod.lessons = (mod.lessons || 0) + 1;
  course.totalLessons = (course.totalLessons || 0) + 1;

  saveState(STATE);
  document.dispatchEvent(new CustomEvent("lessonCreated", { detail: { courseId, moduleIndex, lesson: newLesson } }));
  return newLesson;
}

/* =========================================================
   إعلانات Google AdSense (زر ＋ ← "إعلان جديد"، للأدمن فقط).
   نتحقق من صيغة معرّف الناشر ومعرّف الوحدة فقط (أرقام/صيغة
   ca-pub- المعروفة من Google) — لا نقبل ولا نخزّن أي كود HTML
   خام من المستخدم لتفادي حقن أي سكربت غير مرغوب فيه؛ وسم
   <ins class="adsbygoogle"> الحقيقي يُبنى في الواجهة عند العرض
   فقط انطلاقًا من هذين المعرّفين.

   مهم: الإعلانات تُخزَّن في جدول ads المشترك على Supabase (وليس
   داخل عمود state الخاص بكل مستخدم)، لذلك أي إعلان ينشره الأدمن
   يظهر فورًا لكل المستخدمين، لا عند الأدمن نفسه فقط. الصلاحية
   الفعلية للنشر/الحذف محمية من طرف قاعدة البيانات (جدول admins +
   RLS) في supabase-schema.sql، فتعديل isAdmin محليًا في متصفح أي
   مستخدم عادي لا يمنحه أي صلاحية حقيقية.
   ========================================================= */
const AD_ALLOWED_FORMATS = ["auto", "rectangle", "horizontal"];

function addLocalAd(ad){
  if(!Array.isArray(STATE.ads)) STATE.ads = [];
  STATE.ads.push(ad);
  saveState(STATE);
  return ad;
}

async function createAd({ label, clientId, slotId, format }){
  const cleanClient = String(clientId || "").trim();
  const cleanSlot = String(slotId || "").trim();
  if(!/^ca-pub-\d{10,20}$/.test(cleanClient)) return { ad: null, shared: false, error: "client" };
  if(!/^\d{6,15}$/.test(cleanSlot)) return { ad: null, shared: false, error: "slot" };

  const cleanFormat = AD_ALLOWED_FORMATS.includes(format) ? format : "auto";
  const cleanLabel = stripTags(label || "").trim().slice(0, 60) || "إعلان بدون اسم";

  const localAd = {
    id: (crypto.randomUUID ? crypto.randomUUID() : "ad-" + Date.now()),
    label: cleanLabel,
    clientId: cleanClient,
    slotId: cleanSlot,
    format: cleanFormat,
    enabled: true,
    createdAt: Date.now()
  };

  // وضع محلي (بدون Supabase): يبقى محفوظًا في هذا المتصفح فقط
  if(!window.supabaseClient){
    addLocalAd(localAd);
    document.dispatchEvent(new CustomEvent("adCreated", { detail: { ad: localAd } }));
    return { ad: localAd, shared: false };
  }

  try{
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user){
      addLocalAd(localAd);
      document.dispatchEvent(new CustomEvent("adCreated", { detail: { ad: localAd } }));
      return { ad: localAd, shared: false };
    }

    // وضع سحابي: يظهر فورًا لكل المستخدمين عبر جدول ads المشترك.
    // إن لم يكن حسابك مدرَجًا في جدول admins، RLS سترفض الإدراج هنا
    // وسنقع في catch أدناه ونحفظه محليًا فقط كخطة بديلة.
    const { data, error } = await supabaseClient
      .from("ads")
      .insert({
        label: cleanLabel,
        client_id: cleanClient,
        slot_id: cleanSlot,
        format: cleanFormat,
        created_by: user.id
      })
      .select()
      .single();

    if(error) throw error;

    const sharedAd = {
      id: data.id,
      label: stripTags(data.label),
      clientId: data.client_id,
      slotId: data.slot_id,
      format: AD_ALLOWED_FORMATS.includes(data.format) ? data.format : "auto",
      enabled: data.enabled !== false,
      createdAt: new Date(data.created_at).getTime()
    };
    document.dispatchEvent(new CustomEvent("adCreated", { detail: { ad: sharedAd } }));
    return { ad: sharedAd, shared: true };
  }catch(e){
    console.warn(
      "تعذّر نشر الإعلان على Supabase (تحقّق أن حسابك مدرَج في جدول admins)، تم حفظه محليًا فقط عندك:",
      e.message || e
    );
    addLocalAd(localAd);
    document.dispatchEvent(new CustomEvent("adCreated", { detail: { ad: localAd } }));
    return { ad: localAd, shared: false };
  }
}

async function fetchCloudAds(){
  if(!window.supabaseClient) return [];
  try{
    const { data, error } = await supabaseClient
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false });
    if(error) throw error;
    return (data || []).map(a => ({
      id: a.id,
      label: stripTags(a.label),
      clientId: a.client_id,
      slotId: a.slot_id,
      format: AD_ALLOWED_FORMATS.includes(a.format) ? a.format : "auto",
      enabled: a.enabled !== false,
      createdAt: new Date(a.created_at).getTime()
    }));
  }catch(e){
    console.warn("تعذّر جلب الإعلانات من Supabase:", e.message || e);
    return [];
  }
}

async function deleteAd(id){
  // إزالة محلية فورية لتجربة استخدام سلسة، ثم محاولة الحذف من السحابة
  // (RLS ترفض الحذف إن لم يكن الحساب أدمن مدرَجًا في جدول admins).
  if(Array.isArray(STATE.ads)){
    STATE.ads = STATE.ads.filter(a => a.id !== id);
    saveState(STATE);
  }
  if(window.supabaseClient){
    try{
      const { error } = await supabaseClient.from("ads").delete().eq("id", id);
      if(error) throw error;
    }catch(e){
      console.warn("تعذّر حذف الإعلان من Supabase:", e.message || e);
    }
  }
  document.dispatchEvent(new CustomEvent("adRemoved", { detail: { id } }));
}

/* =========================================================
   تحقّق حقيقي (من طرف قاعدة البيانات) من كون المستخدم الحالي أدمن،
   عبر جدول admins المحمي بـ RLS. هذا يحل محل الاعتماد الكامل على
   isAdmin المحلي القابل للتعديل من أي مستخدم عبر أدوات المطوّر.
   ========================================================= */
async function checkIsAdmin(){
  if(!window.supabaseClient) return; // وضع محلي بدون Supabase: نبقى على isAdmin المحلي كما هو
  try{
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user) return;
    const { data, error } = await supabaseClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if(error) throw error;
    STATE.user.isAdmin = !!data;
    localStorage.setItem(DB_KEY, JSON.stringify(STATE));
    document.dispatchEvent(new CustomEvent("adminStatusReady", { detail: { isAdmin: STATE.user.isAdmin } }));
  }catch(e){
    console.warn("تعذّر التحقق من صلاحية الأدمن:", e.message || e);
  }
}

const STATE = loadState();

/* =========================================================
   طبقة مزامنة Supabase (اختيارية — تعمل فقط إذا تم إعداد
   js/supabase-client.js بمفاتيح حقيقية، وإلا تبقى المنصة
   تعمل محليًا كما كانت دون أي كسر).

   ملاحظة مهمة: STATE ثابت (const) لكنه object، لذلك التحديث
   هنا يتم عبر Object.assign (تعديل الخصائص من الداخل) بدل
   إعادة تعيين المتغير، حتى تبقى كل الإشارات إليه في shell.js
   وبقية الصفحات صحيحة.
   ========================================================= */

async function pushStateToCloud(state){
  if(!window.supabaseClient) return;
  try{
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user) return;
    await supabaseClient.from("profiles").upsert({
      id: user.id,
      state: state,
      updated_at: new Date().toISOString()
    });
  }catch(e){
    console.warn("تعذّرت مزامنة البيانات مع Supabase:", e.message || e);
  }
}

async function hydrateStateFromCloud(){
  if(!window.supabaseClient) return;
  try{
    const { data: { user } } = await supabaseClient.auth.getUser();
    if(!user) return; // زائر غير مسجّل دخول: يبقى على بيانات SEED المحلية

    const { data, error } = await supabaseClient
      .from("profiles")
      .select("state")
      .eq("id", user.id)
      .maybeSingle();

    if(error) throw error;

    if(data && data.state){
      // عندنا نسخة سحابية: ادمجها في STATE الحالي وفي التخزين المحلي
      Object.assign(STATE, data.state);
      localStorage.setItem(DB_KEY, JSON.stringify(STATE));
    }else{
      // أول تسجيل دخول لهذا المستخدم: ارفع نسخته المحلية الحالية كبداية سحابية
      await pushStateToCloud(STATE);
    }
    document.dispatchEvent(new CustomEvent("stateHydrated"));
  }catch(e){
    console.warn("تعذّرت جلب البيانات من Supabase:", e.message || e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await hydrateStateFromCloud();
  await checkIsAdmin();
});
