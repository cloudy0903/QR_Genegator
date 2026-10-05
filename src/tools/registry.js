export const CATEGORIES = [
  {
    id: 'qr',
    name: 'QR & Barcode',
    description: 'Generator & scanner kode QR, Barcode, WiFi QR, WhatsApp QR',
    icon: 'ri-qr-code-line',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Merge, split, konversi gambar ke PDF, dan manipulasi PDF',
    icon: 'ri-file-pdf-line',
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Konversi format, kompres gambar, resize, dan crop',
    icon: 'ri-image-line',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'JSON formatter, Base64, UUID, Hash, JWT decoder, Timestamp',
    icon: 'ri-code-s-slash-line',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'security',
    name: 'Security Tools',
    description: 'Password generator aman, token acak, enkripsi hash',
    icon: 'ri-shield-keyhole-line',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Penghitung kata, case converter, hapus duplikat, lorem ipsum',
    icon: 'ri-font-size-2',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'calculator',
    name: 'Kalkulator',
    description: 'Kalkulator persentase, usia, diskon, dan tanggal',
    icon: 'ri-calculator-line',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'converter',
    name: 'Unit Converter',
    description: 'Konversi panjang, berat, suhu, dan kapasitas digital',
    icon: 'ri-scales-3-line',
    color: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'design',
    name: 'Color & Design',
    description: 'Color picker, CSS gradient generator, box shadow generator',
    icon: 'ri-palette-line',
    color: 'from-fuchsia-500 to-pink-600'
  },
  {
    id: 'web',
    name: 'Web Tools',
    description: 'URL encoder/decoder, meta tag generator, SEO tools',
    icon: 'ri-global-line',
    color: 'from-sky-500 to-cyan-600'
  },
  {
    id: 'audio',
    name: 'Audio Tools',
    description: 'Konversi video & audio ke MP3, pemrosesan audio berkecepatan tinggi',
    icon: 'ri-music-2-line',
    color: 'from-rose-500 to-red-600'
  }
];

