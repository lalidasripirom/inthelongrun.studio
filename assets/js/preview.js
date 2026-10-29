(function () {
  const params = new URLSearchParams(location.search);
  const tpl = window.TEMPLATES.find((t) => t.id === params.get("id")) || (!params.get("id") && window.TEMPLATES[0]);

  if (!tpl) {
    document.getElementById("not-found").hidden = false;
    return;
  }
  document.getElementById("preview").hidden = false;

  const ROLES = [
    { label: "ชื่อเจ้าบ่าว", placeholder: "ชื่อเจ้าบ่าว" },
    { label: "ชื่อเจ้าสาว", placeholder: "ชื่อเจ้าสาว" },
  ];
  const STORAGE_KEY = "wcs-preview";

  const stage = document.getElementById("stage");
  const img = document.getElementById("card-image");
  const slotEls = [...stage.querySelectorAll(".slot")];
  const inputs = [document.getElementById("name-0"), document.getElementById("name-1")];
  const labels = [document.getElementById("label-0"), document.getElementById("label-1")];
  const fontBox = document.getElementById("font-options");
  const hint = document.getElementById("order-hint");

  const state = { swapped: false, font: tpl.fonts[0] };

  /* ---------- ข้อมูลแบบการ์ด ---------- */
  document.title = `${tpl.nameTh} — ลองใส่ชื่อ | ${window.SHOP.name}`;
  img.src = tpl.image;
  img.alt = `การ์ดแต่งงานแบบ ${tpl.nameTh}`;
  document.getElementById("card-name-en").textContent = tpl.name;
  document.getElementById("card-name").textContent = tpl.nameTh;
  document.getElementById("card-price").innerHTML =
    `${formatPrice(tpl.price)} <small>/ ใบ · ขั้นต่ำ ${tpl.minOrder} ใบ</small>`;
  document.getElementById("card-desc").textContent = tpl.description;
  document.getElementById("card-tags").innerHTML = tpl.tags.map((t) => `<li>${t}</li>`).join("");

  tpl.slots.forEach((s, i) => {
    Object.assign(slotEls[i].style, { left: s.x + "%", top: s.y + "%", width: s.w + "%" });
  });
  stage.style.setProperty("--name-color", tpl.color);

  fontBox.innerHTML = tpl.fonts
    .map((key) => {
      const f = window.FONTS[key];
      return `
        <label class="font-option">
          <input type="radio" name="font" value="${key}">
          <span style="font-family:${f.family};font-weight:${f.weight}">
            <b>Aa ก</b>${f.label}
          </span>
        </label>`;
    })
    .join("");

  /* ---------- จำชื่อที่ลูกค้าพิมพ์ไว้ (ใช้ต่อได้เมื่อเปลี่ยนไปดูแบบอื่น) ---------- */
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Array.isArray(saved.names)) saved.names.forEach((n, i) => (inputs[i].value = n || ""));
    if (tpl.fonts.includes(saved.font)) state.font = saved.font;
    state.swapped = !!saved.swapped;
  } catch (e) {}

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ names: inputs.map((i) => i.value), font: state.font, swapped: state.swapped })
      );
    } catch (e) {}
  }

  /* ---------- วาดชื่อลงบนการ์ด ---------- */
  // ชื่อของคนที่อยู่ในช่องที่ slotIndex (0 = เจ้าบ่าว, 1 = เจ้าสาว)
  const personAt = (slotIndex) => (state.swapped ? 1 - slotIndex : slotIndex);

  function slotPosLabel(slotIndex) {
    const other = tpl.slots[1 - slotIndex];
    return tpl.slots[slotIndex].y <= other.y ? "บรรทัดบน" : "บรรทัดล่าง";
  }

  function render() {
    const font = window.FONTS[state.font];
    stage.style.setProperty("--name-font", font.family);
    stage.style.setProperty("--name-weight", font.weight);

    slotEls.forEach((el, i) => {
      const p = personAt(i);
      const value = inputs[p].value.trim();
      el.firstElementChild.textContent = value || ROLES[p].placeholder;
      el.classList.toggle("is-empty", !value);
      labels[p].innerHTML = `${ROLES[p].label} <small>${slotPosLabel(i)}</small>`;
    });

    fontBox.querySelectorAll("input").forEach((r) => (r.checked = r.value === state.font));
    fit();
    persist();
  }

  // ย่อขนาดตัวอักษรอัตโนมัติถ้าชื่อยาวเกินพื้นที่
  function fit() {
    const W = stage.clientWidth;
    if (!W) return;
    const font = window.FONTS[state.font];
    slotEls.forEach((el, i) => {
      const s = tpl.slots[i];
      const span = el.firstElementChild;
      const maxW = (s.w / 100) * W;
      const base = (s.size / 100) * W * font.scale;
      let px = base;
      span.style.fontSize = px + "px";
      while (span.offsetWidth > maxW && px > base * 0.35) {
        px *= 0.94;
        span.style.fontSize = px + "px";
      }
    });
  }

  inputs.forEach((input) => input.addEventListener("input", render));
  fontBox.addEventListener("change", (e) => {
    state.font = e.target.value;
    render();
  });
  document.getElementById("swap-btn").addEventListener("click", () => {
    state.swapped = !state.swapped;
    render();
  });

  new ResizeObserver(fit).observe(stage);
  img.addEventListener("load", fit);
  document.fonts.ready.then(fit);
  document.fonts.addEventListener("loadingdone", fit);
  render();

  /* ---------- บันทึกภาพตัวอย่าง (มีลายน้ำ) ---------- */
  async function renderToCanvas() {
    const font = window.FONTS[state.font];
    const names = slotEls.map((_, i) => inputs[personAt(i)].value.trim() || ROLES[personAt(i)].placeholder);
    await Promise.all(names.map((n) => document.fonts.load(`${font.weight} 40px ${font.family}`, n)));
    if (!img.complete) await new Promise((r) => img.addEventListener("load", r, { once: true }));

    const scale = 2;
    const W = img.naturalWidth * scale;
    const H = img.naturalHeight * scale;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, W, H);

    ctx.fillStyle = tpl.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    tpl.slots.forEach((s, i) => {
      const maxW = (s.w / 100) * W;
      const base = (s.size / 100) * W * font.scale;
      let px = base;
      let m;
      do {
        ctx.font = `${font.weight} ${px}px ${font.family}`;
        m = ctx.measureText(names[i]);
        if (m.width <= maxW) break;
        px *= 0.94;
      } while (px > base * 0.35);
      // จัดกึ่งกลางแนวตั้งให้ตรงกับที่แสดงบนหน้าเว็บ
      const asc = m.fontBoundingBoxAscent ?? px * 0.8;
      const desc = m.fontBoundingBoxDescent ?? px * 0.2;
      ctx.fillText(names[i], (s.x / 100) * W, (s.y / 100) * H + (asc - desc) / 2);
    });

    // ลายน้ำ
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 7);
    ctx.font = `600 ${W * 0.035}px 'IBM Plex Sans Thai', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.strokeStyle = "rgba(0,0,0,0.10)";
    ctx.lineWidth = 2;
    const mark = `ตัวอย่าง · SAMPLE · ${window.SHOP.name}`;
    for (let y = -H; y <= H; y += W * 0.16) {
      ctx.strokeText(mark, 0, y);
      ctx.fillText(mark, 0, y);
    }
    ctx.restore();
    return canvas;
  }

  document.getElementById("save-btn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      const canvas = await renderToCanvas();
      const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.9));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${tpl.id}-ตัวอย่าง.jpg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- สั่งซื้อ: คัดลอกรายละเอียด + เปิด LINE ---------- */
  document.getElementById("order-btn").addEventListener("click", async () => {
    const [groom, bride] = inputs.map((i) => i.value.trim());
    if (!groom || !bride) {
      hint.classList.remove("hint-welcome");
      hint.textContent = "กรุณากรอกชื่อเจ้าบ่าวและเจ้าสาวก่อนสั่งซื้อ";
      (groom ? inputs[1] : inputs[0]).focus();
      return;
    }
    const message = [
      "สนใจสั่งการ์ดแต่งงานค่ะ/ครับ",
      `แบบ: ${tpl.id} ${tpl.name} (${tpl.nameTh})`,
      `ชื่อเจ้าบ่าว: ${groom}`,
      `ชื่อเจ้าสาว: ${bride}`,
      `ตัวอักษร: ${window.FONTS[state.font].label}`,
      `ลำดับ: ${state.swapped ? "เจ้าสาว" : "เจ้าบ่าว"}อยู่บรรทัดบน`,
      "จำนวน: ",
    ].join("\n");

    // เริ่มคัดลอกและเปิด LINE ทันทีในจังหวะที่กดปุ่ม (ถ้ารอ await ก่อน Safari บนมือถือจะบล็อกหน้าต่างใหม่)
    const copied = navigator.clipboard
      ? navigator.clipboard.writeText(message).then(() => true, () => false)
      : Promise.resolve(false);

    const id = window.SHOP.lineId;
    const url = id
      ? `https://line.me/R/oaMessage/${encodeURIComponent(id)}/?${encodeURIComponent(message)}`
      : "line.html?order=1";
    window.open(url, "_blank", "noopener");

    const welcome = "🤍 ขอบคุณที่เลือกการ์ดของ inthelongrun นะคะ ทางร้านได้รับความสนใจของคุณแล้ว และจะรีบติดต่อกลับให้เร็วที่สุดค่ะ 🤍";
    hint.classList.add("hint-welcome");
    hint.textContent = (await copied)
      ? `${welcome}\nรายละเอียดการ์ดถูกคัดลอกไว้แล้ว เพิ่มเพื่อนใน LINE แล้ววางข้อความในแชทได้เลยค่ะ`
      : welcome;
  });

  /* ---------- โหมดปรับตำแหน่ง: card.html?id=...&debug=1 ---------- */
  if (params.has("debug")) {
    stage.classList.add("debug");
    document.getElementById("debug-panel").hidden = false;
    const out = document.getElementById("debug-out");
    stage.addEventListener("click", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
      const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
      out.textContent = `x: ${x}, y: ${y}`;
    });
  }
})();
