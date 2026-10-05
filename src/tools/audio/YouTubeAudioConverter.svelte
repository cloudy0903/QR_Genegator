<script>
  import { onDestroy } from 'svelte';
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';
  import {
    validateYouTubeUrl,
    fetchYouTubeMetadata,
    convertMediaFileToMp3,
    formatDuration,
    formatBytes
  } from '../../utils/audioConverter.js';

  // --- State: YouTube URL Analysis ---
  let youtubeUrl = '';
  let isAnalyzing = false;
  let urlError = '';
  let analyzedVideo = null; // { videoId, title, author, authorUrl, thumbnailUrl, maxResThumbnailUrl }

  // --- State: Audio Conversion Settings ---
  let selectedBitrate = 192;
  const bitrates = [
    { value: 96, label: '96 kbps', desc: 'Ringkas / Voice' },
    { value: 128, label: '128 kbps', desc: 'Standard Music' },
    { value: 192, label: '192 kbps', desc: 'High Quality (Direkomendasikan)' },
    { value: 256, label: '256 kbps', desc: 'Very High Quality' },
    { value: 320, label: '320 kbps', desc: 'Maksimum Fidelity' }
  ];

  // --- State: File Conversion ---
  let localFile = null;
  let isConverting = false;
  let conversionStage = ''; // 'preparing' | 'processing' | 'converting' | 'completed'
  let conversionPercent = 0;
  let conversionMessage = '';
  let conversionResult = null; // { blob, url, duration, sampleRate, channels, bitrate, size, filename }

  // Cleanup object URL when component unmounts
  onDestroy(() => {
    if (conversionResult && conversionResult.url) {
      URL.revokeObjectURL(conversionResult.url);
    }
  });

  // --- Handler: Analyze YouTube URL ---
  async function handleAnalyze() {
    urlError = '';
    const trimmed = youtubeUrl.trim();

    const validation = validateYouTubeUrl(trimmed);
    if (!validation.valid) {
      urlError = validation.error;
      showToast(validation.error, 'error');
      return;
    }

    isAnalyzing = true;
    try {
      const data = await fetchYouTubeMetadata(validation.videoId);
      analyzedVideo = data;
      showToast('Informasi video YouTube berhasil dimuat!', 'success');
    } catch (err) {
      urlError = 'Gagal mengambil metadata video. Periksa koneksi atau pastikan URL benar.';
      showToast(urlError, 'error');
    } finally {
      isAnalyzing = false;
    }
  }

  function handlePasteClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then((text) => {
        youtubeUrl = text;
        urlError = '';
        if (text) {
          handleAnalyze();
        }
      }).catch(() => {
        showToast('Gagal mengakses clipboard. Silakan tempel (Ctrl+V) manual.', 'info');
      });
    }
  }

  function clearUrl() {
    youtubeUrl = '';
    analyzedVideo = null;
    urlError = '';
  }

  // --- Handler: Local File Selection ---
  function handleFileSelected(e) {
    const file = e.detail;
    if (!file) return;

    // Reset previous conversion result
    if (conversionResult && conversionResult.url) {
      URL.revokeObjectURL(conversionResult.url);
    }
    conversionResult = null;
    localFile = file;
    showToast(`File "${file.name}" siap dikonversi.`, 'info');
  }

  function changeFile() {
    if (conversionResult && conversionResult.url) {
      URL.revokeObjectURL(conversionResult.url);
    }
    conversionResult = null;
    localFile = null;
    conversionStage = '';
    conversionPercent = 0;
  }

  // --- Handler: Convert File to MP3 ---
  async function handleConvert() {
    if (!localFile) {
      showToast('Silakan pilih file media terlebih dahulu.', 'error');
      return;
    }

    isConverting = true;
    conversionStage = 'preparing';
    conversionPercent = 5;
    conversionMessage = 'Mempersiapkan file...';

    try {
      const result = await convertMediaFileToMp3(localFile, selectedBitrate, (prog) => {
        conversionStage = prog.stage;
        conversionPercent = prog.percent;
        conversionMessage = prog.message;
      });

      const blobUrl = URL.createObjectURL(result.blob);
      
      // Determine file name: use analyzed video title if available, otherwise original file name
      let baseName = localFile.name.replace(/\.[^/.]+$/, "");
      if (analyzedVideo && analyzedVideo.title) {
        // Sanitize video title for filename
        baseName = analyzedVideo.title.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 100);
      }

      conversionResult = {
        blob: result.blob,
        url: blobUrl,
        filename: `${baseName}.mp3`,
        duration: result.duration,
        sampleRate: result.sampleRate,
        channels: result.channels,
        bitrate: result.bitrate,
        size: result.blob.size
      };

      showToast('Konversi audio ke MP3 berhasil diselesaikan!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Terjadi kesalahan saat memproses audio.', 'error');
    } finally {
      isConverting = false;
    }
  }

  // --- Handler: Download MP3 ---
  function downloadMp3() {
    if (!conversionResult || !conversionResult.url) return;
    const a = document.createElement('a');
    a.href = conversionResult.url;
    a.download = conversionResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('File MP3 berhasil diunduh ke perangkat Anda!', 'success');
  }

  // Scroll to local converter
  function scrollToConverter() {
    const el = document.getElementById('local-converter-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<ToolLayout slug="youtube-audio-converter">
  <div class="max-w-4xl mx-auto space-y-12">

    <!-- HERO & URL ANALYZER CARD (PRD Section 5, 6, 7) -->
    <div class="p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-indigo-500/5 space-y-6">
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
          <i class="ri-youtube-line text-sm"></i>
          <span>YouTube Audio Engine</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          YouTube Audio Converter
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Convert permitted video content into high-quality audio directly in your browser.
        </p>
      </div>

      <!-- URL INPUT FORM (PRD Section 7) -->
      <div class="space-y-3 max-w-2xl mx-auto">
        <label for="yt-url-input" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Paste YouTube URL
        </label>
        
        <div class="relative flex flex-col sm:flex-row items-stretch gap-2">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i class="ri-youtube-fill text-xl text-rose-600"></i>
            </div>
            <input
              id="yt-url-input"
              type="url"
              bind:value={youtubeUrl}
              on:keydown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full pl-11 pr-20 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 {urlError ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}"
            />
            {#if youtubeUrl}
              <button
                on:click={clearUrl}
                aria-label="Hapus URL"
                class="absolute inset-y-0 right-10 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                <i class="ri-close-circle-fill text-lg"></i>
              </button>
            {/if}
            <button
              type="button"
              on:click={handlePasteClipboard}
              title="Paste from clipboard"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              Paste
            </button>
          </div>

          <button
            type="button"
            on:click={handleAnalyze}
            disabled={isAnalyzing}
            class="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
          >
            {#if isAnalyzing}
              <i class="ri-loader-4-line text-lg animate-spin"></i>
              <span>Analyzing...</span>
            {:else}
              <i class="ri-search-eye-line text-lg"></i>
              <span>Analyze Video</span>
            {/if}
          </button>
        </div>

        {#if urlError}
          <p class="text-xs text-rose-500 flex items-center gap-1.5 pt-1">
            <i class="ri-error-warning-line"></i>
            <span>{urlError}</span>
          </p>
        {/if}
      </div>

      <!-- TRUST PILLS -->
      <div class="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span class="inline-flex items-center gap-1.5">
          <i class="ri-lock-line text-emerald-500"></i>
          100% Client-Side Privacy
        </span>
        <span class="inline-flex items-center gap-1.5">
          <i class="ri-flashlight-line text-amber-500"></i>
          Fast In-Memory Engine
        </span>
        <span class="inline-flex items-center gap-1.5">
          <i class="ri-gift-line text-indigo-500"></i>
          Free & No Installation
        </span>
      </div>
    </div>

    <!-- HASIL ANALISIS URL (PRD Section 8) -->
    {#if analyzedVideo}
      <div class="p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/40 via-white to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <i class="ri-film-line text-lg"></i>
            <span>Hasil Analisis Video</span>
          </div>
          <button
            on:click={() => analyzedVideo = null}
            class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
          >
            Tutup
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <!-- THUMBNAIL -->
          <div class="md:col-span-5 relative rounded-2xl overflow-hidden shadow-md bg-slate-950 aspect-video group">
            <img
              src={analyzedVideo.thumbnailUrl}
              alt={analyzedVideo.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                YouTube Video
              </span>
            </div>
          </div>

          <!-- VIDEO METADATA -->
          <div class="md:col-span-7 space-y-3">
            <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug line-clamp-2">
              {analyzedVideo.title}
            </h3>

            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span class="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <i class="ri-user-smile-line text-indigo-500"></i>
                {analyzedVideo.author}
              </span>
              <span>•</span>
              <span class="inline-flex items-center gap-1">
                <i class="ri-music-2-line text-rose-500"></i>
                MP3 Ready
              </span>
              <span>•</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-medium">
                Pilihan Bitrate: 96 – 320 kbps
              </span>
            </div>

            <!-- PRIVACY & COPYRIGHT NOTICE (PRD Section 4 & 11) -->
            <div class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div class="flex items-start gap-2">
                <i class="ri-shield-check-fill text-emerald-500 text-base shrink-0 mt-0.5"></i>
                <div class="leading-relaxed">
                  <strong>100% Client-Side Policy:</strong> Browser Anda memproses konversi secara lokal tanpa mengirim data pribadi ke server proxy. Jika Anda memiliki file rekaman/unduhan konten berizin ini, unggah di bawah untuk dikonversi menjadi MP3 secara instan.
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                on:click={scrollToConverter}
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjutkan Konversi File (MP3)</span>
                <i class="ri-arrow-down-line"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    {/if}

    <!-- CONVERT LOCAL FILE MODE (PRD Section 11 - Core Client-Side Engine) -->
    <div id="local-converter-section" class="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-100 dark:border-slate-800">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="ri-file-music-line text-indigo-500"></i>
            <span>Convert Video/Audio to MP3</span>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Unggah file video atau audio yang Anda miliki untuk dikonversi menjadi MP3 langsung di browser.
          </p>
        </div>

        {#if localFile}
          <button
            type="button"
            on:click={changeFile}
            class="text-xs text-rose-500 hover:underline font-semibold self-start sm:self-auto cursor-pointer"
          >
            Ganti File
          </button>
        {/if}
      </div>

      {#if !localFile}
        <Dropzone
          accept="video/*,audio/*,.mp4,.webm,.mov,.mkv,.wav,.m4a,.aac,.ogg,.flac,.mp3"
          label="Tarik & lepas file video atau audio ke sini"
          sublabel="Mendukung MP4, WebM, MOV, MKV, WAV, M4A, AAC, OGG, FLAC"
          fileIcon="ri-music-2-line"
          maxSizeMb={500}
          on:fileSelected={handleFileSelected}
        />
      {:else}
        <!-- FILE DETAILS & SETTINGS -->
        <div class="space-y-6">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0">
                <i class="ri-file-music-fill"></i>
              </div>
              <div class="min-w-0">
                <div class="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {localFile.name}
                </div>
                <div class="text-xs text-slate-400 flex items-center gap-2">
                  <span>{formatBytes(localFile.size)}</span>
                  <span>•</span>
                  <span>{localFile.type || 'Media File'}</span>
                </div>
              </div>
            </div>

            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0">
              Siap
            </span>
          </div>

          <!-- BITRATE QUALITY SELECTOR (PRD Section 9) -->
          <div class="space-y-2">
            <label for="bitrate-select" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pilih Kualitas Audio MP3 (Bitrate)
            </label>
            <div id="bitrate-select" class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {#each bitrates as br}
                <button
                  type="button"
                  on:click={() => { selectedBitrate = br.value; }}
                  disabled={isConverting}
                  class="p-3 rounded-2xl border text-left transition-all cursor-pointer {
                    selectedBitrate === br.value
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/25'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }"
                >
                  <div class="font-bold text-sm text-slate-900 dark:text-white">{br.label}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{br.desc}</div>
                </button>
              {/each}
            </div>
          </div>

          <!-- PROGRESS BAR (PRD Section 9) -->
          {#if isConverting}
            <div class="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <span class="flex items-center gap-2">
                  <i class="ri-loader-4-line animate-spin text-base"></i>
                  <span>{conversionMessage}</span>
                </span>
                <span>{conversionPercent}%</span>
              </div>

              <!-- PROGRESS TRACK -->
              <div class="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-300 rounded-full"
                  style="width: {conversionPercent}%"
                ></div>
              </div>

              <div class="text-[11px] text-slate-500 text-center">
                Diproses 100% di browser Anda menggunakan Web Audio API & LAME Encoder.
              </div>
            </div>
          {/if}

          <!-- ACTION BUTTON (PRD Section 9) -->
          {#if !isConverting && !conversionResult}
            <button
              type="button"
              on:click={handleConvert}
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <i class="ri-sparkling-fill text-lg"></i>
              <span>Konversi Sekarang ke MP3 ({selectedBitrate} kbps)</span>
            </button>
          {/if}

          <!-- CONVERSION RESULT & DOWNLOAD (PRD Section 10) -->
          {#if conversionResult}
            <div class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-base">
                  <i class="ri-checkbox-circle-fill text-2xl text-emerald-500"></i>
                  <span>Conversion Complete!</span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                  MP3 • {conversionResult.bitrate} kbps
                </span>
              </div>

              <!-- RESULT DETAILS -->
              <div class="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
                <div class="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {conversionResult.filename}
                </div>

                <div class="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                  {#if conversionResult.duration}
                    <span class="inline-flex items-center gap-1">
                      <i class="ri-time-line text-indigo-500"></i>
                      Durasi: {formatDuration(conversionResult.duration)}
                    </span>
                  {/if}
                  <span class="inline-flex items-center gap-1">
                    <i class="ri-hard-drive-2-line text-indigo-500"></i>
                    Ukuran: {formatBytes(conversionResult.size)}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <i class="ri-pulse-line text-indigo-500"></i>
                    {conversionResult.sampleRate} Hz • {conversionResult.channels === 1 ? 'Mono' : 'Stereo'}
                  </span>
                </div>

                <!-- AUDIO PLAYER PREVIEW -->
                <div class="pt-2">
                  <!-- svelte-ignore a11y_media_has_caption -->
                  <audio
                    src={conversionResult.url}
                    controls
                    class="w-full h-10 rounded-xl"
                  ></audio>
                </div>
              </div>

              <!-- DOWNLOAD & ACTIONS -->
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  on:click={downloadMp3}
                  class="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <i class="ri-download-2-fill text-lg"></i>
                  <span>Download MP3</span>
                </button>

                <button
                  type="button"
                  on:click={changeFile}
                  class="px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Konversi File Lain
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/if}

    </div>

    <!-- PRIVACY INDICATOR SECTION (PRD Section 12) -->
    <div class="p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/20 space-y-6">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Your files stay on your device.
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Files are processed directly in your browser whenever possible. Your files are not uploaded or stored on our servers.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div class="p-4 rounded-2xl border bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2 text-center">
          <div class="w-10 h-10 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
            <i class="ri-lock-line"></i>
          </div>
          <h3 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">100% Client-Side</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Tanpa ada file media yang dikirim ke server kami.</p>
        </div>

        <div class="p-4 rounded-2xl border bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2 text-center">
          <div class="w-10 h-10 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
            <i class="ri-flashlight-line"></i>
          </div>
          <h3 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Super Fast</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Encoding langsung di memori RAM browser peramban.</p>
        </div>

        <div class="p-4 rounded-2xl border bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2 text-center">
          <div class="w-10 h-10 mx-auto rounded-xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xl">
            <i class="ri-computer-line"></i>
          </div>
          <h3 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Browser-based</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Didukung Web Audio API standar W3C & LAME MP3.</p>
        </div>

        <div class="p-4 rounded-2xl border bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2 text-center">
          <div class="w-10 h-10 mx-auto rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl">
            <i class="ri-delete-bin-line"></i>
          </div>
          <h3 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">No Storage</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Zero log, zero database, dan zero jejak penyimpanan file.</p>
        </div>
      </div>
    </div>

    <!-- HOW IT WORKS & SEO SECTION (PRD Section 15) -->
    <div class="space-y-8 pt-4">
      
      <!-- H2: How it works -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="ri-guide-line text-indigo-500"></i>
          <span>How it works</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Paste URL or Drop File</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Analisis video YouTube yang Anda miliki atau unggah file media langsung.</p>
          </div>

          <div class="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Select Bitrate Quality</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Pilih kualitas keluaran audio dari 96 kbps hingga 320 kbps.</p>
          </div>

          <div class="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">3</div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Fast In-Browser Process</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Browser mendekode dan mengenkripsi audio secara lokal di perangkat Anda.</p>
          </div>

          <div class="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <div class="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">4</div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Download Instant MP3</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Dengarkan preview audio dan unduh file MP3 langsung ke folder download Anda.</p>
          </div>
        </div>
      </div>

      <!-- H2: Privacy first -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="ri-shield-keyhole-line text-emerald-500"></i>
          <span>Privacy first</span>
        </h2>
        <div class="p-6 rounded-2xl border bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
          <p>
            Privasi pengguna adalah prioritas mutlak kami. Berbeda dengan layanan konverter tradisional yang mengunggah file Anda ke server pihak ketiga (yang berisiko menyimpan data audio atau log Anda), <strong>YouTube Audio Converter</strong> di QuickTools memproses decoding audio langsung di dalam browser Anda.
          </p>
          <p>
            Tidak ada perantara server, tidak ada antrean unduhan eksternal, dan tidak ada database yang mencatat aktivitas konversi Anda.
          </p>
        </div>
      </div>

      <!-- H2: Supported formats -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="ri-file-list-3-line text-indigo-500"></i>
          <span>Supported formats</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              Format Input yang Didukung
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              MP4, WebM, QuickTime (MOV), Matroska (MKV), WAV, M4A, AAC, OGG Vorbis, dan FLAC.
            </p>
          </div>

          <div class="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-2">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Format Output
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              MPEG Audio Layer III (.MP3) dengan pilihan bitrate 96 kbps, 128 kbps, 192 kbps, 256 kbps, dan 320 kbps (CBR).
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
</ToolLayout>
