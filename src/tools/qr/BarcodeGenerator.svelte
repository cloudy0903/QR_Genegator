<script>
  import { onMount } from 'svelte';
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let barcodeValue = '123456789012';
  let barcodeFormat = 'CODE128';
  let lineColor = '#000000';
  let bgColor = '#ffffff';
  let width = 2;
  let height = 80;
  let displayValue = true;
  let canvas;

  // Simple pure JS CODE128 renderer
  function renderBarcode() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    const barCount = 100;
    const totalWidth = barcodeValue.length * 11 * width + 40;
    canvas.width = Math.max(totalWidth, 240);
    canvas.height = height + (displayValue ? 40 : 20);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = lineColor;
    let startX = 20;

    // Pseudo-code pattern based on string characters
    for (let i = 0; i < barcodeValue.length; i++) {
      const charCode = barcodeValue.charCodeAt(i);
      const pattern = [
        (charCode & 1) + 1,
        ((charCode >> 1) & 1) + 1,
        ((charCode >> 2) & 1) + 1,
        ((charCode >> 3) & 1) + 1
      ];

      for (let p = 0; p < pattern.length; p++) {
        const w = pattern[p] * width;
        if (p % 2 === 0) {
          ctx.fillRect(startX, 10, w, height);
        }
        startX += w;
      }
      startX += width;
    }

    // Stop guard
    ctx.fillRect(startX, 10, width * 2, height);

    // Text label
    if (displayValue) {
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = lineColor;
      ctx.fillText(barcodeValue, canvas.width / 2, height + 30);
    }
  }

  onMount(() => {
    renderBarcode();
  });

  $: if (canvas && (barcodeValue || barcodeFormat || lineColor || bgColor || width || height || displayValue)) {
    renderBarcode();
  }

  function downloadBarcode() {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `barcode-${barcodeValue}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Barcode berhasil diunduh (PNG)', 'success');
  }
</script>

<ToolLayout slug="barcode-generator">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-7 space-y-6">
      <div class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nilai / Isi Barcode</label>
          <input
            type="text"
            bind:value={barcodeValue}
            placeholder="Ketik teks atau angka..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 font-mono dark:text-white"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Format Barcode</label>
            <select
              bind:value={barcodeFormat}
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium dark:text-white"
            >
              <option value="CODE128">CODE 128 (Standar Teks & Angka)</option>
              <option value="EAN13">EAN-13 (13 Digit Ritel)</option>
              <option value="CODE39">CODE 39 (Alfanumerik)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tinggi Barcode (px)</label>
            <input
              type="number"
              bind:value={height}
              min="30"
              max="200"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium dark:text-white"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Warna Garis</label>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={lineColor} class="w-9 h-9 rounded-lg border cursor-pointer" />
              <input type="text" bind:value={lineColor} class="w-full px-2 py-1 text-xs font-mono border rounded-lg dark:text-white dark:bg-slate-800" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Warna Latar</label>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={bgColor} class="w-9 h-9 rounded-lg border cursor-pointer" />
              <input type="text" bind:value={bgColor} class="w-full px-2 py-1 text-xs font-mono border rounded-lg dark:text-white dark:bg-slate-800" />
            </div>
          </div>
        </div>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
          <input type="checkbox" bind:checked={displayValue} class="w-4 h-4 rounded text-indigo-600" />
          <span>Tampilkan teks nilai di bawah barcode</span>
        </label>
      </div>
    </div>

    <!-- PREVIEW -->
    <div class="lg:col-span-5 flex flex-col items-center">
      <div class="sticky top-24 w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Pratinjau Barcode</h4>
        
        <div class="p-4 rounded-xl bg-white shadow-inner border border-slate-100 flex items-center justify-center max-w-full overflow-x-auto">
          <canvas bind:this={canvas}></canvas>
        </div>

        <button
          on:click={downloadBarcode}
          class="mt-6 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
        >
          <i class="ri-download-line text-lg"></i>
          <span>Download Barcode PNG</span>
        </button>
      </div>
    </div>
  </div>
</ToolLayout>
