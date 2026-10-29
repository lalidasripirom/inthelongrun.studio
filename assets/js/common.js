/* ใส่ชื่อร้าน / ลิงก์ LINE จาก templates.js ลงในทุกหน้า */
(function () {
  const shop = window.SHOP;
  document.querySelectorAll("[data-shop]").forEach((el) => {
    const key = el.dataset.shop;
    if (key === "line") el.href = "line.html";
    else if (key === "line-app") el.href = shop.lineUrl;
    else if (shop[key]) el.textContent = shop[key];
  });
})();

function formatPrice(n) {
  return window.SHOP.currency + n.toLocaleString("th-TH");
}
