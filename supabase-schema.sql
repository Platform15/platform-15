-- =========================================================
-- منصة 15 — إعداد قاعدة البيانات على Supabase
-- انسخ هذا الملف بالكامل والصقه في: Supabase Dashboard → SQL Editor → Run
-- =========================================================

-- جدول واحد بسيط يخزّن "حالة" كل مستخدم (نفس شكل STATE في js/data.js)
-- كـ JSON. هذا يكفي تمامًا للمرحلة الحالية (مصادقة + حفظ سحابي)
-- دون الحاجة لتصميم جداول منفصلة لكل نوع بيانات الآن.
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- تفعيل الحماية على مستوى الصف: كل مستخدم يرى ويعدّل صفّه فقط
alter table public.profiles enable row level security;

create policy "المستخدم يقرأ بياناته فقط"
  on public.profiles for select
  using (auth.uid() = id);

create policy "المستخدم يعدّل بياناته فقط"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "المستخدم يحدّث بياناته فقط"
  on public.profiles for update
  using (auth.uid() = id);

-- =========================================================
-- تحديث: غرف الدردشة المشتركة (كل مستخدم يمكنه إنشاء غرفة)
-- إن كنت شغّلت هذا الملف سابقًا، يكفي نسخ هذا القسم فقط
-- ولصقه في SQL Editor لإضافة الميزة دون التأثير على profiles.
-- =========================================================
create table if not exists public.chatrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60 and name !~ '[<>]'),
  description text default '' check (description !~ '[<>]'),
  icon text not null default '💬' check (icon in ('💬','💻','🛡️','🧠','🌐','🎮','📚','🚀')),
  color text not null default '#d9a441',
  created_by uuid references auth.users(id) on delete set null,
  created_by_name text default 'مستخدم' check (created_by_name !~ '[<>]'),
  created_at timestamptz not null default now()
);

alter table public.chatrooms enable row level security;

-- أي مستخدم مسجّل دخول يشاهد كل غرف الدردشة (المشتركة بين الجميع)
create policy "الجميع يشاهدون غرف الدردشة"
  on public.chatrooms for select
  to authenticated
  using (true);

-- أي مستخدم مسجّل دخول يمكنه إنشاء غرفة دردشة جديدة (ليس الأدمن فقط)
create policy "أي مستخدم يمكنه إنشاء غرفة دردشة"
  on public.chatrooms for insert
  to authenticated
  with check (auth.uid() = created_by);

-- صاحب الغرفة فقط يمكنه حذف الغرفة التي أنشأها
create policy "صاحب الغرفة يحذفها فقط"
  on public.chatrooms for delete
  to authenticated
  using (auth.uid() = created_by);

-- =========================================================
-- تحديث: إعلانات Google AdSense مشتركة بين كل المستخدمين
-- (قبل هذا التحديث كانت الإعلانات تُخزَّن داخل عمود state لكل
-- مستخدم على حدة، فكانت تظهر فقط عند الأدمن نفسه ولا تصل لبقية
-- الزوار إطلاقًا. الحل: جدول ads مشترك + جدول admins للتحقق من
-- صلاحية الأدمن من طرف قاعدة البيانات نفسها لا من الجهاز فقط.)
-- =========================================================

-- جدول بسيط يسرد معرّفات المستخدمين المسموح لهم بدور الأدمن.
-- لا تُدرَج فيه أي صفوف من الواجهة أبدًا — فقط أنت يدويًا من
-- Supabase Dashboard → Table Editor → admins → Insert row
-- (ضع فيه UUID حسابك من Authentication → Users بعد تسجيل الدخول مرة واحدة).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

-- يسمح فقط لأي مستخدم بمعرفة إن كان هو نفسه أدمن أم لا (لإظهار/إخفاء
-- زر ＋ في الواجهة) — لا يستطيع أحد رؤية قائمة الأدمنين كاملة.
create policy "المستخدم يتحقق من صلاحيته فقط"
  on public.admins for select
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'إعلان بدون اسم' check (char_length(label) <= 60 and label !~ '[<>]'),
  client_id text not null check (client_id ~ '^ca-pub-[0-9]{10,20}$'),
  slot_id text not null check (slot_id ~ '^[0-9]{6,15}$'),
  format text not null default 'auto' check (format in ('auto','rectangle','horizontal')),
  enabled boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ads enable row level security;

