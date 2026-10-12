# My App Launcher

Ekstensi Chrome Manifest V3 untuk membuka dan mengatur aplikasi web favorit dalam satu dashboard.

## Fitur

- Dashboard tab penuh untuk aplikasi web favorit.
- Pencarian dan filter kategori.
- Tambah, edit, dan hapus aplikasi.
- Pilihan tema terang/gelap.
- Data aplikasi dan tema disimpan secara lokal di profil Chrome melalui `chrome.storage.local`.

## Instalasi untuk pengembangan / penggunaan pribadi

1. Unduh ZIP source dari bagian **Releases** di GitHub, lalu ekstrak.
2. Buka `chrome://extensions` di Google Chrome.
3. Aktifkan **Developer mode / Mode developer**.
4. Klik **Load unpacked / Muat yang belum dikemas**.
5. Pilih folder `my-app-launcher` yang berisi `manifest.json`.
6. Klik ikon ekstensi untuk membuka dashboard.

## Build file CRX

1. Buka `chrome://extensions`.
2. Aktifkan Developer mode.
3. Klik **Pack extension / Kemas ekstensi**.
4. Pada **Extension root directory**, pilih folder proyek yang berisi `manifest.json`.
5. Untuk build pertama, biarkan kolom private key kosong lalu klik **Pack extension**.
6. Chrome akan membuat file `.crx` dan `.pem`.

**Jaga file `.pem` tetap rahasia dan buat cadangan aman. Jangan unggah file `.pem` ke GitHub atau bagikan kepada orang lain.** Gunakan file kunci yang sama saat mengemas versi berikutnya agar identitas ekstensi tetap konsisten.

## Catatan distribusi

- File `.crx` dapat dibagikan sebagai artefak, tetapi Chrome pada Windows/macOS umumnya tidak mengizinkan pemasangan ekstensi lokal dari luar Chrome Web Store hanya dengan membuka file `.crx`.
- Untuk penggunaan pribadi atau pengujian, cara yang paling konsisten adalah **Load unpacked**.
- Untuk distribusi publik yang mudah dipasang dan menerima pembaruan, publikasikan melalui Chrome Web Store.
- Tombol VPN Connect/Disconnect langsung belum menjadi fitur yang terintegrasi dalam versi source ini. Integrasi memerlukan dukungan resmi dari layanan VPN terkait.

## Struktur proyek

```text
my-app-launcher/
├── manifest.json
├── background.js
├── dashboard.html
├── dashboard.js
├── style.css
├── README.md
├── RELEASE_GUIDE.md
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```
