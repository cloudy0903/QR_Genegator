<script>
  import ToolLayout from '../../components/ToolLayout.svelte';

  let currentCategory = 'length';
  let inputValue = 1;
  let unitFrom = 'm';
  let unitTo = 'km';

  const UNITS = {
    length: {
      name: 'Panjang (Length)',
      units: {
        mm: { name: 'Milimeter (mm)', rate: 0.001 },
        cm: { name: 'Centimeter (cm)', rate: 0.01 },
        m: { name: 'Meter (m)', rate: 1 },
        km: { name: 'Kilometer (km)', rate: 1000 },
        inch: { name: 'Inci (inch)', rate: 0.0254 },
        ft: { name: 'Kaki (feet)', rate: 0.3048 },
        yard: { name: 'Yard (yd)', rate: 0.9144 },
        mile: { name: 'Mil (mile)', rate: 1609.344 }
      }
    },
    weight: {
      name: 'Berat (Weight)',
      units: {
        mg: { name: 'Miligram (mg)', rate: 0.000001 },
        g: { name: 'Gram (g)', rate: 0.001 },
        kg: { name: 'Kilogram (kg)', rate: 1 },
        ton: { name: 'Ton (t)', rate: 1000 },
        oz: { name: 'Ons (ounce)', rate: 0.0283495 },
        lb: { name: 'Pound (lbs)', rate: 0.453592 }
      }
    },
    data: {
      name: 'Data Digital (Data Storage)',
      units: {
        B: { name: 'Bytes (B)', rate: 1 },
        KB: { name: 'Kilobytes (KB)', rate: 1024 },
        MB: { name: 'Megabytes (MB)', rate: 1024 * 1024 },
        GB: { name: 'Gigabytes (GB)', rate: 1024 * 1024 * 1024 },
        TB: { name: 'Terabytes (TB)', rate: 1024 * 1024 * 1024 * 1024 }
      }
    },
    temp: {
      name: 'Suhu (Temperature)',
      units: {
        C: { name: 'Celcius (°C)' },
        F: { name: 'Fahrenheit (°F)' },
        K: { name: 'Kelvin (K)' }
      }
    }
  };

  function onCategoryChange() {
    const keys = Object.keys(UNITS[currentCategory].units);
    unitFrom = keys[0];
    unitTo = keys[1] || keys[0];
  }

  function swapUnits() {
    const temp = unitFrom;
    unitFrom = unitTo;
    unitTo = temp;
  }

  function convert(val, from, to, cat) {
    if (isNaN(val)) return 0;
    if (from === to) return val;

    if (cat === 'temp') {
      let celsius = val;
      if (from === 'F') celsius = (val - 32) * (5 / 9);
      if (from === 'K') celsius = val - 273.15;

      if (to === 'C') return celsius;
      if (to === 'F') return celsius * (9 / 5) + 32;
      if (to === 'K') return celsius + 273.15;
    }

    const fromRate = UNITS[cat].units[from].rate;
    const toRate = UNITS[cat].units[to].rate;
    return (val * fromRate) / toRate;
  }

  $: result = convert(inputValue, unitFrom, unitTo, currentCategory);
</script>

<ToolLayout slug="unit-converter">
  <div class="max-w-3xl mx-auto space-y-6">
    
    <!-- CATEGORY PILLS -->
    <div class="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex flex-wrap gap-1">
      {#each Object.entries(UNITS) as [key, cat]}
        <button
          on:click={() => { currentCategory = key; onCategoryChange(); }}
          class="flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-semibold transition-all {
            currentCategory === key
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }"
        >
          {cat.name}
        </button>
      {/each}
    </div>

    <!-- CONVERSION INTERFACE -->
    <div class="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        
        <!-- FROM COLUMN -->
        <div class="md:col-span-5 space-y-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Dari</label>
          <input
            type="number"
            bind:value={inputValue}
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-lg font-bold dark:text-white"
          />
          <select
            bind:value={unitFrom}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
          >
            {#each Object.entries(UNITS[currentCategory].units) as [uKey, uVal]}
              <option value={uKey}>{uVal.name}</option>
            {/each}
          </select>
        </div>

        <!-- SWAP BUTTON -->
        <div class="md:col-span-1 flex justify-center pt-6">
          <button
            on:click={swapUnits}
            aria-label="Tukar arah satuan"
            class="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm transition-transform active:scale-95"
          >
            <i class="ri-arrow-left-right-line text-base"></i>
          </button>
        </div>

        <!-- TO COLUMN -->
        <div class="md:col-span-5 space-y-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Ke</label>
          <div class="w-full px-4 py-3 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40 text-lg font-black text-indigo-700 dark:text-indigo-300 truncate">
            {Number(result.toFixed(6))}
          </div>
          <select
            bind:value={unitTo}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
          >
            {#each Object.entries(UNITS[currentCategory].units) as [uKey, uVal]}
              <option value={uKey}>{uVal.name}</option>
            {/each}
          </select>
        </div>

      </div>
    </div>

  </div>
</ToolLayout>
