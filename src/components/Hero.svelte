<script>
  import { searchQuery, selectedCategory, activeToolSlug } from '../stores/appStore.js';
  import { CATEGORIES, TOOLS, searchTools } from '../tools/registry.js';

  let localSearch = '';
  let searchFocused = false;

  $: suggestions = localSearch.trim() ? searchTools(localSearch).slice(0, 6) : [];

  function handleSearchSubmit() {
    $searchQuery = localSearch;
    if (suggestions.length > 0) {
      $activeToolSlug = suggestions[0].slug;
    }
  }

  function pickTool(slug) {
    $activeToolSlug = slug;
    localSearch = '';
    $searchQuery = '';
    searchFocused = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function pickChip(chip) {
    localSearch = chip;
    $searchQuery = chip;
  }
</script>

<section class="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
  <!-- BACKGROUND GLOW DECORATIONS -->
  <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-pink-500/15 blur-3xl -z-10 pointer-events-none rounded-full"></div>

  <div class="max-w-4xl mx-auto px-4 text-center">
    
    <!-- PILL BADGE -->
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>100% Client-Side Privacy • Tanpa Perlu Install • Cepat & Gratis</span>
    </div>

    <!-- MAIN HEADLINE -->
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
      Everything you need. <br class="hidden sm:inline" />
      <span class="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
        All in one place.
      </span>
    </h1>

    <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
      Convert, generate, compress, dan selesaikan pekerjaan digital harian Anda langsung di browser tanpa ribet.
    </p>

    <!-- SMART SEARCH BOX -->
    <div class="relative max-w-2xl mx-auto text-left">
      <div class="relative flex items-center shadow-xl rounded-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-500/20 {
        searchFocused ? 'bg-white dark:bg-slate-900 ring-2 ring-indigo-500' : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800'
      }">
        <div class="pl-4 pr-2 text-slate-400 text-xl">
          <i class="ri-search-line"></i>
        </div>
        <input
          type="text"
          bind:value={localSearch}
          on:input={() => $searchQuery = localSearch}
          on:focus={() => searchFocused = true}
          on:blur={() => setTimeout(() => searchFocused = false, 250)}
          on:keydown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          placeholder="Cari tool digital apa saja (cth: compress, qr, json, pdf, convert)..."
          class="w-full py-4 pr-4 bg-transparent text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none text-slate-800 dark:text-slate-100"
        />
        {#if localSearch}
          <button
            on:click={() => { localSearch = ''; $searchQuery = ''; }}
            aria-label="Hapus teks pencarian"
            class="mr-3 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center text-sm"
          >
            <i class="ri-close-line"></i>
          </button>
        {/if}
      </div>

      <!-- AUTOCOMPLETE SUGGESTIONS DROPDOWN -->
      {#if searchFocused && suggestions.length > 0}
        <div class="absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border p-2 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div class="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hasil Pencarian Cepat</div>
          {#each suggestions as tool}
            <button
              on:mousedown={() => pickTool(tool.slug)}
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors group"
            >
              <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-base group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <i class="{tool.icon}"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">{tool.name}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{tool.description}</div>
              </div>
              <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Buka →</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- QUICK SEARCH TAGS -->
    <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <span class="font-medium text-slate-400">Paling dicari:</span>
      {#each ['Compress Image', 'QR Generator', 'Image to PDF', 'JSON Formatter', 'Merge PDF', 'Password'] as tag}
        <button
          on:click={() => pickChip(tag)}
          class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors font-medium text-slate-600 dark:text-slate-300"
        >
          {tag}
        </button>
      {/each}
    </div>

  </div>
</section>
