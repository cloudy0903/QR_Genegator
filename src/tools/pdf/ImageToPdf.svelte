<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';
  import { getJsPdf } from '../../utils/loader.js';

  let imageFiles = []; // array of { file, previewUrl, id }
  let pageSize = 'a4'; // 'a4' | 'fit'
  let orientation = 'p'; // 'p' | 'l'
  let margin = 10; // mm
  let isGenerating = false;
  let pdfBlobUrl = null;

  function handleFilesSelected(e) {
    const files = e.detail;
    if (!files || files.length === 0) return;

    for (const f of files) {
      imageFiles = [
        ...imageFiles,
        {
          id: Math.random().toString(36).substring(2),
          file: f,
          previewUrl: URL.createObjectURL(f)
        }
      ];
    }
    pdfBlobUrl = null;
    showToast(`${files.length} gambar ditambahkan`, 'info');
  }

  function removeImage(id) {
    imageFiles = imageFiles.filter(img => img.id !== id);
    pdfBlobUrl = null;
  }

  function moveUp(index) {
    if (index === 0) return;
    const temp = [...imageFiles];
    const item = temp.splice(index, 1)[0];
    temp.splice(index - 1, 0, item);
    imageFiles = temp;
    pdfBlobUrl = null;
  }

  function moveDown(index) {
    if (index === imageFiles.length - 1) return;
    const temp = [...imageFiles];
    const item = temp.splice(index, 1)[0];
    temp.splice(index + 1, 0, item);
    imageFiles = temp;
    pdfBlobUrl = null;
  }

  async function generatePdf() {
    if (imageFiles.length === 0) return;
    isGenerating = true;
    try {
      const jsPDF = await getJsPdf();
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
      });

      for (let i = 0; i < imageFiles.length; i++) {
        if (i > 0) {
          doc.addPage(pageSize, orientation);
        }

        const imgData = await fileToDataUrl(imageFiles[i].file);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const printableW = pageWidth - margin * 2;
        const printableH = pageHeight - margin * 2;

        const dimensions = await getImageDimensions(imgData);
        const imgRatio = dimensions.width / dimensions.height;

        let renderW = printableW;
        let renderH = printableW / imgRatio;

        if (renderH > printableH) {
          renderH = printableH;
          renderW = printableH * imgRatio;
        }

        const posX = margin + (printableW - renderW) / 2;
        const posY = margin + (printableH - renderH) / 2;

        doc.addImage(imgData, 'JPEG', posX, posY, renderW, renderH);
      }

      const pdfBlob = doc.output('blob');
      pdfBlobUrl = URL.createObjectURL(pdfBlob);
      showToast('Dokumen PDF berhasil dibuat!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat PDF: ' + err.message, 'error');
    } finally {
      isGenerating = false;
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function getImageDimensions(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = dataUrl;
    });
  }

  function downloadPdf() {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = `quicktools-doc-${Date.now()}.pdf`;
    a.click();
    showToast('File PDF berhasil didownload', 'success');
  }
</script>

<ToolLayout slug="image-to-pdf">
  <div class="space-y-8">
    <Dropzone
      accept="image/*"
      multiple={true}
      label="Tarik & lepas foto JPG, PNG, atau WEBP ke sini"
      sublabel="Bisa pilih banyak gambar sekaligus untuk digabung ke dalam 1 dokumen PDF"
      fileIcon="ri-file-image-line"
      on:filesSelected={handleFilesSelected}
    />

    {#if imageFiles.length > 0}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- SETTINGS & CONTROLS -->
        <div class="lg:col-span-4 space-y-6">
          <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total: {imageFiles.length} Gambar</span>
              <button on:click={() => { imageFiles = []; pdfBlobUrl = null; }} class="text-xs font-semibold text-rose-500 hover:underline">Hapus Semua</button>
            </div>

            <!-- ORIENTATION -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Orientasi Halaman</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  on:click={() => { orientation = 'p'; pdfBlobUrl = null; }}
                  class="py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 {
                    orientation === 'p' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-800'
                  }"
                >
                  <i class="ri-file-line"></i>
                  <span>Potret (Portrait)</span>
                </button>
                <button
                  on:click={() => { orientation = 'l'; pdfBlobUrl = null; }}
                  class="py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 {
                    orientation === 'l' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-800'
                  }"
                >
                  <i class="ri-file-line rotate-90"></i>
                  <span>Lansekap</span>
                </button>
              </div>
            </div>

            <!-- MARGIN -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Margin Halaman (mm)</label>
              <input
                type="number"
                bind:value={margin}
                on:input={() => pdfBlobUrl = null}
                min="0"
                max="30"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold dark:text-white"
              />
            </div>

            <!-- ACTION BUTTON -->
            {#if !pdfBlobUrl}
              <button
                on:click={generatePdf}
                disabled={isGenerating}
                class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {#if isGenerating}
                  <i class="ri-loader-4-line animate-spin text-lg"></i>
                  <span>Membuat Dokumen PDF...</span>
                {:else}
                  <i class="ri-file-pdf-line text-lg"></i>
                  <span>Konversi ke Dokumen PDF</span>
                {/if}
              </button>
            {:else}
              <button
                on:click={downloadPdf}
                class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
              >
                <i class="ri-download-line text-lg"></i>
                <span>Download PDF Siap Pakai</span>
              </button>
            {/if}
          </div>
        </div>

        <!-- IMAGE LIST WITH REORDER -->
        <div class="lg:col-span-8 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400">
            Susunan Halaman Gambar ({imageFiles.length})
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each imageFiles as img, index (img.id)}
              <div class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 group">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                <img src={img.previewUrl} alt="Page {index + 1}" class="w-12 h-12 object-cover rounded-lg border border-slate-100 dark:border-slate-800 shrink-0" />

                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{img.file.name}</div>
                  <div class="text-[10px] text-slate-400">{(img.file.size / 1024).toFixed(0)} KB</div>
                </div>

                <!-- CONTROLS -->
                <div class="flex items-center gap-1">
                  <button
                    on:click={() => moveUp(index)}
                    disabled={index === 0}
                    aria-label="Geser ke atas"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <i class="ri-arrow-up-s-line"></i>
                  </button>
                  <button
                    on:click={() => moveDown(index)}
                    disabled={index === imageFiles.length - 1}
                    aria-label="Geser ke bawah"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                  >
                    <i class="ri-arrow-down-s-line"></i>
                  </button>
                  <button
                    on:click={() => removeImage(img.id)}
                    aria-label="Hapus gambar"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</ToolLayout>
