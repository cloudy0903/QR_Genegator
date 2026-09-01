<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  // Mode 1: What is X% of Y?
  let m1_x = 20;
  let m1_y = 150;
  $: m1_result = (m1_x / 100) * m1_y;

  // Mode 2: X is what percent of Y?
  let m2_x = 30;
  let m2_y = 200;
  $: m2_result = m2_y !== 0 ? (m2_x / m2_y) * 100 : 0;

  // Mode 3: Percentage change from X to Y
  let m3_x = 100;
  let m3_y = 125;
  $: m3_diff = m3_y - m3_x;
  $: m3_pct = m3_x !== 0 ? ((m3_y - m3_x) / Math.abs(m3_x)) * 100 : 0;
</script>

<ToolLayout slug="percentage-calculator">
  <div class="max-w-3xl mx-auto space-y-6">
    
    <!-- CARD 1: X% OF Y -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
        <span>Berapa X% dari Y?</span>
      </h3>

      <div class="flex flex-wrap items-center gap-3 text-sm">
        <span class="text-slate-500 font-medium">Berapakah</span>
        <div class="relative w-28">
          <input type="number" bind:value={m1_x} class="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white" />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
        </div>
        <span class="text-slate-500 font-medium">dari</span>
        <input type="number" bind:value={m1_y} class="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white" />
        <span class="text-slate-500 font-medium">=</span>
        <span class="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-black text-lg">
          {Number(m1_result.toFixed(2))}
        </span>
      </div>
    </div>

    <!-- CARD 2: X IS WHAT % OF Y -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
        <span>X itu berapa persen dari Y?</span>
      </h3>

      <div class="flex flex-wrap items-center gap-3 text-sm">
        <input type="number" bind:value={m2_x} class="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white" />
        <span class="text-slate-500 font-medium">itu berapa persen dari</span>
        <input type="number" bind:value={m2_y} class="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white" />
        <span class="text-slate-500 font-medium">=</span>
        <span class="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 font-black text-lg">
          {Number(m2_result.toFixed(2))}%
        </span>
      </div>
    </div>

    <!-- CARD 3: PERCENTAGE INCREASE / DECREASE -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">3</span>
        <span>Kenaikan / Penurunan Persentase</span>
      </h3>

      <div class="flex flex-wrap items-center gap-3 text-sm">
        <span class="text-slate-500 font-medium">Dari</span>
        <input type="number" bind:value={m3_x} class="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white" />
        <span class="text-slate-500 font-medium">menjadi</span>
        <input type="number" bind:value={m3_y} class="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold dark:text-white" />
        <span class="text-slate-500 font-medium">=</span>
        <span class="px-4 py-2 rounded-xl font-black text-lg {
          m3_pct >= 0
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300'
        }">
          {m3_pct >= 0 ? '+' : ''}{Number(m3_pct.toFixed(2))}%
        </span>
      </div>
      <div class="text-xs text-slate-400">
        Selisih nilai: {m3_diff >= 0 ? '+' : ''}{m3_diff}
      </div>
    </div>

  </div>
</ToolLayout>
