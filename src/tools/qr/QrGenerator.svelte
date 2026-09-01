<script>
  import { onMount } from 'svelte';
  import QRCodeStyling from 'qr-code-styling';
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let activeType = 'url'; // url, text, wifi, wa, email, phone
  let urlInput = 'https://example.com';
  let textInput = '';
  let wifiSsid = '';
  let wifiPassword = '';
  let wifiEncryption = 'WPA';
  let wifiHidden = false;
  let waPhone = '';
  let waMessage = '';
  let emailAddress = '';
  let emailSubject = '';
  let emailBody = '';
  let phoneNumber = '';

  let dotsType = 'rounded';
  let cornersType = 'extra-rounded';
  let fgColor = '#4f46e5';
  let bgColor = '#ffffff';
  let logoImage = null;
  let logoSize = 0.3;
  let logoMargin = 10;
  let qrSize = 300;

  let qrCode;
  let qrContainer;

  $: computedData = computeQrData(activeType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, waPhone, waMessage, emailAddress, emailSubject, emailBody, phoneNumber);

  function computeQrData(type, url, text, ssid, pass, enc, hidden, wp, wm, ea, es, eb, pn) {
    if (type === 'url') return url || ' ';
    if (type === 'text') return text || ' ';
    if (type === 'wifi') return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden ? 'true' : 'false'};;`;
    if (type === 'wa') {
      const cleanPhone = wp.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(wm || '');
      return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    }
    if (type === 'email') {
      return `mailto:${ea}?subject=${encodeURIComponent(es || '')}&body=${encodeURIComponent(eb || '')}`;
    }
    if (type === 'phone') return `tel:${pn}`;
    return ' ';
  }

  onMount(() => {
    qrCode = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: computedData || ' ',
      image: logoImage,
      dotsOptions: { color: fgColor, type: dotsType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: cornersType },
      cornersDotOptions: { color: fgColor, type: 'dot' },
      imageOptions: { crossOrigin: 'anonymous', margin: logoMargin, imageSize: logoSize }
    });
    if (qrContainer) {
      qrCode.append(qrContainer);
    }
  });

  $: if (qrCode) {
    qrCode.update({
      data: computedData || ' ',
      image: logoImage,
      dotsOptions: { color: fgColor, type: dotsType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: cornersType },
      imageOptions: { margin: logoMargin, imageSize: logoSize }
    });
  }

  function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        logoImage = e.target.result;
        showToast('Logo berhasil diunggah!', 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  function removeLogo() {
    logoImage = null;
    showToast('Logo dihapus', 'info');
  }

  function download(ext) {
    if (!qrCode) return;
    qrCode.download({ name: `quicktools-qr-${Date.now()}`, extension: ext });
    showToast(`QR Code berhasil diunduh format ${ext.toUpperCase()}`, 'success');
  }
</script>

<ToolLayout slug="qr-generator">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- LEFT CONFIG PANEL (7 COLS) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- DATA TYPE TABS -->
      <div class="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex flex-wrap gap-1">
        {#each [
          { id: 'url', label: 'Tautan / URL', icon: 'ri-link' },
          { id: 'text', label: 'Teks Bebas', icon: 'ri-text' },
          { id: 'wifi', label: 'WiFi', icon: 'ri-wifi-line' },
          { id: 'wa', label: 'WhatsApp', icon: 'ri-whatsapp-line' },
          { id: 'email', label: 'Email', icon: 'ri-mail-line' },
          { id: 'phone', label: 'Telepon', icon: 'ri-phone-line' }
        ] as tab}
          <button
            on:click={() => activeType = tab.id}
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {
              activeType === tab.id
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            <i class="{tab.icon}"></i>
            <span>{tab.label}</span>
          </button>
        {/each}
      </div>

      <!-- FORM INPUTS -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4 shadow-sm">
        {#if activeType === 'url'}
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tautan Website (URL)</label>
            <div class="relative">
              <i class="ri-global-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="url"
                bind:value={urlInput}
                placeholder="https://websiteanda.com"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>
        {:else if activeType === 'text'}
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Isi Teks</label>
            <textarea
              bind:value={textInput}
              rows="4"
              placeholder="Tulis pesan atau teks yang ingin disimpan di QR Code..."
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            ></textarea>
          </div>
        {:else if activeType === 'wifi'}
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Jaringan (SSID)</label>
              <input
                type="text"
                bind:value={wifiSsid}
                placeholder="WiFi Kantor / Rumah"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                <input
                  type="password"
                  bind:value={wifiPassword}
                  placeholder="Password WiFi"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Enkripsi</label>
                <select
                  bind:value={wifiEncryption}
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Tanpa Password</option>
                </select>
              </div>
            </div>
          </div>
        {:else if activeType === 'wa'}
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nomor WhatsApp (dengan kode negara)</label>
              <input
                type="text"
                bind:value={waPhone}
                placeholder="6281234567890"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pesan Pembuka (Opsional)</label>
              <textarea
                bind:value={waMessage}
                rows="2"
                placeholder="Halo, saya ingin bertanya tentang..."
                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              ></textarea>
            </div>
          </div>
        {:else if activeType === 'email'}
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Alamat Email Tujuan</label>
              <input
                type="email"
                bind:value={emailAddress}
                placeholder="kontak@perusahaan.com"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Subjek Email</label>
              <input
                type="text"
                bind:value={emailSubject}
                placeholder="Judul Pertanyaan"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>
        {:else if activeType === 'phone'}
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nomor Telepon</label>
            <input
              type="tel"
              bind:value={phoneNumber}
              placeholder="+628123456789"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
            />
          </div>
        {/if}
      </div>

      <!-- CUSTOMIZATION OPTIONS ACCORDION/PANEL -->
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-5 shadow-sm">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <i class="ri-paint-brush-line text-indigo-500"></i>
          <span>Kustomisasi Gaya & Desain</span>
        </h3>

        <!-- COLORS -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Warna Titik (Foreground)</label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                bind:value={fgColor}
                class="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
              />
              <input
                type="text"
                bind:value={fgColor}
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-mono dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Warna Latar (Background)</label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                bind:value={bgColor}
                class="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
              />
              <input
                type="text"
                bind:value={bgColor}
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-mono dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- SHAPES -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Bentuk Titik</label>
            <select
              bind:value={dotsType}
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-medium dark:text-white"
            >
              <option value="rounded">Rounded (Membulat)</option>
              <option value="dots">Dots (Titik Lingkaran)</option>
              <option value="classy">Classy (Elegan)</option>
              <option value="classy-rounded">Classy Rounded</option>
              <option value="square">Square (Klasik Kotak)</option>
              <option value="extra-rounded">Extra Rounded</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Bentuk Sudut</label>
            <select
              bind:value={cornersType}
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-medium dark:text-white"
            >
              <option value="extra-rounded">Extra Rounded</option>
              <option value="dot">Circle Dot</option>
              <option value="square">Square</option>
            </select>
          </div>
        </div>

        <!-- LOGO UPLOAD -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Sisipkan Logo di Tengah</label>
          <div class="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              on:change={handleLogoUpload}
              id="logo-upload"
              class="hidden"
            />
            <label
              for="logo-upload"
              class="cursor-pointer px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
            >
              <i class="ri-upload-2-line"></i>
              <span>{logoImage ? 'Ganti Logo' : 'Upload Logo'}</span>
            </label>
            {#if logoImage}
              <button
                on:click={removeLogo}
                class="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100"
              >
                Hapus Logo
              </button>
            {/if}
          </div>
        </div>

      </div>

    </div>

    <!-- RIGHT PREVIEW PANEL (5 COLS) -->
    <div class="lg:col-span-5 flex flex-col items-center">
      <div class="sticky top-24 w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center">
        
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Pratinjau Langsung
        </h3>

        <!-- QR CANVAS CONTAINER -->
        <div class="p-4 rounded-2xl bg-white shadow-inner border border-slate-100 flex items-center justify-center min-w-[280px] min-h-[280px]">
          <div bind:this={qrContainer} class="flex items-center justify-center"></div>
        </div>

        <p class="text-xs text-slate-400 mt-4 text-center">
          QR Code diperbarui otomatis saat Anda mengetik
        </p>

        <!-- DOWNLOAD BUTTONS -->
        <div class="mt-6 w-full space-y-2.5">
          <button
            on:click={() => download('png')}
            class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <i class="ri-download-2-line text-lg"></i>
            <span>Download PNG (Resolusi Tinggi)</span>
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button
              on:click={() => download('svg')}
              class="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <i class="ri-file-code-line text-indigo-500"></i>
              <span>Vektor SVG</span>
            </button>

            <button
              on:click={() => download('jpeg')}
              class="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <i class="ri-image-line text-indigo-500"></i>
              <span>JPG Format</span>
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</ToolLayout>
