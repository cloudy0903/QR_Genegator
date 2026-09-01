<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let hexColor = '#4f46e5';

  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  $: rgb = hexToRgb(hexColor);
  $: hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  $: rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  $: hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  function copyValue(val) {
    navigator.clipboard.writeText(val);
    showToast(`"${val}" disalin ke clipboard!`, 'success');
  }
</script>

<ToolLayout slug="color-picker">
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      
      <!-- MAIN PICKER AND PREVIEW -->
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <div
          class="w-32 h-32 rounded-3xl shadow-xl border-4 border-white dark:border-slate-800 shrink-0 transition-colors duration-300"
          style="background-color: {hexColor};"
        ></div>

        <div class="flex-1 w-full space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Warna</label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              bind:value={hexColor}
              class="w-12 h-12 rounded-2xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <input
              type="text"
              bind:value={hexColor}
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- FORMAT CONVERSIONS -->
      <div class="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400">Kode Nilai Warna</h4>

        {#each [
          { label: 'HEX', val: hexColor.toUpperCase() },
          { label: 'RGB', val: rgbString },
          { label: 'HSL', val: hslString }
        ] as fmt}
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <span class="w-12 text-xs font-black text-indigo-600 dark:text-indigo-400">{fmt.label}</span>
              <span class="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{fmt.val}</span>
            </div>
            <button
              on:click={() => copyValue(fmt.val)}
              class="px-3 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-sm"
            >
              Salin
            </button>
          </div>
        {/each}
      </div>

    </div>
  </div>
</ToolLayout>
