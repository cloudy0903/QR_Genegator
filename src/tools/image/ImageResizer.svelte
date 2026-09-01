<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';

  let selectedFile = null;
  let filePreview = null;
  let naturalWidth = 0;
  let naturalHeight = 0;
  let targetWidth = 0;
  let targetHeight = 0;
  let lockAspectRatio = true;
  let aspectRatio = 1;
  let resizedUrl = null;

  function handleFileSelected(e) {
    selectedFile = e.detail;
    filePreview = URL.createObjectURL(selectedFile);
    resizedUrl = null;

    const img = new Image();
    img.onload = () => {
      naturalWidth = img.naturalWidth;
      naturalHeight = img.naturalHeight;
      targetWidth = naturalWidth;
      targetHeight = naturalHeight;
      aspectRatio = naturalWidth / naturalHeight;
    };
    img.src = filePreview;
  }

  function onWidthChange() {
    if (lockAspectRatio && aspectRatio) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    }
  }

  function onHeightChange() {
    if (lockAspectRatio && aspectRatio) {
      targetWidth = Math.round(targetHeight * aspectRatio);
    }
  }

  function applyPreset(w, h) {
    targetWidth = w;
    targetHeight = h;
    lockAspectRatio = false;
  }

  function resizeImage() {
    if (!selectedFile) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          resizedUrl = URL.createObjectURL(blob);
          showToast(`Gambar berhasil diubah ke ${targetWidth}x${targetHeight} px!`, 'success');
        }
      }, selectedFile.type || 'image/jpeg', 0.92);
    };
    img.src = filePreview;
  }

  function downloadResized() {
    if (!resizedUrl) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = `resized-${targetWidth}x${targetHeight}-${selectedFile.name}`;
    a.click();
    showToast('Gambar berhasil didownload', 'success');
  }
</script>

<ToolLayout slug="image-resizer">
  <div class="max-w-4xl mx-auto space-y-6">
    {#if !selectedFile}
      <Dropzone
        accept="image/*"
        label="Tarik gambar untuk diubah resolusinya (Resize)"
        sublabel="Mendukung JPG, PNG, WEBP"
        fileIcon="ri-aspect-ratio-line"
        on:fileSelected={handleFileSelected}
      />
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- CONTROLS -->
        <div class="lg:col-span-6 space-y-5 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <span class="text-xs font-bold text-slate-400 uppercase">Resolusi Asli: {naturalWidth} × {naturalHeight} px</span>
            <button on:click={() => { selectedFile = null; resizedUrl = null; }} class="text-xs text-rose-500 font-semibold hover:underline">Ganti Gambar</button>
          </div>

          <!-- DIMENSION INPUTS -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Lebar (Width px)</label>
              <input
                type="number"
                bind:value={targetWidth}
                on:input={onWidthChange}
                min="10"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Tinggi (Height px)</label>
              <input
                type="number"
                bind:value={targetHeight}
                on:input={onHeightChange}
                min="10"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" bind:checked={lockAspectRatio} class="w-4 h-4 rounded text-indigo-600" />
            <span>Kunci Rasio Aspek (Maintain Aspect Ratio)</span>
          </label>

          <!-- SOCIAL MEDIA PRESETS (PRD Section 19) -->
          <div class="pt-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Preset Populer</label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button on:click={() => applyPreset(1080, 1080)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left">
                <div class="font-bold text-slate-800 dark:text-slate-200">Instagram Square</div>
                <div class="text-[10px] text-slate-400">1080 × 1080 px</div>
              </button>
              <button on:click={() => applyPreset(1080, 1920)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left">
                <div class="font-bold text-slate-800 dark:text-slate-200">Story / TikTok</div>
                <div class="text-[10px] text-slate-400">1080 × 1920 px</div>
              </button>
              <button on:click={() => applyPreset(1280, 720)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left">
                <div class="font-bold text-slate-800 dark:text-slate-200">YouTube Thumbnail</div>
                <div class="text-[10px] text-slate-400">1280 × 720 px</div>
              </button>
              <button on:click={() => applyPreset(1920, 1080)} class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left">
                <div class="font-bold text-slate-800 dark:text-slate-200">Full HD (1080p)</div>
                <div class="text-[10px] text-slate-400">1920 × 1080 px</div>
              </button>
            </div>
          </div>

          <button
            on:click={resizeImage}
            class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
          >
            <i class="ri-check-line text-lg"></i>
            <span>Terapkan Resize</span>
          </button>
        </div>

        <!-- PREVIEW & DOWNLOAD -->
        <div class="lg:col-span-6 flex flex-col items-center">
          <div class="w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center">
            <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Pratinjau Gambar</h4>
            <div class="max-h-[300px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
              <img src={resizedUrl || filePreview} alt="Preview" class="max-h-[280px] w-auto object-contain rounded-lg" />
            </div>

            {#if resizedUrl}
              <button
                on:click={downloadResized}
                class="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-[0.98]"
              >
                <i class="ri-download-2-line text-lg"></i>
                <span>Download Gambar ({targetWidth} × {targetHeight} px)</span>
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</ToolLayout>
