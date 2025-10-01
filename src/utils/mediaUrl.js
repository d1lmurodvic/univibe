export function mediaUrl(url, base = "") {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;          // to‘liq URL bo‘lsa — o‘zini qoldiramiz
    const cleanBase = (base || "").replace(/\/+$/, ""); // oxiridagi / ni olib tashlaymiz
    const cleanPath = String(url).replace(/^\/+/, "");  // boshidagi / ni olib tashlaymiz
    return `${cleanBase}/${cleanPath}`;
  }
  