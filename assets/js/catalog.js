(function () {
  const grid = document.getElementById("catalog-grid");

  grid.innerHTML = window.TEMPLATES.map(
    (t) => `
      <a class="product" href="card.html?id=${encodeURIComponent(t.id)}">
        <div class="product-media">
          <img src="${t.thumb}" alt="${t.nameTh}" loading="lazy">
          <span class="product-badge">ลองใส่ชื่อ</span>
        </div>
        <div class="product-body">
          <h3>${t.name}</h3>
          <p class="product-price">${formatPrice(t.price)} <small>/ ใบ · ขั้นต่ำ ${t.minOrder} ใบ</small></p>
        </div>
      </a>`
  ).join("");
})();
