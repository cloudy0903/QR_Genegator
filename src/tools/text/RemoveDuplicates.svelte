<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let rawLines = 'apel\njeruk\nmangga\napel\npisang\njeruk\nsemangka\nmangga';
  let trimWhitespace = true;
  let caseSensitive = false;
  let removedCount = 0;

  function removeDuplicates() {
    if (!rawLines) return;
    const lines = rawLines.split('\n');
    const seen = new Set();
    const result = [];
    let dupes = 0;

    for (let line of lines) {
      let key = trimWhitespace ? line.trim() : line;
      if (!caseSensitive) key = key.toLowerCase();

      if (key === '' && trimWhitespace) {
        continue;
      }

      if (seen.has(key)) {
        dupes++;
      } else {
        seen.add(key);
        result.push(trimWhitespace ? line.trim() : line);
      }
    }

    removedCount = dupes;
    rawLines = result.join('\n');
    showToast(`Berhasil menghapus ${removedCount} baris duplikat!`, 'success');
  }

  function sortAsc() {
    const lines = rawLines.split('\n');
    rawLines = lines.sort((a, b) => a.localeCompare(b)).join('\n');
    showToast('Diurutkan A ke Z', 'info');
  }

  function sortDesc() {
    const lines = rawLines.split('\n');
    rawLines = lines.sort((a, b) => b.localeCompare(a)).join('\n');
    showToast('Diurutkan Z ke A', 'info');
  }

  function copyText() {
    navigator.clipboard.writeText(rawLines);
    showToast('Daftar baris disalin ke clipboard!', 'success');
  }
</script>

<ToolLayout slug="remove-duplicates">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- CONTROLS -->
    <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4">
        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" bind:checked={trimWhitespace} class="w-4 h-4 rounded text-indigo-600" />
          <span>Trim Spasi Baris</span>
        </label>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" bind:checked={caseSensitive} class="w-4 h-4 rounded text-indigo-600" />
          <span>Sensitif Huruf Besar/Kecil</span>
        </label>
      </div>

      <div class="flex items-center gap-2">
        <button
          on:click={sortAsc}
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1 text-slate-700 dark:text-slate-200"
        >
          <i class="ri-sort-asc"></i>
          <span>A → Z</span>
        </button>

        <button
          on:click={sortDesc}
          class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1 text-slate-700 dark:text-slate-200"
        >
          <i class="ri-sort-desc"></i>
          <span>Z → A</span>
        </button>

        <button
          on:click={removeDuplicates}
          class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <i class="ri-delete-bin-7-line"></i>
          <span>Hapus Duplikat</span>
        </button>
      </div>
    </div>

    <!-- TEXT EDITOR -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
          Daftar Baris ({rawLines.split('\n').filter(Boolean).length} Baris)
        </span>
        <button on:click={copyText} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          <i class="ri-file-copy-line"></i>
          <span>Salin Teks</span>
        </button>
      </div>

      <textarea
        bind:value={rawLines}
        rows="12"
        placeholder="Paste baris teks di sini..."
        class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
      ></textarea>
    </div>
  </div>
</ToolLayout>
