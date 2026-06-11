<script>
  import { onMount } from 'svelte';
  import QRCodeStyling from 'qr-code-styling';
  import { fade, fly } from 'svelte/transition';

  // --- STATE & KONFIGURASI ---
  let urlData = ""; 
  let dotsType = "rounded";
  let cornersType = "extra-rounded";
  let fgColor = "#4f46e5"; 
  let bgColor = "#ffffff";
  let logoImage = null;
  let logoSize = 0.3;
  let logoMargin = 10;

  let qrCode;
  let qrContainer;
  let isDark = false;

  onMount(() => {
    qrCode = new QRCodeStyling({
      width: 320,
      height: 320,
      data: urlData || " ", 
      image: logoImage,
      dotsOptions: { color: fgColor, type: dotsType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: fgColor, type: cornersType },
      cornersDotOptions: { color: fgColor, type: "dot" },
      imageOptions: { crossOrigin: "anonymous", margin: logoMargin, imageSize: logoSize }
    });
    qrCode.append(qrContainer);

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark = true;
    }
  });

  $: if (qrCode) {
    qrCode.update({
      data: urlData || " ",
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
      reader.onload = (e) => logoImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  const download = (ext) => {
    qrCode.download({ name: "qr-generator-hasil", extension: ext });
  };

  const toggleTheme = () => isDark = !isDark;
</script>

<div class="min-h-screen transition-all duration-500 font-sans selection:bg-indigo-500/30 {isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}">
  
  <div class="max-w-6xl mx-auto px-6 py-10">
    
    <!-- HEADER & THEME TOGGLE -->
    <header class="flex justify-between items-center mb-16">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 duration-300">
          <i class="ri-qr-code-line text-4xl text-white"></i>
        </div>
        <div>
          <h1 class="text-4xl font-black tracking-tight {isDark ? 'text-white' : 'text-slate-900'}">QR Generator</h1>
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">Premium Edition</p>
        </div>
      </div>

      <!-- MODERN THEME TOGGLE (iOS Style) -->
      <button 
        on:click={toggleTheme}
        class="relative w-20 h-10 rounded-full p-1 transition-all duration-300 focus:outline-none {isDark ? 'bg-slate-800 ring-1 ring-white/10' : 'bg-slate-200 ring-1 ring-slate-300'}"
      >
        <div class="absolute inset-0 flex items-center justify-between px-3 text-sm opacity-50">
          <i class="ri-moon-line"></i>
          <i class="ri-sun-line"></i>
        </div>
        <div 
          class="relative w-8 h-8 rounded-full transition-transform duration-500 flex items-center justify-center shadow-md {isDark ? 'translate-x-10 bg-slate-900 text-yellow-400' : 'translate-x-0 bg-white text-indigo-600'}"
        >
          {#if isDark}
            <i class="ri-moon-fill text-lg"></i>
          {:else}
            <i class="ri-sun-fill text-lg"></i>
          {/if}
        </div>
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      <!-- PANEL PENGATURAN (KIRI) -->
      <section class="lg:col-span-7 space-y-8" in:fly={{ x: -20, duration: 600 }}>
        <div class="p-8 md:p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-500 {isDark ? 'bg-slate-900/50 border-white/5 backdrop-blur-xl' : 'bg-white border-slate-200'}">
          <h2 class="text-2xl font-bold mb-10 flex items-center gap-4">
            <i class="ri-equalizer-line text-3xl text-indigo-500"></i>
            Kustomisasi QR
          </h2>

          <div class="space-y-10">
            <!-- Data Utama -->
            <div class="space-y-4">
              <label class="flex items-center gap-3 text-sm font-black uppercase tracking-widest {isDark ? 'text-slate-500' : 'text-slate-400'}" for="url">
                <i class="ri-link text-xl text-indigo-500"></i> Teks atau URL
              </label>
              <input 
                id="url"
                type="text" 
                bind:value={urlData}
                placeholder="Masukkan tautan atau pesan Anda..."
                class="w-full px-8 py-5 rounded-3xl border transition-all {isDark ? 'bg-slate-800/50 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-xl shadow-inner"
              />
            </div>

            <!-- Gaya & Bentuk -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="flex items-center gap-3 text-sm font-black uppercase tracking-widest {isDark ? 'text-slate-500' : 'text-slate-400'}" for="dots">
                  <i class="ri-layout-grid-line text-xl text-indigo-500"></i> Pola Matriks
                </label>
                <select id="dots" bind:value={dotsType} class="w-full px-6 py-4 rounded-2xl border transition-all appearance-none cursor-pointer text-base {isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}">
                  <option value="square">Kotak Standar</option>
                  <option value="dots">Titik Bulat</option>
                  <option value="rounded">Halus Melengkung</option>
                  <option value="extra-rounded">Ekstra Melengkung</option>
                  <option value="classy">Gaya Klasik</option>
                </select>
              </div>
              <div class="space-y-4">
                <label class="flex items-center gap-3 text-sm font-black uppercase tracking-widest {isDark ? 'text-slate-500' : 'text-slate-400'}" for="corners">
                  <i class="ri-focus-2-line text-xl text-indigo-500"></i> Bentuk Sudut
                </label>
                <select id="corners" bind:value={cornersType} class="w-full px-6 py-4 rounded-2xl border transition-all appearance-none cursor-pointer text-base {isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}">
                  <option value="square">Kotak</option>
                  <option value="dot">Titik</option>
                  <option value="extra-rounded">Ekstra Bulat</option>
                </select>
              </div>
            </div>

            <!-- Warna -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="flex items-center gap-3 text-sm font-black uppercase tracking-widest {isDark ? 'text-slate-500' : 'text-slate-400'}" for="fg">
                  <i class="ri-palette-line text-xl text-indigo-500"></i> Warna Pola
                </label>
                <div class="flex items-center gap-5 p-4 rounded-2xl border {isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}">
                  <input id="fg" type="color" bind:value={fgColor} class="w-14 h-14 rounded-xl border-none cursor-pointer bg-transparent" />
                  <span class="font-mono font-bold uppercase text-base">{fgColor}</span>
                </div>
              </div>
              <div class="space-y-4">
                <label class="flex items-center gap-3 text-sm font-black uppercase tracking-widest {isDark ? 'text-slate-500' : 'text-slate-400'}" for="bg">
                  <i class="ri-paint-fill text-xl text-indigo-500"></i> Warna Latar
                </label>
                <div class="flex items-center gap-5 p-4 rounded-2xl border {isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}">
                  <input id="bg" type="color" bind:value={bgColor} class="w-14 h-14 rounded-xl border-none cursor-pointer bg-transparent" />
                  <span class="font-mono font-bold uppercase text-base">{bgColor}</span>
                </div>
              </div>
            </div>

            <!-- Logo -->
            <div class="pt-8 border-t {isDark ? 'border-white/5' : 'border-slate-100'}">
              <div class="flex justify-between items-center mb-6">
                <label class="flex items-center gap-3 text-sm font-black uppercase tracking-widest {isDark ? 'text-slate-500' : 'text-slate-400'}" for="logo">
                  <i class="ri-image-add-line text-xl text-indigo-500"></i> Unggah Logo
                </label>
                {#if logoImage}
                  <button on:click={() => logoImage = null} class="text-xs font-bold text-rose-500 hover:underline">Hapus Logo</button>
                {/if}
              </div>
              <input 
                id="logo"
                type="file" 
                accept="image/*"
                on:change={handleLogoUpload}
                class="w-full text-sm text-slate-500 file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-sm file:font-black file:uppercase file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- PANEL PRATINJAU (KANAN) -->
      <section class="lg:col-span-5 flex flex-col gap-8 sticky top-10" in:fly={{ x: 20, duration: 600 }}>
        <div class="p-10 rounded-[3rem] shadow-2xl border transition-all duration-500 flex flex-col items-center justify-center text-center {isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}">
          
          <div class="relative group mb-12">
            <!-- Dekoratif Latar QR -->
            <div class="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-75 transition-transform group-hover:scale-110"></div>
            
            <div class="relative bg-white p-8 rounded-[3rem] shadow-2xl transition-all duration-500 {urlData ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} hover:scale-[1.03] ring-1 ring-black/5">
              <div bind:this={qrContainer} class="flex items-center justify-center overflow-hidden rounded-[2rem] bg-white"></div>
            </div>

            {#if !urlData}
              <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-6" in:fade>
                <i class="ri-qr-scan-2-line text-8xl opacity-20"></i>
                <p class="text-sm font-bold uppercase tracking-[0.3em] opacity-40">Menunggu Input...</p>
              </div>
            {/if}
          </div>

          <!-- TOMBOL UNDUH -->
          <div class="grid grid-cols-2 gap-5 w-full">
            <button 
              on:click={() => download('png')}
              disabled={!urlData}
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-sm tracking-widest"
            >
              <i class="ri-download-2-line text-2xl"></i>
              PNG
            </button>
            <button 
              on:click={() => download('svg')}
              disabled={!urlData}
              class="flex-1 {isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 hover:bg-black text-white'} disabled:opacity-50 disabled:cursor-not-allowed font-black py-6 rounded-[1.5rem] shadow-xl transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-sm tracking-widest"
            >
              <i class="ri-file-code-line text-2xl"></i>
              SVG
            </button>
          </div>

          <div class="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40">
            <i class="ri-checkbox-circle-fill {urlData ? 'text-green-500 animate-pulse' : 'text-slate-400'} text-xl"></i>
            {urlData ? 'Siap untuk diunduh' : 'Input kosong'}
          </div>
        </div>

        <!-- INFO CARD -->
        <div class="p-8 rounded-[2.5rem] border transition-all {isDark ? 'bg-indigo-900/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'} shadow-sm">
          <p class="text-base leading-relaxed font-medium flex gap-4">
            <i class="ri-information-line text-2xl text-indigo-500"></i>
            <span>
              <span class="font-black">Tips:</span> Gunakan format <span class="underline decoration-indigo-400 underline-offset-4">SVG</span> untuk hasil cetak ukuran besar agar tetap tajam.
            </span>
          </p>
        </div>
      </section>

    </div>
    
    <!-- FOOTER -->
    <footer class="mt-24 text-center py-16 border-t {isDark ? 'border-white/5' : 'border-slate-200'}">
       <div class="flex items-center justify-center flex-wrap gap-x-4 gap-y-6 text-sm font-black uppercase tracking-[0.3em] opacity-60">
         <span>Dibuat dengan</span>
         <div class="flex items-center gap-3">
           <i class="ri-heart-fill text-rose-500 animate-pulse text-2xl drop-shadow-sm"></i>
           <span class="opacity-40">&</span>
           <i class="ri-cup-fill text-amber-700 text-2xl drop-shadow-sm"></i>
         </div>
         <span>oleh</span>
         <span class="text-indigo-600 tracking-[0.4em] drop-shadow-sm">Sugiyanto Prasetio</span>
       </div>
    </footer>

  </div>

</div>

<style>
  /* Menghapus tampilan default select pada browser tertentu */
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(128,128,128,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1.25rem center;
    background-size: 1rem;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 14px;
  }
</style>