-- كل المستخدمين المسجّلين يشاهدون الإعلانات المفعّلة (هذا هو الإصلاح
-- الأساسي: الإعلان يصبح مرئيًا للجميع فور نشره، وليس عند الأدمن فقط).
create policy "الجميع يشاهدون الإعلانات المفعّلة"
  on public.ads for select
  to authenticated
  using (enabled = true);

-- الأدمن (المدرَج في جدول admins) يشاهد كل الإعلانات حتى المعطّلة منها،
-- لإدارتها من لوحة التحكم.
create policy "الأدمن يشاهد كل الإعلانات"
  on public.ads for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- الأدمن فقط (المدرَج في جدول admins) يمكنه نشر إعلان جديد — التحقق هنا
-- من طرف قاعدة البيانات نفسها، لذلك تعديل isAdmin في متصفح أي مستخدم
-- عادي محليًا لن يمنحه أي صلاحية حقيقية.
create policy "الأدمن فقط ينشر إعلانًا"
  on public.ads for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "الأدمن فقط يحذف إعلانًا"
  on public.ads for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "الأدمن فقط يعدّل إعلانًا"
  on public.ads for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- =========================================================
-- ملاحظات:
-- 1) هذا الجدول يخزّن كل شيء (user, courses, notifications...) في
--    عمود واحد state (jsonb) — بسيط وسريع للبدء.
-- 2) لاحقًا، إذا أردت استعلامات أدق (مثلاً "أرني كل المنشورات من
--    كل المستخدمين" لصفحة community.html الحقيقية بدل بيانات وهمية)
--    ستحتاج جداول منفصلة: posts, messages, notifications... كل
--    واحد بعلاقاته الخاصة بدل تخزينها داخل state لكل مستخدم.
-- 3) تفعيل "Email confirmations" من Authentication → Providers → Email
--    اختياري: إذا فعّلته، المستخدم يحتاج يفتح بريده بعد إنشاء الحساب.
-- 4) جدول chatrooms أعلاه مشترك بين كل المستخدمين (على عكس profiles)،
--    لذلك أي غرفة يُنشئها أي مستخدم تظهر فورًا لبقية المستخدمين.
-- 5) قيود CHECK على name/description/created_by_name ترفض أي رمز < أو >
--    على مستوى قاعدة البيانات نفسها — أي لا يمكن لأي مستخدم إدخال وسم
--    HTML مثل <img> أو <video> حتى لو تجاوز الواجهة واستدعى الـ API مباشرة.
--    وحقل icon مقيّد بقائمة إيموجي ثابتة فقط، فلا مجال لرفع صور كأيقونة.
-- 6) لتفعيل حسابك كأدمن حقيقي (يقدر ينشر إعلانات فعليًا يراها الجميع):
--    أ) سجّل دخول مرة واحدة عاديًا من login.html بحسابك.
--    ب) افتح Supabase Dashboard → Authentication → Users وانسخ الـ UID
--       الخاص بحسابك.
--    ج) افتح Table Editor → admins → Insert row، وألصق الـ UID في
--       عمود user_id واحفظ.
--    د) أعد تحميل الصفحة — زر ＋ سيظهر تلقائيًا خلال ثوانٍ (بعد تأكيد
--       الصلاحية من قاعدة البيانات)، وأي إعلان تنشئه بعدها يظهر فورًا
--       لكل المستخدمين، لا عندك أنت فقط.
--    ملاحظة: قيمة isAdmin المحلية في js/data.js تبقى مفيدة فقط في
--    الوضع المحلي (بدون Supabase) للتجربة السريعة على جهازك؛ بمجرد ربط
--    Supabase تصبح قائمة admins هي المصدر الحقيقي والوحيد للصلاحية.
-- =========================================================
