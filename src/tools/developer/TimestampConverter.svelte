<script>
  import { onMount, onDestroy } from 'svelte';
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let currentEpoch = Math.floor(Date.now() / 1000);
  let timer;

  // Epoch to Date
  let inputEpoch = currentEpoch;
  $: epochDateLocal = inputEpoch ? new Date(inputEpoch * 1000).toLocaleString('id-ID') : '-';
  $: epochDateUtc = inputEpoch ? new Date(inputEpoch * 1000).toUTCString() : '-';

  // Date to Epoch
  let inputDate = new Date().toISOString().slice(0, 16);
  $: convertedEpoch = inputDate ? Math.floor(new Date(inputDate).getTime() / 1000) : 0;

  onMount(() => {
    timer = setInterval(() => {
      currentEpoch = Math.floor(Date.now() / 1000);
    }, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  function useCurrentTime() {
    inputEpoch = currentEpoch;
    showToast('Waktu sekarang diterapkan!', 'info');
  }

  function copyText(val) {
    navigator.clipboard.writeText(String(val));
    showToast('Disalin ke clipboard!', 'success');
  }
</script>

<ToolLayout slug="timestamp-converter">
  <div class="max-w-4xl mx-auto space-y-8">
    
    <!-- CURRENT LIVE TIMESTAMP BANNER -->
    <div class="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div class="text-xs uppercase font-bold tracking-widest text-indigo-200 mb-1">Live Epoch Timestamp Saat Ini</div>
        <div class="text-3xl sm:text-4xl font-black font-mono tracking-tight">{currentEpoch}</div>
      </div>
      <button
        on:click={() => copyText(currentEpoch)}
        class="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5"
      >
        <i class="ri-file-copy-line"></i>
        <span>Salin Epoch Sekarang</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- CONVERT EPOCH TO HUMAN DATE -->
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <i class="ri-arrow-right-line text-indigo-500"></i>
          <span>Epoch Unix → Tanggal Format Manusia</span>
        </h3>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nilai Timestamp (detik)</label>
          <div class="flex gap-2">
            <input
              type="number"
              bind:value={inputEpoch}
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold text-slate-800 dark:text-white"
            />
            <button
              on:click={useCurrentTime}
              class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-semibold shrink-0"
            >
              Sekarang
            </button>
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span class="text-slate-500">Waktu Lokal:</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">{epochDateLocal}</span>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span class="text-slate-500">Waktu UTC:</span>
            <span class="font-mono text-[11px] text-slate-800 dark:text-slate-200">{epochDateUtc}</span>
          </div>
        </div>
      </div>

      <!-- CONVERT HUMAN DATE TO EPOCH -->
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <i class="ri-arrow-right-line text-indigo-500"></i>
          <span>Tanggal & Jam → Epoch Unix</span>
        </h3>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Pilih Tanggal & Waktu</label>
          <input
            type="datetime-local"
            bind:value={inputDate}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-white"
          />
        </div>

        <div class="pt-2">
          <div class="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Hasil Nilai Epoch</div>
              <div class="text-2xl font-black font-mono text-indigo-900 dark:text-indigo-200">{convertedEpoch}</div>
            </div>
            <button
              on:click={() => copyText(convertedEpoch)}
              class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <i class="ri-file-copy-line"></i>
              <span>Salin</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</ToolLayout>
