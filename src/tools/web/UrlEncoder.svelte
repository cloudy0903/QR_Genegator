<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let input = 'https://example.com/search?q=kamera digital & lensa=50mm';
  let mode = 'encode'; // 'encode' | 'decode'
  let useComponent = true; // true: encodeURIComponent, false: encodeURI

  $: result = processUrl(input, mode, useComponent);

  function processUrl(text, m, comp) {
    if (!text) return '';
    try {
      if (m === 'encode') {
        return comp ? encodeURIComponent(text) : encodeURI(text);
      } else {
        return comp ? decodeURIComponent(text) : decodeURI(text);
      }
    } catch (e) {
      return 'Error: ' + e.message;
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    showToast('Hasil URL berhasil disalin!', 'success');
  }
</script>

<ToolLayout slug="url-encoder">
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
        <button
          on:click={() => mode = 'encode'}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all {
            mode === 'encode' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }"
        >
          URL Encode
        </button>
        <button
          on:click={() => mode = 'decode'}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all {
            mode === 'decode' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }"
        >
          URL Decode
        </button>
      </div>

      <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
        <input type="checkbox" bind:checked={useComponent} class="w-4 h-4 rounded text-indigo-600" />
        <span>Encode Seluruh Karakter Khusus (encodeURIComponent)</span>
      </label>
    </div>

    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          {mode === 'encode' ? 'URL / Teks Asli' : 'URL Ter-encode'}
        </label>
        <textarea
          bind:value={input}
          rows="4"
          class="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
        ></textarea>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Hasil {mode === 'encode' ? 'Encode' : 'Decode'}</label>
          <button on:click={copyResult} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            <i class="ri-file-copy-line"></i>
            <span>Salin</span>
          </button>
        </div>
        <textarea
          readonly
          value={result}
          rows="4"
          class="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-indigo-950 dark:text-indigo-200 focus:outline-none"
        ></textarea>
      </div>
    </div>
  </div>
</ToolLayout>
