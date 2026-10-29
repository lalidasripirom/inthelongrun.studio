# inthelongrun.studio

เว็บไซต์ขายการ์ดแต่งงานสำเร็จรูป ลูกค้าเลือกแบบแล้วลองพิมพ์ชื่อเจ้าบ่าว–เจ้าสาวลงบนการ์ดได้ทันที
ใช้ HTML / CSS / JavaScript ล้วน ไม่ต้อง build — deploy บน GitHub Pages ได้เลย

## โครงสร้าง

```
index.html              หน้าแรก + รายการแบบการ์ด
card.html               หน้าลองใส่ชื่อ (card.html?id=card-01)
line.html               หน้าเพิ่มเพื่อน LINE ของร้าน (โลโก้ + QR + ปุ่มเปิด LINE)
assets/line-qr.jpg      QR code LINE ของร้าน
assets/js/templates.js  ข้อมูลร้าน + แบบการ์ด + ตำแหน่งชื่อ  ← แก้ไฟล์นี้เป็นหลัก
assets/js/preview.js    ระบบวางชื่อบนการ์ด / บันทึกภาพ / สั่งซื้อ
assets/cards/           รูปการ์ด (xxx.jpg = รูปสำหรับใส่ชื่อ, xxx-full.jpg = รูปหน้ารายการ)
```

## ตั้งค่าร้าน

แก้ `window.SHOP` ใน `assets/js/templates.js` — ชื่อร้าน, `lineUrl` (ลิงก์ LINE ของร้าน) และ `lineId` (ใส่เฉพาะเมื่อเป็น LINE OA เช่น `@abc1234`)
ปุ่ม "สั่งซื้อแบบนี้" จะเปิดแชท LINE พร้อมข้อความรายละเอียด (แบบ, ชื่อ, ฟอนต์) และคัดลอกข้อความไว้ให้ด้วย

## เพิ่มแบบการ์ดใหม่

1. วางรูปใน `assets/cards/` เช่น `card-02.jpg` และ `card-02-full.jpg`
2. คัดลอกบล็อก `card-01` ใน `window.TEMPLATES` แล้วแก้ `id`, ชื่อ, ราคา, รูป
3. หาตำแหน่งชื่อ: เปิด `card.html?id=card-02&debug=1` แล้วคลิกตรงกลางจุดที่จะวางชื่อ
   หน้าเว็บจะแสดงค่า `x, y` → นำไปใส่ใน `slots` (ช่องแรก = เจ้าบ่าว, ช่องที่สอง = เจ้าสาว)
4. ปรับ `w` (ความกว้างสูงสุด, %) และ `size` (ขนาดตัวอักษร, % ของความกว้างรูป) จนพอดี
   — ในโหมด debug จะเห็นกรอบสีส้มแสดงพื้นที่ของชื่อ

## Deploy ด้วย GitHub Pages

```bash
cd wedding-card-shop
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

จากนั้นที่ GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**
เว็บจะอยู่ที่ `https://<username>.github.io/<repo>/`

## ทดสอบบนเครื่อง

```bash
python3 -m http.server 8000
```

แล้วเปิด http://localhost:8000
