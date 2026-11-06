# Harga Warung

Web catatan harga barang warung: kelompok → golongan → barang, pencarian langsung (huruf besar/kecil bebas), urut A–Z / termurah / termahal, mode gelap, bisa dipasang di HP dan jalan offline. Tanpa framework dan tanpa build, jadi sangat ringan.

## Struktur
```
index.html            halaman utama
css/style.css         tampilan
js/app.js             logika aplikasi
sw.js                 service worker (offline)
manifest.webmanifest  agar bisa dipasang di HP
favicon.svg
vercel.json           pengaturan Vercel
```

## Cara deploy (GitHub + Vercel)
1. Buat repo baru di GitHub (mis. `harga-warung`).
2. Dari folder ini jalankan:
   ```
   git init
   git add .
   git commit -m "Harga Warung"
   git branch -M main
   git remote add origin https://github.com/USERNAME/harga-warung.git
   git push -u origin main
   ```
   Atau upload semua file lewat tombol **Add file → Upload files** di GitHub.
3. Buka vercel.com → **Add New → Project** → pilih repo tadi → **Deploy**.
   Framework Preset: **Other**. Build Command dan Output Directory dikosongkan.
4. Selesai. Setiap `git push` berikutnya otomatis ter-deploy.

## Jalankan di komputer
Buka `index.html` langsung, atau `npx serve .` lalu buka alamat yang muncul.

## Catatan data
- Data tersimpan di browser (localStorage) pada perangkat yang dipakai. Beda HP/browser berarti data terpisah.
- Pakai tombol **Ekspor** untuk backup file JSON dan **Impor** untuk memulihkan atau memindahkan ke perangkat lain.
- Backup dari versi HTML sebelumnya (teks dari tombol Backup) bisa disimpan sebagai file `.json` lalu diimpor di sini.
