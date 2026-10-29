/* =========================================================
   ข้อมูลร้าน + แบบการ์ดทั้งหมด (แก้ไฟล์นี้ไฟล์เดียวเพื่อเพิ่ม/แก้แบบ)
   ========================================================= */

window.SHOP = {
  name: "inthelongrun.studio",
  nameTh: "การ์ดแต่งงานสำเร็จรูป",
  lineUrl: "https://line.me/ti/p/hJnnEtuTjD", // ลิงก์ LINE ของร้าน (จาก QR code)
  lineId: "", // ใส่เฉพาะเมื่อเป็น LINE OA เช่น "@abc1234" — ปุ่มสั่งซื้อจะใส่ข้อความในแชทให้อัตโนมัติ
  currency: "฿",
};

/* ฟอนต์ที่ลูกค้าเลือกได้
   family  = ใช้ทั้งบนหน้าเว็บและตอนบันทึกภาพ (ตัวแรกสำหรับอังกฤษ ตัวถัดไปสำหรับภาษาไทย)
   scale   = ปรับขนาดให้ฟอนต์แต่ละแบบดูใหญ่ใกล้เคียงกัน */
window.FONTS = {
  script: {
    label: "ลายมือ",
    family: "'Great Vibes', 'Charm', cursive",
    weight: 400,
    scale: 1,
  },
  serif: {
    label: "คลาสสิก",
    family: "'Cormorant Garamond', 'Noto Serif Thai', serif",
    weight: 500,
    scale: 0.78,
  },
};

/* แบบการ์ด
   slots = ตำแหน่งชื่อ 2 ตำแหน่ง (หน่วยเป็น % ของรูป image)
     x, y  = จุดกึ่งกลางของชื่อ
     w     = ความกว้างสูงสุดที่ชื่อจะยาวได้ (ถ้ายาวเกินจะย่อขนาดอัตโนมัติ)
     size  = ขนาดตัวอักษร (% ของความกว้างรูป)
   หาค่า x, y ได้ง่าย ๆ ด้วยการเปิด card.html?id=<id>&debug=1 แล้วคลิกบนรูป */
window.TEMPLATES = [
  {
    id: "card-01",
    name: "Calla Lily & Swans",
    nameTh: "คาลล่าลิลลี่ & หงส์คู่",
    price: 35,
    minOrder: 50,
    description:
      "การ์ดแบบประตูเปิดสีเขียวเสจ ตัดขอบตามลายดอกคาลล่าลิลลี่ ด้านในเป็นกระดาษสีครีมพร้อมลายเส้นหงส์คู่ ผูกโบว์ผ้า",
    tags: ["Gatefold", "โบว์ผ้า", "ไดคัท"],
    thumb: "assets/cards/card-01-full.jpg",
    image: "assets/cards/card-01.jpg",
    color: "#2b2c26",
    fonts: ["script", "serif"],
    slots: [
      { x: 48.1, y: 26.2, w: 27, size: 5.4 },
      { x: 48.1, y: 40.3, w: 27, size: 5.4 },
    ],
  },
];