export const TOOLS = [
  // AUDIO TOOLS
  {
    id: 'youtube-audio-converter',
    slug: 'youtube-audio-converter',
    name: 'YouTube Audio Converter',
    category: 'audio',
    description: 'Convert permitted video content into high-quality audio directly in your browser.',
    icon: 'ri-music-2-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['youtube', 'yt audio', 'mp3 converter', 'convert youtube', 'audio converter', 'video to mp3', 'yt to mp3', 'youtube mp3', 'audio', 'sound'],
    faq: [
      {
        q: 'Is this tool free?',
        a: 'Yes, the tool is designed to be free to use.'
      },
      {
        q: 'Are my files uploaded?',
        a: 'Local files should be processed directly in the browser whenever technically possible.'
      },
      {
        q: 'Do I need to install software?',
        a: 'No installation should be required.'
      },
      {
        q: 'Can I convert any YouTube video?',
        a: 'Only content that you own, have permission to use, or that is explicitly available for download should be processed.'
      },
      {
        q: 'Where are my files stored?',
        a: 'Local files processed client-side remain on your device and are not permanently stored by the website.'
      }
    ]
  },
  // QR & BARCODE
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    name: 'QR Code Generator',
    category: 'qr',
    description: 'Buat kode QR kustom dengan logo, pilihan warna, gaya titik & sudut unik.',
    icon: 'ri-qr-code-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['qr', 'qrcode', 'bikin qr', 'buat barcode qr', 'qr link', 'wifi qr', 'wa qr'],
    faq: [
      { q: 'Apakah QR Code ini memiliki masa kadaluarsa?', a: 'Tidak! Kode QR yang dihasilkan bersifat statis dan berlaku selamanya tanpa batas waktu.' },
      { q: 'Apakah data saya disimpan di server?', a: 'Tidak sama sekali. Pembuatan QR Code 100% diproses langsung di browser Anda (Client-Side).' }
    ]
  },
  {
    id: 'qr-scanner',
    slug: 'qr-scanner',
    name: 'QR Code Scanner',
    category: 'qr',
    description: 'Pindai dan baca isi kode QR menggunakan kamera web atau upload gambar.',
    icon: 'ri-qr-scan-2-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: false,
    synonyms: ['scan qr', 'baca qr', 'pindai qr', 'scan barcode', 'camera qr'],
    faq: [
      { q: 'Apakah kamera saya aman?', a: 'Sangat aman. Akses kamera hanya digunakan oleh browser lokal Anda dan tidak dikirim ke server manapun.' }
    ]
  },
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    name: 'Barcode Generator',
    category: 'qr',
    description: 'Generate barcode linear standar industri (CODE128, EAN-13, Code 39) format SVG/PNG.',
    icon: 'ri-barcode-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['barcode', 'code128', 'ean', 'bikin barcode', 'label harga'],
    faq: [
      { q: 'Format apa saja yang didukung?', a: 'Mendukung CODE128, EAN-13, EAN-8, CODE39, dan UPC dengan ekspor SVG dan PNG.' }
    ]
  },

  // PDF TOOLS
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    category: 'pdf',
    description: 'Ubah foto JPG, PNG, atau WEBP menjadi satu dokumen PDF berkualitas tinggi.',
    icon: 'ri-file-image-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['jpg to pdf', 'png to pdf', 'gambar ke pdf', 'foto ke pdf', 'convert pdf'],
    faq: [
      { q: 'Bisakah menggabungkan banyak foto sekaligus?', a: 'Ya, Anda dapat memilih banyak foto dan menyusun urutannya sebelum dikonversi ke PDF.' }
    ]
  },
  {
    id: 'pdf-merge',
    slug: 'pdf-merge',
    name: 'Merge PDF',
    category: 'pdf',
    description: 'Gabungkan beberapa file PDF menjadi satu file secara berurutan dan cepat.',
    icon: 'ri-file-copy-2-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['merge pdf', 'gabung pdf', 'satukan pdf', 'combine pdf'],
    faq: [
      { q: 'Apakah ada batasan jumlah file?', a: 'Pemrosesan berlangsung di browser Anda, sehingga Anda dapat menggabungkan banyak file sesuai kapasitas memori perangkat Anda.' }
    ]
  },
  {
    id: 'pdf-split',
    slug: 'pdf-split',
    name: 'Split & Extract PDF',
    category: 'pdf',
    description: 'Pisahkan halaman PDF atau ekstrak rentang halaman tertentu ke file PDF baru.',
    icon: 'ri-scissors-cut-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['split pdf', 'pisah pdf', 'potong pdf', 'ambil halaman pdf', 'ekstrak pdf'],
    faq: [
      { q: 'Bagaimana cara menentukan halaman?', a: 'Anda dapat menentukan rentang seperti 1-3, 5, 8-10.' }
    ]
  },

  // IMAGE TOOLS
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Kecilkan ukuran file foto JPG, PNG, dan WEBP tanpa mengorbankan kualitas visual.',
    icon: 'ri-file-reduce-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['compress image', 'kecilkan foto', 'kompres gambar', 'perkecil ukuran foto', 'reduce size'],
    faq: [
      { q: 'Berapa persen ukuran file berkurang?', a: 'Tergantung pengaturan slider kualitas visual, umumnya bisa berkurang 50% hingga 80% tanpa perbedaan kasat mata.' }
    ]
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Converter',
    category: 'image',
    description: 'Konversi format gambar secara instan antar JPG, PNG, WEBP, dan SVG.',
    icon: 'ri-exchange-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: false,
    synonyms: ['convert gambar', 'jpg to png', 'png to jpg', 'webp to jpg', 'jpg to webp', 'svg to png'],
    faq: [
      { q: 'Apakah transparansi tetap terjaga?', a: 'Ya, saat mengonversi ke PNG atau WEBP transparansi latar belakang tetap dipertahankan.' }
    ]
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    description: 'Ubah dimensi lebar dan tinggi gambar dengan preset media sosial atau ukuran kustom.',
    icon: 'ri-aspect-ratio-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['resize foto', 'ubah ukuran gambar', 'resolusi foto', 'crop dimensi', 'instagram size'],
    faq: [
      { q: 'Apakah rasio aspek tetap terjaga?', a: 'Ya, Anda dapat mengunci Maintain Aspect Ratio agar foto tidak terdistorsi atau gepeng.' }
    ]
  },
  {
    id: 'image-crop-rotate',
    slug: 'image-crop-rotate',
    name: 'Rotate & Flip Image',
    category: 'image',
    description: 'Putar gambar 90°, 180°, atau balik vertikal dan horizontal dengan cepat.',
    icon: 'ri-anticlockwise-2-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['putar gambar', 'rotate foto', 'flip gambar', 'mirror foto', 'cermin'],
    faq: [
      { q: 'Apakah kualitas gambar berkurang?', a: 'Tidak, rotasi diproses langsung secara lossless dalam format aslinya.' }
    ]
  },

  // DEVELOPER TOOLS
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer',
    description: 'Format, percantik (beautify), kompres (minify), dan validasi sintaks JSON seketika.',
    icon: 'ri-braces-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['json', 'format json', 'json beautifier', 'json validator', 'json minifier'],
    faq: [
      { q: 'Apakah ada pendeteksi error sintaks?', a: 'Ya! Jika ada tanda koma yang hilang atau tanda petik tidak valid, pesan error spesifik akan langsung ditunjukkan.' }
    ]
  },
  {
    id: 'base64-tool',
    slug: 'base64-tool',
    name: 'Base64 Encoder & Decoder',
    category: 'developer',
    description: 'Encode dan decode teks atau berkas biner ke/dari format Base64 secara instan.',
    icon: 'ri-file-code-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['base64', 'base64 encode', 'base64 decode', 'b64', 'data url'],
    faq: [
      { q: 'Bisa encode file gambar?', a: 'Bisa, file gambar dapat diubah menjadi Data URI Base64 untuk langsung disematkan di kode HTML/CSS.' }
    ]
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    category: 'developer',
    description: 'Hasilkan UUID Versi 4 acak sesuai standar RFC4122 secara satuan atau massal.',
    icon: 'ri-fingerprint-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['uuid', 'guid', 'uuid v4', 'unique id', 'random id'],
    faq: [
      { q: 'Apakah UUID yang dibuat terjamin unik?', a: 'Ya, menggunakan algoritma kriptografi browser (crypto.randomUUID) dengan probabilitas tabrakan nyaris nol.' }
    ]
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer',
    description: 'Hitung hash kriptografi SHA-1, SHA-256, SHA-512, dan MD5 dari teks input.',
    icon: 'ri-lock-password-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['hash', 'sha256', 'sha512', 'md5', 'checksum', 'digest'],
    faq: [
      { q: 'Bagaimana keamanannya?', a: 'Hash dihitung menggunakan native Web Crypto API browser Anda tanpa pengiriman data keluar.' }
    ]
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'developer',
    description: 'Decode JSON Web Token (Header & Payload) untuk melihat claims dan masa berlaku (exp).',
    icon: 'ri-key-2-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['jwt', 'jwt decode', 'token decode', 'bearer token', 'claims'],
    faq: [
      { q: 'Apakah token saya aman?', a: 'Sangat aman, token tidak dikirim ke server mana pun dan hanya diuraikan secara lokal di memori browser.' }
    ]
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'developer',
    description: 'Konversi waktu detik/milidetik epoch Unix ke tanggal format manusia dan sebaliknya.',
    icon: 'ri-time-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['timestamp', 'unix time', 'epoch', 'waktu unix', 'date to timestamp'],
    faq: [
      { q: 'Apakah mendukung milidetik?', a: 'Ya, mendukung mode detik (10 digit) maupun milidetik (13 digit).' }
    ]
  },

  // SECURITY TOOLS
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Strong Password Generator',
    category: 'security',
    description: 'Hasilkan kata sandi acak yang aman dengan indikator kekuatan dan pengaturan simbol.',
    icon: 'ri-shield-check-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: true,
    synonyms: ['password', 'kata sandi', 'bikin password', 'passphrase', 'generate password'],
    faq: [
      { q: 'Apakah password ini dicatat?', a: 'Tidak pernah. Password digenerate secara kriptografis menggunakan crypto.getRandomValues di browser Anda.' }
    ]
  },
  {
    id: 'random-string-generator',
    slug: 'random-string-generator',
    name: 'Random String / Secret Generator',
    category: 'security',
    description: 'Hasilkan string acak, API key dummy, token hex, atau karakter khusus sesuai panjang pilihan.',
    icon: 'ri-shuffle-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['random string', 'secret key', 'api key', 'token generator', 'acak huruf'],
    faq: [
      { q: 'Bisa pilih kombinasi huruf saja?', a: 'Bisa, Anda dapat memilih kombinasi angka, huruf kecil, huruf besar, dan karakter hex.' }
    ]
  },

  // TEXT TOOLS
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    category: 'text',
    description: 'Analisis statistik teks: jumlah kata, karakter, kalimat, paragraf, serta estimasi waktu baca.',
    icon: 'ri-text-spacing',
    processing_type: 'client',
    is_popular: true,
    is_featured: false,
    synonyms: ['hitung kata', 'word counter', 'karakter counter', 'jumlah huruf', 'reading time'],
    faq: [
      { q: 'Apakah waktu baca dihitung otomatis?', a: 'Ya, dihitung berdasarkan kecepatan rata-rata membaca manusia (200 kata/menit).' }
    ]
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Text Case Converter',
    category: 'text',
    description: 'Ubah teks ke UPPERCASE, lowercase, Title Case, camelCase, snake_case, dan kebab-case.',
    icon: 'ri-font-size',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['huruf besar', 'huruf kecil', 'camelcase', 'snake case', 'kebab case', 'title case'],
    faq: [
      { q: 'Format apa saja yang tersedia?', a: 'Tersedia 8 format populer termasuk Title Case, Sentence case, camelCase, PascalCase, snake_case, dan kebab-case.' }
    ]
  },
  {
    id: 'remove-duplicates',
    slug: 'remove-duplicates',
    name: 'Remove Duplicate Lines & Sort',
    category: 'text',
    description: 'Hapus baris duplikat dari daftar teks dan urutkan secara abjad (A-Z / Z-A).',
    icon: 'ri-sort-asc',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['hapus duplikat', 'deduplicate', 'sort baris', 'urutkan list', 'unique lines'],
    faq: [
      { q: 'Apakah peka terhadap spasi kosong?', a: 'Anda dapat mengaktifkan opsi Trim Whitespace agar spasi ekstra di awal/akhir baris dibersihkan otomatis.' }
    ]
  },
  {
    id: 'lorem-ipsum',
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    category: 'text',
    description: 'Hasilkan teks placeholder standar Lorem Ipsum berdasarkan jumlah paragraf, kalimat, atau kata.',
    icon: 'ri-file-text-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['lorem ipsum', 'dummy text', 'teks contoh', 'placeholder text'],
    faq: [
      { q: 'Bisa langsung disalin?', a: 'Tentu, cukup klik tombol Salin Teks satu klik.' }
    ]
  },

  // CALCULATOR
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Kalkulator Persentase',
    category: 'calculator',
    description: 'Hitung persentase nilai, perbandingan persentase, serta kenaikan dan penurunan persen.',
    icon: 'ri-percent-line',
    processing_type: 'client',
    is_popular: true,
    is_featured: false,
    synonyms: ['persen', 'hitung persen', 'diskon', 'persentase', 'percentage'],
    faq: [
      { q: 'Model perhitungan apa saja yang didukung?', a: '1) Berapa X% dari Y? 2) X itu berapa persen dari Y? 3) Kenaikan/penurunan dari X ke Y.' }
    ]
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Kalkulator Usia & Tanggal',
    category: 'calculator',
    description: 'Hitung usia akurat hingga tahun, bulan, hari, dan hitung mundur menuju ulang tahun berikutnya.',
    icon: 'ri-cake-2-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['hitung umur', 'usia', 'kalkulator umur', 'tanggal lahir', 'birthday countdown'],
    faq: [
      { q: 'Apakah memperhitungkan tahun kabisat?', a: 'Ya, perhitungan tanggal JavaScript memperhitungkan tahun kabisat dan variasi jumlah hari per bulan secara akurat.' }
    ]
  },

  // UNIT CONVERTER
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Unit Converter Serbaguna',
    category: 'converter',
    description: 'Konversi satuan panjang, berat/massa, suhu, dan ukuran data digital secara langsung.',
    icon: 'ri-scales-3-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['konversi satuan', 'meter ke km', 'kg ke lbs', 'celcius ke fahrenheit', 'mb ke gb', 'converter'],
    faq: [
      { q: 'Apakah konversi berlangsung dua arah?', a: 'Ya, Anda dapat menukar arah satuan (swap) secara instan.' }
    ]
  },

  // COLOR & DESIGN
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker & Converter',
    category: 'design',
    description: 'Pilih warna dan konversi instan antara nilai HEX, RGB, HSL, dan CMYK dengan copy CSS.',
    icon: 'ri-palette-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['color picker', 'warna', 'hex to rgb', 'rgb to hex', 'hsl', 'kode warna'],
    faq: [
      { q: 'Bisa langsung menyalin format kode warna?', a: 'Ya, setiap format dilengkapi tombol salin satu klik.' }
    ]
  },
  {
    id: 'gradient-generator',
    slug: 'gradient-generator',
    name: 'CSS Gradient Generator',
    category: 'design',
    description: 'Buat gradien warna CSS linear & radial dengan pratinjau langsung dan kode CSS siap pakai.',
    icon: 'ri-contrast-drop-2-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['gradient css', 'gradasi warna', 'background gradient', 'linear gradient', 'radial gradient'],
    faq: [
      { q: 'Apakah kode CSS kompatibel dengan semua browser?', a: 'Ya, menghasilkan standar CSS3 linear-gradient dan radial-gradient murni.' }
    ]
  },
  {
    id: 'box-shadow-generator',
    slug: 'box-shadow-generator',
    name: 'CSS Box Shadow Generator',
    category: 'design',
    description: 'Rancang efek bayangan elemen web dengan kontrol offset, blur, spread, dan inset.',
    icon: 'ri-shadow-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['box shadow', 'bayangan css', 'shadow generator', 'css shadow'],
    faq: [
      { q: 'Bisa untuk bayangan inset (ke dalam)?', a: 'Ya, terdapat sakelar Inset Shadow.' }
    ]
  },

  // WEB TOOLS
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder & Decoder',
    category: 'web',
    description: 'Encode dan decode parameter URL atau URI agar aman dari karakter khusus web.',
    icon: 'ri-link-m',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['url encode', 'url decode', 'percent encoding', 'uri encode'],
    faq: [
      { q: 'Apa bedanya encodeURI dan encodeURIComponent?', a: 'encodeURIComponent meng-encode karakter spesial seperti "/", "?", "&" yang biasanya dipakai pada nilai query parameter.' }
    ]
  },
  {
    id: 'meta-tag-generator',
    slug: 'meta-tag-generator',
    name: 'SEO & Social Meta Tag Generator',
    category: 'web',
    description: 'Hasilkan tag meta HTML lengkap termasuk Open Graph (Facebook/LinkedIn) dan Twitter Cards.',
    icon: 'ri-seo-line',
    processing_type: 'client',
    is_popular: false,
    is_featured: false,
    synonyms: ['meta tag', 'open graph', 'twitter card', 'seo meta', 'google preview'],
    faq: [
      { q: 'Apakah mencakup pratinjau tampilan sosial?', a: 'Ya, Anda dapat melihat pratinjau kartu tampilan Google Search dan Facebook Share.' }
    ]
  }
];

// Helper functions for search
export function searchTools(query) {
  if (!query || !query.trim()) return TOOLS;
  const q = query.toLowerCase().trim();

  return TOOLS.filter((tool) => {
    // Match name or description
    if (tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)) {
      return true;
    }
    // Match category
    if (tool.category.toLowerCase().includes(q)) {
      return true;
    }
    // Match synonyms
    if (tool.synonyms && tool.synonyms.some(s => s.toLowerCase().includes(q))) {
      return true;
    }
    return false;
  });
}

export function getToolBySlug(slug) {
  return TOOLS.find(t => t.slug === slug);
}

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

export function getRelatedTools(currentToolSlug, limit = 4) {
  const current = getToolBySlug(currentToolSlug);
  if (!current) return [];
  return TOOLS
    .filter(t => t.slug !== currentToolSlug && t.category === current.category)
    .slice(0, limit);
}
