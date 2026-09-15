/* =========================================================
   منصة 15 — طبقة عرض إعلانات Google AdSense المشتركة.
   تُستخدم من أي صفحة تريد عرض إعلانات (index.html, course.html...)
   بدل تكرار نفس منطق البناء/التحميل في كل صفحة على حدة.
   تعتمد على createAd/fetchCloudAds/deleteAd المعرَّفة في js/data.js.
   ========================================================= */

let __cloudAdsCache = [];

/* الإعلانات المحلية (وضع بدون Supabase، أو خطة بديلة عند فشل الرفع)
   مدموجة مع الإعلانات المشتركة القادمة من جدول ads على Supabase. */
function currentAdsPool(){
  const localIds = new Set((STATE.ads || []).map(a => a.id));
  const merged = [...(STATE.ads || [])];
  __cloudAdsCache.forEach(a => { if(!localIds.has(a.id)) merged.push(a); });
  return merged.filter(a => a.enabled !== false);
}

async function refreshAdsPool(){
  __cloudAdsCache = await fetchCloudAds();
  document.dispatchEvent(new CustomEvent("adsPoolUpdated"));
}

async function deleteAdAndRefresh(id){
  await deleteAd(id);
  __cloudAdsCache = __cloudAdsCache.filter(a => a.id !== id);
  document.dispatchEvent(new CustomEvent("adsPoolUpdated"));
  showToast("🗑️ تم حذف الإعلان");
}

const __loadedAdsenseClients = new Set();
function ensureAdsenseLoader(clientId){
  if(__loadedAdsenseClients.has(clientId)) return;
  __loadedAdsenseClients.add(clientId);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

function adFormatAttrs(format){
  if(format === "rectangle") return `style="display:inline-block;width:300px;height:250px;"`;
  if(format === "horizontal") return `style="display:inline-block;width:100%;height:90px;"`;
  return `style="display:block;" data-ad-format="auto" data-full-width-responsive="true"`;
}

function adSlotHTML(ad, { adminControls = false } = {}){
  return `
    <div class="ad-slot" data-ad-id="${ad.id}">
      ${adminControls ? `
        <div class="flex items-center justify-between" style="margin-bottom:6px;">
          <span class="text-faint" style="font-size:11px;">${escapeHTML(ad.label)}</span>
          <button class="btn btn-ghost btn-sm" style="padding:2px 8px;" onclick="deleteAdAndRefresh('${ad.id}')" title="حذف الإعلان">🗑️</button>
        </div>` : ""}
      <ins class="adsbygoogle" ${adFormatAttrs(ad.format)} data-ad-client="${ad.clientId}" data-ad-slot="${ad.slotId}"></ins>
    </div>`;
}

function activateAds(ads){
  ads.forEach(ad => ensureAdsenseLoader(ad.clientId));
  try{
    ads.forEach(()=> (window.adsbygoogle = window.adsbygoogle || []).push({}));
  }catch(e){
    console.warn("تعذّر تفعيل إعلانات AdSense (قد يكون بسبب مانع إعلانات، أو أن معرّف الناشر غير معتمد بعد):", e.message || e);
  }
}
