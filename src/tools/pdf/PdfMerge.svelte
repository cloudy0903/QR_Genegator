<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';
  import { getPdfLib } from '../../utils/loader.js';

  let pdfFiles = []; // array of { file, name, size, id }
  let isMerging = false;
  let mergedPdfUrl = null;

  function handleFilesSelected(e) {
    const files = e.detail;
    if (!files || files.length === 0) return;

    for (const f of files) {
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        pdfFiles = [
          ...pdfFiles,
          {
            id: Math.random().toString(36).substring(2),
            file: f,
            name: f.name,
            size: f.size
          }
        ];
      }
    }
    mergedPdfUrl = null;
    showToast(`${files.length} file PDF ditambahkan`, 'info');
  }

  function removeFile(id) {
    pdfFiles = pdfFiles.filter(item => item.id !== id);
    mergedPdfUrl = null;
  }

  function moveUp(index) {
    if (index === 0) return;
    const temp = [...pdfFiles];
    const item = temp.splice(index, 1)[0];
    temp.splice(index - 1, 0, item);
    pdfFiles = temp;
    mergedPdfUrl = null;
  }

  function moveDown(index) {
    if (index === pdfFiles.length - 1) return;
    const temp = [...pdfFiles];
    const item = temp.splice(index, 1)[0];
    temp.splice(index + 1, 0, item);
    pdfFiles = temp;
    mergedPdfUrl = null;
  }

  async function mergePdfs() {
    if (pdfFiles.length < 2) {
      showToast('Pilih minimal 2 file PDF untuk digabungkan', 'warning');
      return;
    }

    isMerging = true;
    try {
      const PDFLib = await getPdfLib();
      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const item of pdfFiles) {
        const fileBuffer = await item.file.arrayBuffer();
        const donorPdf = await PDFLib.PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      mergedPdfUrl = URL.createObjectURL(blob);
      showToast('Semua PDF berhasil digabungkan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menggabungkan PDF: ' + err.message, 'error');
    } finally {
      isMerging = false;
    }
  }

  function downloadMerged() {
    if (!mergedPdfUrl) return;
    const a = document.createElement('a');
    a.href = mergedPdfUrl;
    a.download = `merged-quicktools-${Date.now()}.pdf`;
    a.click();
    showToast('File PDF hasil gabungan berhasil didownload', 'success');
  }
</script>

<ToolLayout slug="pdf-merge">
  <div class="space-y-8">
    <Dropzone
      accept=".pdf,application/pdf"
      multiple={true}
      label="Tarik & lepas berkas PDF ke sini"
      sublabel="Pilih 2 atau lebih file PDF untuk digabungkan menjadi satu dokumen"
      fileIcon="ri-file-copy-2-line"
      on:filesSelected={handleFilesSelected}
    />

    {#if pdfFiles.length > 0}
      <div class="max-w-3xl mx-auto space-y-6">
        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar PDF ({pdfFiles.length})</span>
            <button on:click={() => { pdfFiles = []; mergedPdfUrl = null; }} class="text-xs text-rose-500 font-semibold hover:underline">Hapus Semua</button>
          </div>

          <div class="space-y-2">
            {#each pdfFiles as pdf, index (pdf.id)}
              <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center text-lg shrink-0">
                  <i class="ri-file-pdf-line"></i>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{pdf.name}</div>
                  <div class="text-[11px] text-slate-400">{(pdf.size / 1024).toFixed(1)} KB</div>
                </div>

                <div class="flex items-center gap-1">
                  <button
                    on:click={() => moveUp(index)}
                    disabled={index === 0}
                    aria-label="Pindahkan ke atas"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                  >
                    <i class="ri-arrow-up-s-line"></i>
                  </button>
                  <button
                    on:click={() => moveDown(index)}
                    disabled={index === pdfFiles.length - 1}
                    aria-label="Pindahkan ke bawah"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                  >
                    <i class="ri-arrow-down-s-line"></i>
                  </button>
                  <button
                    on:click={() => removeFile(pdf.id)}
                    aria-label="Hapus file"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            {/each}
          </div>

          {#if !mergedPdfUrl}
            <button
              on:click={mergePdfs}
              disabled={isMerging || pdfFiles.length < 2}
              class="w-full mt-4 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {#if isMerging}
                <i class="ri-loader-4-line animate-spin text-lg"></i>
                <span>Menggabungkan Dokumen PDF...</span>
              {:else}
                <i class="ri-file-copy-2-line text-lg"></i>
                <span>Gabungkan {pdfFiles.length} PDF Sekarang</span>
              {/if}
            </button>
          {:else}
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <i class="ri-checkbox-circle-fill text-xl"></i>
                <span>Penggabungan PDF Selesai!</span>
              </div>
              <button
                on:click={downloadMerged}
                class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
              >
                <i class="ri-download-2-line text-lg"></i>
                <span>Download PDF Gabungan</span>
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</ToolLayout>
