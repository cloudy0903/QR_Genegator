<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let count = 5;
  let uppercase = false;
  let hyphens = true;
  let generatedUuids = [];

  function generateUuids() {
    const list = [];
    for (let i = 0; i < count; i++) {
      let id = crypto.randomUUID ? crypto.randomUUID() : generateFallbackUuid();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    generatedUuids = list;
    showToast(`${count} UUID berhasil dibuat!`, 'success');
  }

  function generateFallbackUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function copyAll() {
    navigator.clipboard.writeText(generatedUuids.join('\n'));
    showToast('Semua UUID berhasil disalin!', 'success');
  }

  function copySingle(id) {
    navigator.clipboard.writeText(id);
    showToast('UUID disalin!', 'success');
  }

  // Generate on start
  generateUuids();
</script>

<ToolLayout slug="uuid-generator">
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Jumlah UUID</label>
          <select
            bind:value={count}
            on:change={generateUuids}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold dark:text-white"
          >
            <option value={1}>1 UUID</option>
            <option value={5}>5 UUID</option>
            <option value={10}>10 UUID</option>
            <option value={25}>25 UUID</option>
            <option value={50}>50 UUID</option>
          </select>
        </div>

        <div class="flex items-center sm:pt-6">
          <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" bind:checked={uppercase} on:change={generateUuids} class="w-4 h-4 rounded text-indigo-600" />
            <span>Huruf Besar (UPPERCASE)</span>
          </label>
        </div>

        <div class="flex items-center sm:pt-6">
          <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" bind:checked={hyphens} on:change={generateUuids} class="w-4 h-4 rounded text-indigo-600" />
            <span>Sertakan Tanda Hubung (-)</span>
          </label>
        </div>
      </div>

      <button
        on:click={generateUuids}
        class="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
      >
        <i class="ri-refresh-line text-lg"></i>
        <span>Generate UUID Baru</span>
      </button>
    </div>

    <!-- LIST -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar UUID ({generatedUuids.length})</span>
        <button on:click={copyAll} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          <i class="ri-file-copy-line"></i>
          <span>Salin Semua</span>
        </button>
      </div>

      <div class="space-y-2">
        {#each generatedUuids as uuid}
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 group">
            <span class="select-all truncate">{uuid}</span>
            <button
              on:click={() => copySingle(uuid)}
              aria-label="Salin UUID"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <i class="ri-file-copy-line"></i>
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>
</ToolLayout>
