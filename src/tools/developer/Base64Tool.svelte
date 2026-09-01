<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let mode = 'encode'; // 'encode' | 'decode'
  let inputType = 'text'; // 'text' | 'file'
  let rawText = '';
  let resultText = '';
  let fileName = '';

  function processText() {
    if (!rawText) {
      resultText = '';
      return;
    }
    try {
      if (mode === 'encode') {
        resultText = btoa(unescape(encodeURIComponent(rawText)));
      } else {
        resultText = decodeURIComponent(escape(atob(rawText)));
      }
    } catch (e) {
      resultText = 'Error: ' + e.message;
    }
  }

  $: if (rawText && inputType === 'text') {
    processText();
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    fileName = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
      resultText = event.target.result;
      showToast(`File ${fileName} berhasil di-encode ke Base64!`, 'success');
    };
    reader.readAsDataURL(file);
  }

  function copyResult() {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    showToast('Hasil Base64 berhasil disalin!', 'success');
  }
</script>

<ToolLayout slug="base64-tool">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- MODE TABS -->
      <div class="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
        <button
          on:click={() => { mode = 'encode'; processText(); }}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all {
            mode === 'encode' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }"
        >
          Encode (Teks → Base64)
        </button>
        <button
          on:click={() => { mode = 'decode'; processText(); }}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all {
            mode === 'decode' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }"
        >
          Decode (Base64 → Teks)
        </button>
      </div>

      <!-- INPUT TYPE -->
      <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Tipe Sumber:</span>
        <button
          on:click={() => inputType = 'text'}
          class="px-3 py-1 rounded-lg border {inputType === 'text' ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 'border-slate-200 dark:border-slate-700'}"
        >
          Teks
        </button>
        {#if mode === 'encode'}
          <button
            on:click={() => inputType = 'file'}
            class="px-3 py-1 rounded-lg border {inputType === 'file' ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 'border-slate-200 dark:border-slate-700'}"
          >
            Berkas File
          </button>
        {/if}
      </div>
    </div>

    {#if inputType === 'file' && mode === 'encode'}
      <div class="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-900/30">
        <input type="file" on:change={handleFileUpload} id="b64-file" class="hidden" />
        <label for="b64-file" class="cursor-pointer inline-flex flex-col items-center">
          <i class="ri-file-upload-line text-4xl text-indigo-500 mb-2"></i>
          <span class="text-sm font-bold text-slate-800 dark:text-slate-200">Pilih File untuk Di-encode</span>
          <span class="text-xs text-slate-400 mt-1">Gambar, dokumen, atau berkas apa pun</span>
        </label>
      </div>
    {:else}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          {mode === 'encode' ? 'Teks Asli' : 'Kode Base64'}
        </label>
        <textarea
          bind:value={rawText}
          rows="6"
          placeholder={mode === 'encode' ? 'Ketik atau paste teks yang ingin di-encode...' : 'Paste string Base64 yang ingin di-decode...'}
          class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
        ></textarea>
      </div>
    {/if}

    <!-- RESULT -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">
          Hasil {mode === 'encode' ? 'Base64' : 'Dekode'}
        </label>
        <button
          on:click={copyResult}
          disabled={!resultText}
          class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 disabled:opacity-40"
        >
          <i class="ri-file-copy-line"></i>
          <span>Salin Hasil</span>
        </button>
      </div>
      <textarea
        readonly
        value={resultText}
        rows="8"
        placeholder="Hasil konversi akan tampil di sini..."
        class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-indigo-950 dark:text-indigo-200 focus:outline-none"
      ></textarea>
    </div>
  </div>
</ToolLayout>
