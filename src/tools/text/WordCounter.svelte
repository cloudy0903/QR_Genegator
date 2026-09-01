<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let text = 'QuickTools adalah platform utility digital serbaguna yang menyatukan beragam alat bantu digital sehari-hari dalam satu tempat. Cepat, aman, dan memprioritaskan pemrosesan langsung di browser pengguna.';

  $: charsWithSpaces = text.length;
  $: charsWithoutSpaces = text.replace(/\s+/g, '').length;
  $: words = text.trim() ? text.trim().split(/\s+/).length : 0;
  $: sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0) : 0;
  $: paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  $: readingTimeMin = Math.ceil(words / 200); // 200 wpm
  $: speakingTimeMin = Math.ceil(words / 130); // 130 wpm

  function clearText() {
    text = '';
  }

  function copyText() {
    navigator.clipboard.writeText(text);
    showToast('Teks disalin ke clipboard!', 'success');
  }
</script>

<ToolLayout slug="word-counter">
  <div class="space-y-6">
    
    <!-- STATS CARDS GRID -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div class="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{words}</div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Kata (Words)</div>
      </div>

      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{charsWithSpaces}</div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Karakter</div>
      </div>

      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{charsWithoutSpaces}</div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Tanpa Spasi</div>
      </div>

      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{sentences}</div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Kalimat</div>
      </div>

      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{paragraphs}</div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Paragraf</div>
      </div>

      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{readingTimeMin}m</div>
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Waktu Baca</div>
      </div>
    </div>

    <!-- TEXT EDITOR -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Area Teks</span>
        <div class="flex items-center gap-2">
          <button on:click={copyText} class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
            <i class="ri-file-copy-line"></i>
            <span>Salin</span>
          </button>
          <button on:click={clearText} class="text-xs text-rose-500 font-semibold hover:underline">
            Bersihkan
          </button>
        </div>
      </div>

      <textarea
        bind:value={text}
        rows="12"
        placeholder="Ketik atau paste teks di sini untuk menganalisis statistik secara langsung..."
        class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white leading-relaxed"
      ></textarea>

      <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span>Estimasi Kecepatan Bicara: </span>
          <strong class="text-slate-800 dark:text-slate-200">~{speakingTimeMin} menit</strong>
        </div>
        <div class="text-[11px] text-slate-400">
          Analisis dihitung secara instan per huruf dan per spasi
        </div>
      </div>
    </div>

  </div>
</ToolLayout>
