<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let offsetX = 0;
  let offsetY = 12;
  let blur = 24;
  let spread = -4;
  let color = '#4f46e5';
  let opacity = 25;
  let inset = false;

  function hexToRgba(hex, alphaPercent) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alphaPercent / 100})`;
  }

  $: shadowValue = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;
  $: cssOutput = `box-shadow: ${shadowValue};`;

  function copyCss() {
    navigator.clipboard.writeText(cssOutput);
    showToast('Kode box-shadow disalin ke clipboard!', 'success');
  }
</script>

<ToolLayout slug="box-shadow-generator">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-6 space-y-6">
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        
        <div>
          <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>Offset Horisontal (X)</span>
            <span>{offsetX}px</span>
          </div>
          <input type="range" min="-50" max="50" bind:value={offsetX} class="w-full accent-indigo-600" />
        </div>

        <div>
          <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>Offset Vertikal (Y)</span>
            <span>{offsetY}px</span>
          </div>
          <input type="range" min="-50" max="50" bind:value={offsetY} class="w-full accent-indigo-600" />
        </div>

        <div>
          <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>Blur Radius</span>
            <span>{blur}px</span>
          </div>
          <input type="range" min="0" max="100" bind:value={blur} class="w-full accent-indigo-600" />
        </div>

        <div>
          <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>Spread Radius</span>
            <span>{spread}px</span>
          </div>
          <input type="range" min="-50" max="50" bind:value={spread} class="w-full accent-indigo-600" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Warna Bayangan</label>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={color} class="w-10 h-10 rounded-xl cursor-pointer" />
              <input type="text" bind:value={color} class="w-full px-2 py-1.5 text-xs font-mono border rounded-xl dark:bg-slate-800 dark:text-white" />
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Opasitas</span>
              <span>{opacity}%</span>
            </div>
            <input type="range" min="0" max="100" bind:value={opacity} class="w-full accent-indigo-600 mt-2" />
          </div>
        </div>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
          <input type="checkbox" bind:checked={inset} class="w-4 h-4 rounded text-indigo-600" />
          <span>Inset Shadow (Bayangan ke dalam)</span>
        </label>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Kode CSS</span>
            <button on:click={copyCss} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              <i class="ri-file-copy-line"></i>
              <span>Salin CSS</span>
            </button>
          </div>
          <pre class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all border border-slate-200 dark:border-slate-800">{cssOutput}</pre>
        </div>

      </div>
    </div>

    <!-- PREVIEW -->
    <div class="lg:col-span-6 flex flex-col items-center justify-center p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 min-h-[360px]">
      <div
        class="w-48 h-48 rounded-3xl bg-white dark:bg-slate-800 transition-all duration-200 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-wider"
        style={cssOutput}
      >
        Box Target
      </div>
    </div>
  </div>
</ToolLayout>
