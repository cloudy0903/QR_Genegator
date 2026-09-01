<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let rawJson = '{\n  "name": "QuickTools",\n  "version": "1.0",\n  "features": ["Fast", "Private", "Modular"],\n  "author": {\n    "name": "Developer",\n    "active": true\n  }\n}';
  let formattedJson = '';
  let errorMessage = '';
  let indentSpaces = 2;

  function formatJson() {
    errorMessage = '';
    if (!rawJson.trim()) {
      formattedJson = '';
      return;
    }
    try {
      const parsed = JSON.parse(rawJson);
      formattedJson = JSON.stringify(parsed, null, indentSpaces);
      showToast('JSON berhasil diformat & valid!', 'success');
    } catch (e) {
      errorMessage = e.message;
      showToast('Error sintaks JSON: ' + e.message, 'error');
    }
  }

  function minifyJson() {
    errorMessage = '';
    if (!rawJson.trim()) return;
    try {
      const parsed = JSON.parse(rawJson);
      formattedJson = JSON.stringify(parsed);
      rawJson = formattedJson;
      showToast('JSON berhasil dikompres (minify)!', 'success');
    } catch (e) {
      errorMessage = e.message;
      showToast('Error: ' + e.message, 'error');
    }
  }

  async function pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        rawJson = text;
        formatJson();
      }
    } catch (e) {
      showToast('Gagal membaca clipboard: ' + e.message, 'error');
    }
  }

  function copyResult() {
    const textToCopy = formattedJson || rawJson;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    showToast('JSON berhasil disalin ke clipboard!', 'success');
  }

  function downloadJson() {
    const content = formattedJson || rawJson;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-${Date.now()}.json`;
    a.click();
    showToast('File JSON berhasil didownload', 'success');
  }

  function clearAll() {
    rawJson = '';
    formattedJson = '';
    errorMessage = '';
  }
</script>

<ToolLayout slug="json-formatter">
  <div class="space-y-6">
    
    <!-- TOOLBAR -->
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div class="flex items-center gap-2">
        <button
          on:click={pasteClipboard}
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
        >
          <i class="ri-clipboard-line"></i>
          <span>Tempel (Paste)</span>
        </button>

        <button
          on:click={clearAll}
          class="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Bersihkan
        </button>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>Indent:</span>
          <select
            bind:value={indentSpaces}
            on:change={formatJson}
            class="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
          >
            <option value={2}>2 Spasi</option>
            <option value={4}>4 Spasi</option>
          </select>
        </div>

        <button
          on:click={formatJson}
          class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <i class="ri-braces-line"></i>
          <span>Beautify</span>
        </button>

        <button
          on:click={minifyJson}
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
        >
          <i class="ri-contract-left-right-line"></i>
          <span>Minify</span>
        </button>

        <button
          on:click={copyResult}
          class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <i class="ri-file-copy-line"></i>
          <span>Salin</span>
        </button>

        <button
          on:click={downloadJson}
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
        >
          <i class="ri-download-line"></i>
          <span>.json</span>
        </button>
      </div>
    </div>

    <!-- ERROR BANNER -->
    {#if errorMessage}
      <div class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
        <i class="ri-error-warning-fill text-base text-rose-500 shrink-0"></i>
        <div>
          <span class="font-bold">Error Sintaks JSON:</span> {errorMessage}
        </div>
      </div>
    {/if}

    <!-- SPLIT EDITORS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Input JSON</span>
        </div>
        <textarea
          bind:value={rawJson}
          rows="18"
          placeholder="Paste teks JSON mentah di sini..."
          class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100 shadow-inner"
        ></textarea>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Hasil Format</span>
          {#if formattedJson}
            <span class="text-emerald-500 font-bold">Valid JSON ✓</span>
          {/if}
        </div>
        <textarea
          readonly
          value={formattedJson || rawJson}
          rows="18"
          placeholder="Hasil format akan muncul di sini..."
          class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono focus:outline-none text-indigo-950 dark:text-indigo-200 shadow-inner"
        ></textarea>
      </div>
    </div>

  </div>
</ToolLayout>
