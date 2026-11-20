ES TEH JOGIS — WEBSITE PROFIL UMKM
================================

STRUKTUR FILE
  index.html            -> isi halaman
  css/style.css         -> semua tampilan (warna, font, layout)
  js/main.js            -> nomor WhatsApp, daftar menu, keranjang pesanan
  assets/               -> semua foto & logo yang dipakai
  README.txt            -> panduan ini

CARA MEMBUKA DI VISUAL STUDIO CODE
1. Ekstrak ZIP ini ke satu folder (misal: jogis-website).
2. Buka folder itu di VS Code (File > Open Folder).
3. Klik kanan index.html > Open with Live Server (ekstensi Live Server),
   atau klik dua kali index.html untuk membukanya di browser.

YANG PALING SERING DIUBAH
1. Nomor WhatsApp -> js/main.js baris: var WHATSAPP = "6287815916379";
   Format 62, tanpa tanda + dan tanpa spasi.

2. Daftar menu & harga -> js/main.js bagian: var MENU = [
   Setiap seri punya title, price, note, items.
   Item ditulis "Nama Menu" atau "Nama Menu|Label" (label opsional).
   Harga berupa angka, contoh: 5000.

3. Alamat, jam buka, nama pemilik, nomor Halal -> pakai Ctrl+F di
   index.html, misal cari "Diponegoro" atau "Bagus Saputro".

4. Foto & logo -> ganti file di folder assets/ dengan nama file yang sama,
   atau ubah src="assets/..." di index.html.

5. Warna & font -> semuanya di css/style.css bagian :root
   (--forest hijau tua, --gold emas, --parchment krem, --ink teks).
   Font: Playfair Display untuk judul, Inter untuk isi.

PUBLIKASI GRATIS
  Unggah seluruh folder (index.html, css, js, assets) ke Netlify Drop,
  Vercel, GitHub Pages, atau hosting apa pun. Tidak butuh proses build.
