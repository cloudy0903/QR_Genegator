<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';

  let selectedFile = null;
  let filePreview = null;
  let rotation = 0; // 0, 90, 180, 270
  let flipH = false;
  let flipV = false;
  let processedUrl = null;

  function handleFileSelected(e) {
    selectedFile = e.detail;
    filePreview = URL.createObjectURL(selectedFile);
    rotation = 0;
    flipH = false;
    flipV = false;
    updateProcessing();
  }

  function rotateRight() {
    rotation = (rotation + 90) % 360;
    updateProcessing();
  }

  function rotateLeft() {
    rotation = (rotation + 270) % 360;
    updateProcessing();
  }

  function toggleFlipH() {
    flipH = !flipH;
    updateProcessing();
  }

  function toggleFlipV() {
    flipV = !flipV;
    updateProcessing();
  }

  function updateProcessing() {
    if (!selectedFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const isRotatedSideways = rotation === 90 || rotation === 270;
      canvas.width = isRotatedSideways ? img.naturalHeight : img.naturalWidth;
      canvas.height = isRotatedSideways ? img.naturalWidth : img.naturalHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          processedUrl = URL.createObjectURL(blob);
        }
      }, selectedFile.type || 'image/png');
    };
    img.src = filePreview;
  }

  function downloadImage() {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `rotated-${selectedFile.name}`;
    a.click();
    showToast('Gambar berhasil didownload', 'success');
  }
</script>

<ToolLayout slug="image-crop-rotate">
  <div class="max-w-4xl mx-auto space-y-6">
    {#if !selectedFile}
      <Dropzone
        accept="image/*"
        label="Tarik gambar untuk diputar atau dibalik (Rotate & Flip)"
        sublabel="Mendukung JPG, PNG, WEBP"
        fileIcon="ri-anticlockwise-2-line"
        on:fileSelected={handleFileSelected}
      />
    {:else}
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <span class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{selectedFile.name}</span>
          <button on:click={() => { selectedFile = null; processedUrl = null; }} class="text-xs text-rose-500 font-semibold hover:underline">Ganti Gambar</button>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            on:click={rotateLeft}
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            <i class="ri-anticlockwise-line text-lg text-indigo-500"></i>
            <span>Putar Kiri 90°</span>
          </button>

          <button
            on:click={rotateRight}
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            <i class="ri-clockwise-line text-lg text-indigo-500"></i>
            <span>Putar Kanan 90°</span>
          </button>

          <button
            on:click={toggleFlipH}
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors {
              flipH ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }"
          >
            <i class="ri-reflect-line text-lg"></i>
            <span>Balik Horizontal</span>
          </button>

          <button
            on:click={toggleFlipV}
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors {
              flipV ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }"
          >
            <i class="ri-split-cells-vertical text-lg"></i>
            <span>Balik Vertikal</span>
          </button>
        </div>

        <!-- LIVE PREVIEW -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[300px]">
          {#if processedUrl}
            <img src={processedUrl} alt="Preview" class="max-h-80 w-auto object-contain rounded-lg shadow-md" />
          {/if}
        </div>

        <button
          on:click={downloadImage}
          class="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
        >
          <i class="ri-download-2-line text-lg"></i>
          <span>Download Gambar Hasil ({rotation}°)</span>
        </button>

      </div>
    {/if}
  </div>
</ToolLayout>
