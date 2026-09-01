<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';

  let originalFile = null;
  let originalUrl = null;
  let originalSize = 0;
  let compressedUrl = null;
  let compressedBlob = null;
  let compressedSize = 0;
  let quality = 75;
  let isProcessing = false;

  function handleFileSelected(e) {
    originalFile = e.detail;
    originalSize = originalFile.size;
    originalUrl = URL.createObjectURL(originalFile);
    compressImage();
  }

  function compressImage() {
    if (!originalFile) return;
    isProcessing = true;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = originalFile.type === 'image/png' ? 'image/webp' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (blob) {
            compressedBlob = blob;
            compressedSize = blob.size;
            compressedUrl = URL.createObjectURL(blob);
          }
          isProcessing = false;
        },
        mimeType,
        quality / 100
      );
    };
    img.src = originalUrl;
  }

  function formatBytes(bytes, decimals = 1) {
    if (!bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  $: savings = originalSize && compressedSize ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;

  function downloadCompressed() {
    if (!compressedBlob) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const ext = originalFile.type === 'image/png' ? 'webp' : 'jpg';
    a.download = `compressed-${originalFile.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    a.click();
    showToast('Gambar terkompresi berhasil didownload!', 'success');
  }
</script>

<ToolLayout slug="image-compressor">
  <div class="space-y-8">
    {#if !originalFile}
      <Dropzone
        accept="image/*"
        label="Tarik & lepas gambar yang ingin dikompres"
        sublabel="Mendukung JPG, PNG, WEBP hingga 50 MB"
        fileIcon="ri-file-reduce-line"
        on:fileSelected={handleFileSelected}
      />
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- CONTROLS -->
        <div class="lg:col-span-5 space-y-6">
          <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm">
            
            <div class="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">File Terpilih</span>
              <button
                on:click={() => { originalFile = null; originalUrl = null; compressedUrl = null; }}
                class="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
              >
                <i class="ri-refresh-line"></i>
                <span>Ganti Gambar</span>
              </button>
            </div>

            <!-- QUALITY SLIDER -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Kualitas Kompresi</label>
                <span class="text-sm font-black text-indigo-600 dark:text-indigo-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                bind:value={quality}
                on:input={compressImage}
                class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Ukuran Terkecil</span>
                <span>Seimbang (Rekomendasi 75%)</span>
                <span>Kualitas Terbaik</span>
              </div>
            </div>

            <!-- STATS COMPARISON CARD -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Ukuran Asli:</span>
                <span class="font-bold text-slate-700 dark:text-slate-300">{formatBytes(originalSize)}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Setelah Kompres:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(compressedSize)}</span>
              </div>
              <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Penghematan Ukuran:</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                  -{savings}%
                </span>
              </div>
            </div>

            <!-- DOWNLOAD BUTTON -->
            <button
              on:click={downloadCompressed}
              disabled={isProcessing}
              class="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <i class="ri-download-2-line text-lg"></i>
              <span>Download Gambar ({formatBytes(compressedSize)})</span>
            </button>

          </div>
        </div>

        <!-- IMAGE PREVIEW -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col items-center">
            <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Pratinjau Hasil Kompresi</h4>
            <div class="relative max-h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              {#if compressedUrl}
                <img src={compressedUrl} alt="Compressed preview" class="max-h-[400px] w-auto object-contain rounded-xl" />
              {:else}
                <div class="p-12 text-slate-400 text-xs">Memproses kompresi...</div>
              {/if}
            </div>
          </div>
        </div>

      </div>
    {/if}
  </div>
</ToolLayout>
