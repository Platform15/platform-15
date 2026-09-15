/* =========================================================
   منصة 15 — إعداد اتصال Supabase
   عدّل القيمتين تحت بمعلومات مشروعك من:
   Supabase Dashboard → Settings → API
   ========================================================= */

const SUPABASE_URL = "https://ywlhnkqhjddzeqgmlrko.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vXt5E19qRVhv-WuX-kUZag_Otd-JpYG";

// عميل Supabase متاح عالميًا لباقي الملفات (data.js, shell.js, login.html)
// نستخدم window.supabaseClient صراحة لأن const/let لا تُعلَّق تلقائيًا على window
window.supabaseClient = (SUPABASE_URL.startsWith("PASTE_") || SUPABASE_ANON_KEY.startsWith("PASTE_"))
  ? null
  : window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supabaseClient = window.supabaseClient;

if (!supabaseClient) {
  console.warn(
    "⚠️ لم يتم إعداد Supabase بعد. عدّل js/supabase-client.js وضع رابط ومفتاح مشروعك. " +
    "المنصة ستستمر بالعمل محليًا (localStorage) حتى ذلك الحين."
  );
}
