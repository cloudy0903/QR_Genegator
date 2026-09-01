<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let type = 'linear'; // 'linear' | 'radial'
  let angle = 135;
  let color1 = '#4f46e5';
  let color2 = '#ec4899';
  let stop1 = 0;
  let stop2 = 100;

  $: cssGradient = type === 'linear'
    ? `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`
    : `radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%)`;

  $: fullCss = `background: ${cssGradient};`;

  function copyCss() {
    navigator.clipboard.writeText(fullCss);
    showToast('Kode CSS berhasil disalin!', 'success');
  }
</script>

<ToolLayout slug="gradient-generator">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- CONTROLS -->
    <div class="lg:col-span-6 space-y-6">
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        
        <!-- TYPE -->
        <div class="grid grid-cols-2 gap-2">
          <button
            on:click={() => type = 'linear'}
            class="py-2.5 rounded-xl border text-xs font-semibold {type === 'linear' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-800'}"
          >
            Linear Gradient
          </button>
          <button
            on:click={() => type = 'radial'}
            class="py-2.5 rounded-xl border text-xs font-semibold {type === 'radial' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-800'}"
          >
            Radial Gradient
          </button>
        </div>

        {#if type === 'linear'}
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Sudut Putaran (Angle)</label>
              <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{angle}°</span>
            </div>
            <input type="range" min="0" max="360" bind:value={angle} class="w-full accent-indigo-600" />
          </div>
        {/if}

        <!-- COLORS -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Warna Awal</label>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={color1} class="w-10 h-10 rounded-xl cursor-pointer" />
              <input type="text" bind:value={color1} class="w-full px-2 py-1.5 text-xs font-mono border rounded-xl dark:bg-slate-800 dark:text-white" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Warna Akhir</label>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={color2} class="w-10 h-10 rounded-xl cursor-pointer" />
              <input type="text" bind:value={color2} class="w-full px-2 py-1.5 text-xs font-mono border rounded-xl dark:bg-slate-800 dark:text-white" />
            </div>
          </div>
        </div>

        <!-- CSS OUTPUT -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Kode CSS</span>
            <button on:click={copyCss} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              <i class="ri-file-copy-line"></i>
              <span>Salin CSS</span>
            </button>
          </div>
          <pre class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all border border-slate-200 dark:border-slate-800">{fullCss}</pre>
        </div>

      </div>
    </div>

    <!-- PREVIEW -->
    <div class="lg:col-span-6 flex flex-col items-center">
      <div class="w-full h-80 sm:h-96 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 transition-all duration-300" style={fullCss}></div>
    </div>
  </div>
</ToolLayout>
