
### **Product Requirements Document (PRD)**

**Nama Produk:** Svelte QR Generator Premium
**Versi:** 1.0.0
**Platform:** Web Application (Klien-Sisi/Client-Side)

---

### **1. Ringkasan Eksekutif**

Svelte QR Generator Premium adalah aplikasi web ringan yang memungkinkan pengguna mengubah URL atau teks menjadi QR Code yang sangat dapat dikustomisasi. Aplikasi ini berjalan 100% di sisi klien (browser) tanpa memerlukan *database* atau *server backend*. Fokus utama produk ini adalah kecepatan, privasi pengguna, dan kemampuan desain visual (bentuk, warna, logo) dengan hasil unduhan beresolusi tinggi.

### **2. Tujuan Produk**

* **Kecepatan & Responsivitas:** Memberikan umpan balik instan (*real-time*) setiap kali pengguna mengetik link atau mengubah desain.
* **Privasi:** Menjamin bahwa tidak ada data link atau gambar yang dikirim dan disimpan di *server* eksternal.
* **Nol Biaya Server:** Membangun arsitektur tanpa *database* agar aplikasi dapat di-hosting secara gratis selamanya.

### **3. Tumpukan Teknologi (Tech Stack)**

* **Kerangka Kerja Frontend:** Svelte (dengan *build tool* Vite).
* **Desain & UI:** Tailwind CSS (untuk *styling* yang cepat dan responsif).
* **Mesin Pembuat QR:** `qr-code-styling` (Library JavaScript untuk rendering dan kustomisasi QR di sisi klien).
* **Hosting Deployment:** Vercel / Netlify / GitHub Pages.

---

### **4. Fitur Utama & Fungsionalitas**

**A. Input Data Instan**

* Kolom input teks/URL yang secara otomatis memperbarui pratinjau (*preview*) QR Code tanpa perlu menekan tombol "Generate" atau memuat ulang halaman.

**B. Kustomisasi Desain Visual**

* **Pola (*Dots Options*):** Pilihan bentuk matriks QR (Kotak standar, Bulat, atau *Liquid/Fluid*).
* **Sudut (*Corners Options*):** Pengaturan bentuk bingkai sudut QR Code (Kotak atau Melengkung).
* **Warna (*Color Palette*):**
* Pengaturan warna latar depan (*foreground*).
* Pengaturan warna latar belakang (*background*).
* Dukungan warna solid dan gradasi (Linear/Radial).



**C. Integrasi Logo (Branding)**

* Tombol unggah (*upload*) untuk menyisipkan gambar/logo kustom ke tengah QR Code.
* Pengaturan ukuran logo dan margin (jarak) antara logo dengan pola QR.

**D. Ekspor & Unduh Resolusi Tinggi**

* Tombol unduh format **PNG** (untuk penggunaan digital umum).
* Tombol unduh format **SVG** (gambar vektor untuk percetakan skala besar tanpa pecah).

---

### **5. Alur Pengguna (User Flow)**

1. Pengguna mengunjungi halaman utama website.
2. Pengguna memasukkan link (misalnya: `[https://contoh.com](https://contoh.com)`) pada kolom yang tersedia.
3. QR Code hitam-putih standar langsung muncul di layar pratinjau.
4. Pengguna membuka panel pengaturan untuk mengubah warna QR Code menjadi biru dan mengubah polanya menjadi bulat.
5. Pengguna mengunggah ikon perusahaan mereka. Ikon otomatis muncul di tengah QR Code.
6. Pengguna menekan tombol "Unduh SVG".
7. File SVG langsung tersimpan ke perangkat pengguna.

---

### **6. Kebutuhan Antarmuka (UI/UX)**

* **Tata Letak (Layout):** Terbagi menjadi dua sisi pada layar desktop (Panel Editor di kiri, Pratinjau QR Code di kanan) dan bertumpuk (*stacked*) pada layar *mobile*.
* **Aksesibilitas:** Kontras warna yang baik pada antarmuka, serta label yang jelas pada setiap tombol dan input teks.

### **7. Kebutuhan Non-Fungsional**

* **Performa:** Pratinjau QR Code harus dirender dalam waktu kurang dari 100 milidetik setelah input pengguna berubah.
* **Ukuran Bundle Aplikasi:** Dioptimalkan sekecil mungkin berkat kompilasi Svelte, menargetkan *load time* di bawah 2 detik pada jaringan 3G.
* **Kompatibilitas:** Mendukung versi terbaru dari Chrome, Safari, Firefox, dan Edge.