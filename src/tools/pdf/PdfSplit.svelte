<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';
  import { getPdfLib } from '../../utils/loader.js';

  let selectedFile = null;
  let pageCount = 0;
  let pageRange = '1';
  let isProcessing = false;
  let splitPdfUrl = null;

  async function handleFileSelected(e) {
    selectedFile = e.detail;
    splitPdfUrl = null;
    try {
      const PDFLib = await getPdfLib();
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFLib.PDFDocument.load(buffer);
      pageCount = doc.getPageCount();
      pageRange = `1-${Math.min(pageCount, 3)}`;
      showToast(`PDF dimuat (${pageCount} halaman)`, 'info');
    } catch (err) {
      showToast('Gagal membaca PDF: ' + err.message, 'error');
    }
  }

  function parsePageRange(rangeStr, maxPages) {
    const pages = new Set();
    const parts = rangeStr.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(maxPages, end); p++) {
            pages.add(p - 1);
          }
        }
      } else {
        const p = parseInt(trimmed);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  async function splitPdf() {
    if (!selectedFile) return;
    const indices = parsePageRange(pageRange, pageCount);
    if (indices.length === 0) {
      showToast('Rentang halaman tidak valid', 'warning');
      return;
    }

    isProcessing = true;
    try {
      const PDFLib = await getPdfLib();
      const buffer = await selectedFile.arrayBuffer();
      const srcDoc = await PDFLib.PDFDocument.load(buffer);

      const newDoc = await PDFLib.PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(p => newDoc.addPage(p));

      const newBytes = await newDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      splitPdfUrl = URL.createObjectURL(blob);
      showToast(`Berhasil mengekstrak ${indices.length} halaman!`, 'success');
    } catch (err) {
      showToast('Error mengekstrak PDF: ' + err.message, 'error');
    } finally {
      isProcessing = false;
    }
  }

  function downloadSplit() {
    if (!splitPdfUrl) return;
    const a = document.createElement('a');
    a.href = splitPdfUrl;
    a.download = `extracted-${selectedFile.name}`;
    a.click();
    showToast('File PDF hasil ekstrak berhasil didownload', 'success');
  }
</script>

<ToolLayout slug="pdf-split">
  <div class="max-w-3xl mx-auto space-y-6">
    {#if !selectedFile}
      <Dropzone
        accept=".pdf,application/pdf"
        label="Tarik file PDF untuk dipisah atau diekstrak"
        sublabel="Mendukung dokumen PDF dengan jumlah halaman berapapun"
        fileIcon="ri-scissors-cut-line"
        on:fileSelected={handleFileSelected}
      />
    {:else}
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <div class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{selectedFile.name}</div>
            <div class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{pageCount} Total Halaman</div>
          </div>
          <button on:click={() => { selectedFile = null; splitPdfUrl = null; }} class="text-xs text-rose-500 font-semibold hover:underline">Ganti File</button>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Tentukan Halaman yang Ingin Diekstrak
          </label>
          <input
            type="text"
            bind:value={pageRange}
            placeholder="Contoh: 1-3, 5, 7-10"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <p class="text-[11px] text-slate-400 mt-1">
            Gunakan tanda koma (,) untuk memisahkan dan tanda hubung (-) untuk rentang halaman.
          </p>
        </div>

        {#if !splitPdfUrl}
          <button
            on:click={splitPdf}
            disabled={isProcessing}
            class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
          >
            {#if isProcessing}
              <i class="ri-loader-4-line animate-spin text-lg"></i>
              <span>Mengekstrak Halaman...</span>
            {:else}
              <i class="ri-scissors-cut-line text-lg"></i>
              <span>Ekstrak Halaman Terpilih</span>
            {/if}
          </button>
        {:else}
          <div class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-4">
            <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <i class="ri-checkbox-circle-fill text-xl"></i>
              <span>Halaman PDF Berhasil Diekstrak!</span>
            </div>

            <button
              on:click={downloadSplit}
              class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-[0.98]"
            >
              <i class="ri-download-2-line text-lg"></i>
              <span>Download PDF Halaman Terpilih</span>
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</ToolLayout>
