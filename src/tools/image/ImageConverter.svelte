<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';

  let selectedFile = null;
  let filePreview = null;
  let targetFormat = 'png'; // 'png' | 'jpeg' | 'webp'
  let convertedUrl = null;
  let isConverting = false;

  function handleFileSelected(e) {
    selectedFile = e.detail;
    filePreview = URL.createObjectURL(selectedFile);
    convertedUrl = null;
  }

  function convertImage() {
    if (!selectedFile) return;
    isConverting = true;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      // If converting to JPEG, paint white background to prevent black background on transparent PNGs
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      canvas.toBlob((blob) => {
        if (blob) {
          convertedUrl = URL.createObjectURL(blob);
          showToast(`Berhasil dikonversi ke format ${targetFormat.toUpperCase()}!`, 'success');
        }
        isConverting = false;
      }, mimeType, 0.92);
    };
    img.src = filePreview;
  }

  function downloadResult() {
    if (!convertedUrl) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, "");
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    a.download = `${originalName}.${ext}`;
    a.click();
    showToast('Gambar berhasil didownload', 'success');
  }
</script>

<ToolLayout slug="image-converter">
  <div class="max-w-3xl mx-auto space-y-6">
    {#if !selectedFile}
      <Dropzone
        accept="image/*"
        label="Tarik file gambar untuk dikonversi"
        sublabel="Mendukung JPG, PNG, WEBP, SVG, BMP"
        fileIcon="ri-exchange-line"
        on:fileSelected={handleFileSelected}
      />
    {:else}
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <div class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{selectedFile.name}</div>
            <div class="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
          </div>
          <button
            on:click={() => { selectedFile = null; filePreview = null; convertedUrl = null; }}
            class="text-xs text-rose-500 hover:underline font-semibold"
          >
            Ganti File
          </button>
        </div>

        <!-- FORMAT SELECTOR -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pilih Format Target</label>
          <div class="grid grid-cols-3 gap-3">
            {#each [
              { id: 'png', name: 'PNG', desc: 'Mendukung transparansi' },
              { id: 'jpeg', name: 'JPG / JPEG', desc: 'Ukuran file ringkas' },
              { id: 'webp', name: 'WEBP', desc: 'Format web modern hemat data' }
            ] as fmt}
              <button
                on:click={() => { targetFormat = fmt.id; convertedUrl = null; }}
                class="p-4 rounded-2xl border text-left transition-all {
                  targetFormat === fmt.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }"
              >
                <div class="font-bold text-sm text-slate-900 dark:text-white">{fmt.name}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">{fmt.desc}</div>
              </button>
            {/each}
          </div>
        </div>

        <!-- ACTION BUTTON -->
        {#if !convertedUrl}
          <button
            on:click={convertImage}
            disabled={isConverting}
            class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
          >
            <i class="ri-refresh-line text-lg"></i>
            <span>Konversi Sekarang ke {targetFormat.toUpperCase()}</span>
          </button>
        {:else}
          <!-- RESULT -->
          <div class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-4">
            <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <i class="ri-checkbox-circle-fill text-xl"></i>
              <span>Konversi Berhasil!</span>
            </div>

            <button
              on:click={downloadResult}
              class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-[0.98]"
            >
              <i class="ri-download-line text-lg"></i>
              <span>Download File ({targetFormat.toUpperCase()})</span>
            </button>
          </div>
        {/if}

      </div>
    {/if}
  </div>
</ToolLayout>
