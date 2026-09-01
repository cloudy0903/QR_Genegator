<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let length = 32;
  let format = 'alphanumeric'; // alphanumeric, hex, base64, custom
  let customCharset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  function generateString() {
    let chars = '';
    if (format === 'alphanumeric') {
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    } else if (format === 'hex') {
      chars = '0123456789abcdef';
    } else if (format === 'base64') {
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    } else {
      chars = customCharset || 'abc';
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    result = res;
  }

  function copyString() {
    navigator.clipboard.writeText(result);
    showToast('String acak berhasil disalin!', 'success');
  }

  generateString();
</script>

<ToolLayout slug="random-string-generator">
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tipe Karakter</label>
          <select
            bind:value={format}
            on:change={generateString}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold dark:text-white"
          >
            <option value="alphanumeric">Alfanumerik (A-Z, a-z, 0-9)</option>
            <option value="hex">Heksadesimal (0-9, a-f)</option>
            <option value="base64">Base64 (A-Z, a-z, 0-9, +, /)</option>
            <option value="custom">Karakter Kustom</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Panjang String</label>
          <input
            type="number"
            min="4"
            max="256"
            bind:value={length}
            on:input={generateString}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold dark:text-white"
          />
        </div>
      </div>

      {#if format === 'custom'}
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Karakter yang Diizinkan</label>
          <input
            type="text"
            bind:value={customCharset}
            on:input={generateString}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono dark:text-white"
          />
        </div>
      {/if}

      <button
        on:click={generateString}
        class="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
      >
        <i class="ri-refresh-line text-lg"></i>
        <span>Generate String Baru</span>
      </button>
    </div>

    <!-- RESULT -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Hasil String Acak ({length} Karakter)</span>
        <button on:click={copyString} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          <i class="ri-file-copy-line"></i>
          <span>Salin</span>
        </button>
      </div>
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all border border-slate-200 dark:border-slate-800">
        {result}
      </div>
    </div>
  </div>
</ToolLayout>
