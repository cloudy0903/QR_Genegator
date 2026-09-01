# QuickTools — All-in-One Digital Tools & Productivity Platform

> **"Satu website untuk semua kebutuhan tools digital sehari-hari."**

QuickTools adalah platform digital modular modern yang menyatukan beragam alat bantu (utilities) esensial dalam satu peramban web: konversi file, kompresi gambar, generator kode QR & barcode, manipulasi PDF, developer tools, security tools, kalkulator, dan konverter satuan.

Dibangun dengan arsitektur **Privacy-First (100% Client-Side Processing)** — file dan data sensitif pengguna diproses langsung di peramban lokal perangkat tanpa pernah disimpan atau dikirim ke server pihak ketiga.

---

## 🚀 Fitur Utama & Kategori Tools

### 1. 📱 QR & Barcode Tools
* **QR Code Generator**: Kustomisasi warna titik & latar, gaya membulat/persegi, logo custom di tengah, serta ekspor format PNG/SVG berkualitas tinggi. Mendukung URL, teks bebas, konfigurasi WiFi otomatis, direct WhatsApp, email, dan telepon.
* **QR Code Scanner**: Pindai dan deteksi kode QR secara instan melalui webcam live atau unggah berkas foto.
* **Barcode Generator**: Hasilkan barcode standar industri (CODE128, EAN-13, CODE39) dengan pratinjau dan unduh PNG.

### 2. 📄 PDF Tools
* **Image to PDF**: Satukan beberapa foto JPG, PNG, atau WEBP menjadi satu dokumen PDF dengan pengaturan orientasi (Portrait/Landscape), margin, dan susun ulang halaman.
* **Merge PDF**: Gabungkan banyak file PDF menjadi satu file secara berurutan dan cepat.
* **Split & Extract PDF**: Ekstrak rentang halaman tertentu (misal `1-3, 5, 8-10`) dari dokumen PDF.

### 3. 🖼️ Image Tools
* **Image Compressor**: Kompresi ukuran berkas foto (JPG/PNG/WEBP) dengan pengatur kualitas visual interaktif dan perbandingan hemat ukuran (persentase).
* **Image Converter**: Konversi instan antar format JPG, PNG, dan WEBP dengan dukungan transparansi.
* **Image Resizer**: Ubah dimensi gambar dengan pengunci rasio aspek dan preset media sosial (Instagram, TikTok, YouTube).
* **Rotate & Flip Image**: Putar 90°/180° dan balik cermin horizontal/vertikal secara langsung.

### 4. 💻 Developer Tools
* **JSON Formatter & Validator**: Rapikan indentasi JSON (Beautify 2/4 spasi), kompres (Minify), dan validasi sintaks dengan deteksi pesan error.
* **Base64 Encoder & Decoder**: Konversi teks dan berkas biner ke/dari format Base64.
* **UUID / GUID Generator**: Hasilkan UUID v4 acak RFC4122 secara satuan atau massal (hingga 50) dengan kontrol huruf besar dan tanda hubung.
* **Hash Generator**: Hitung nilai hash kriptografi SHA-256, SHA-512, SHA-1, dan MD5 menggunakan native Web Crypto API.
* **JWT Decoder**: Uraikan Header & Payload token JSON Web Token beserta pemeriksaan masa berlaku (*expiration*).
* **Unix Timestamp Converter**: Konversi bolak-balik antara waktu detik Epoch dan tanggal lokal/UTC serta jam live.

### 5. 🛡️ Security Tools
* **Strong Password Generator**: Buat kata sandi acak berkekuatan tinggi dengan kontrol panjang, simbol, angka, huruf, serta kalkulasi entropi keamanan.
* **Random String / Secret Generator**: Generator string rahasia dan token acak untuk API keys atau pengujian.

### 6. ✍️ Text Tools
* **Word & Character Counter**: Hitung kata, karakter (dengan/tanpa spasi), kalimat, paragraf, serta estimasi waktu membaca & berbicara.
* **Case Converter**: Ubah format teks ke UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, dan kebab-case.
* **Remove Duplicate Lines**: Bersihkan baris teks duplikat dan urutkan secara abjad (A-Z / Z-A).
* **Lorem Ipsum Generator**: Hasilkan teks dummy berdasarkan paragraf, kalimat, atau jumlah kata.

### 7. 🧮 Kalkulator & Converter
* **Kalkulator Persentase**: 3 mode esensial (Berapa X% dari Y, X berapa % dari Y, serta persentase kenaikan/penurunan).
* **Kalkulator Usia**: Hitung usia detail (tahun, bulan, hari) dan hitung mundur menuju ulang tahun berikutnya.
* **Unit Converter**: Konversi dua arah untuk Panjang, Berat, Suhu, dan Kapasitas Data Digital.

### 8. 🎨 Desain & Web Tools
* **Color Picker & Converter**: Pemilih warna visual dengan konversi nilai HEX, RGB, dan HSL serta salin kode.
* **CSS Gradient Generator**: Buat gradasi warna linear/radial dengan sudut derajat interaktif dan salin kode CSS `background`.
* **CSS Box Shadow Generator**: Rancang bayangan elemen (offset X/Y, blur, spread, inset) dengan live preview.
* **URL Encoder & Decoder**: Enkripsi dan dekripsi karakter khusus URI.
* **SEO Meta Tag Generator**: Buat tag meta Google dan Open Graph Facebook lengkap dengan simulasi preview.

---

## 🛠️ Stack Teknologi

* **Framework:** [Svelte 5](https://svelte.dev/)
* **Build Tool:** [Vite 8](https://vitejs.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons:** [RemixIcon](https://remixicon.com/)
* **Libraries:** `qr-code-styling`, `jsPDF`, `pdf-lib` (lazy-loaded secara dinamis)

---

## 📦 Menjalankan Project Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/cloudy0903/QR_Genegator.git
   cd Nextora
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```

---

## 🔒 Privasi & Keamanan

Semua tools digital yang tersedia di QuickTools berjalan langsung di browser pengguna (Client-Side). Dokumen, gambar, teks, dan berkas pribadi Anda tidak pernah dikirim atau disimpan di server mana pun.
