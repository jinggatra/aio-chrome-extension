# Panduan Release My App Launcher di GitHub

Dokumen ini menjelaskan cara menaruh source code di GitHub dan membuat GitHub Release yang berisi ZIP source serta file `.crx`.

## 1. Siapkan file release

Siapkan dua file berikut:

- `my-app-launcher-source.zip`: source code yang bisa diperiksa dan dipasang menggunakan **Load unpacked**.
- `my-app-launcher.crx`: paket ekstensi yang dibuat oleh Chrome.

Jangan masukkan file private key `.pem` ke dalam ZIP, repository, atau GitHub Release. Simpan di tempat pribadi yang aman. Siapa pun yang memperoleh private key dapat memengaruhi identitas paket yang ditandatangani dengan kunci itu.

## 2. Buat repository GitHub

1. Masuk ke https://github.com/new.
2. Isi nama repository, misalnya `my-app-launcher`.
3. Pilih **Public** jika ingin source dapat dilihat semua orang, atau **Private** jika hanya untuk penggunaan terbatas.
4. Buat repository. Jika source sudah memiliki README lokal, lebih mudah membuat repository kosong tanpa menambahkan README kedua.

## 3. Unggah source code

Cara paling mudah tanpa Git:

1. Buka repository yang baru dibuat.
2. Pilih **Add file → Upload files**.
3. Ekstrak `my-app-launcher-source.zip` terlebih dahulu.
4. Unggah isi folder proyek, termasuk `manifest.json`, `background.js`, `dashboard.html`, `dashboard.js`, `style.css`, folder `icons`, dan dokumentasi.
5. Klik **Commit changes**.

Alternatif menggunakan Git dari terminal:

```bash
git init
git add .
git commit -m "Release My App Launcher 1.0.0"
git branch -M main
git remote add origin https://github.com/USERNAME/my-app-launcher.git
git push -u origin main
```

Ganti `USERNAME` dengan nama akun GitHub kamu. Jalankan perintah dari folder proyek, dan pastikan file `.pem` tidak ada di folder tersebut.

## 4. Buat GitHub Release

1. Buka repository di GitHub.
2. Pada bagian **Releases**, klik **Create a new release** (atau **Draft a new release**).
3. Pilih **Choose a tag** dan buat tag `v1.0.0`.
4. Isi judul, misalnya `My App Launcher v1.0.0`.
5. Tempelkan contoh catatan release berikut.
6. Di bagian lampiran, unggah `my-app-launcher-source.zip` dan `my-app-launcher.crx`.
7. Klik **Publish release** jika sudah siap.

### Contoh release notes

```markdown
## My App Launcher v1.0.0

### Fitur
- Dashboard untuk membuka aplikasi web favorit.
- Pencarian dan filter kategori.
- Tambah, edit, dan hapus aplikasi.
- Tema terang dan gelap.
- Penyimpanan pengaturan secara lokal di browser.

### Instalasi
- Unduh `my-app-launcher-source.zip`, ekstrak, buka `chrome://extensions`, aktifkan Developer mode, lalu pilih Load unpacked dan pilih folder yang berisi `manifest.json`.
- File `.crx` disediakan sebagai paket build, tetapi Chrome di Windows/macOS dapat memblokir pemasangan lokal dari luar Chrome Web Store. Jika pemasangan `.crx` ditolak, gunakan langkah Load unpacked atau distribusikan lewat Chrome Web Store.

### Catatan
- Pengaturan dan daftar aplikasi disimpan di profil browser lokal dan tidak otomatis disinkronkan ke komputer lain.
- Integrasi Connect/Disconnect VPN langsung belum tersedia pada versi ini.
```

## 5. Cara memasang ekstensi di komputer penerima

### Metode yang direkomendasikan: Load unpacked

1. Unduh `my-app-launcher-source.zip` dari GitHub Release.
2. Ekstrak ZIP ke folder lokal.
3. Buka Google Chrome dan kunjungi `chrome://extensions`.
4. Aktifkan **Developer mode**.
5. Klik **Load unpacked**.
6. Pilih folder proyek yang di dalamnya terdapat `manifest.json`.
7. Klik ikon My App Launcher untuk membuka dashboard.

### Tentang file `.crx`

File `.crx` adalah paket ekstensi bertanda tangan, tetapi bukan berarti semua Chrome dapat memasangnya melalui drag-and-drop. Kebijakan Chrome membatasi pemasangan ekstensi di luar Chrome Web Store; pada Windows/macOS, distribusi mandiri umumnya memerlukan Chrome Web Store atau lingkungan terkelola dengan kebijakan administrator. Linux memiliki opsi pemasangan lokal yang berbeda. Lihat dokumentasi resmi: https://developer.chrome.com/docs/extensions/how-to/distribute

## 6. Membuat build CRX baru

1. Buka `chrome://extensions` dan aktifkan Developer mode.
2. Klik **Pack extension**.
3. Pilih folder source yang berisi `manifest.json`.
4. Untuk build pertama, biarkan private key kosong. Untuk build berikutnya, pilih file `.pem` yang sama.
5. Klik **Pack extension**.
6. Unggah file `.crx` baru sebagai asset GitHub Release. Jangan unggah file `.pem`.

Jika source berubah, naikkan `version` di `manifest.json` sebelum membuat release berikutnya, misalnya dari `1.0.0` menjadi `1.0.1`.

## Checklist sebelum publish

- [ ] `manifest.json` ada dan versi sesuai.
- [ ] Semua file JavaScript, HTML, CSS, dan ikon disertakan.
- [ ] Source diuji melalui **Load unpacked**.
- [ ] ZIP source tidak memuat private key `.pem`.
- [ ] File `.crx` berasal dari source versi yang sama.
- [ ] Release notes menjelaskan fitur dan batasan instalasi.
- [ ] Tag GitHub sesuai dengan versi di `manifest.json`.
