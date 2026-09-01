<script>
  import { onMount } from 'svelte';
  import {
    activeToolSlug,
    selectedCategory,
    searchQuery,
    favoriteTools,
    recentTools,
    isDarkMode
  } from './stores/appStore.js';
  import { CATEGORIES, TOOLS, searchTools, getCategoryById } from './tools/registry.js';

  import Navbar from './components/Navbar.svelte';
  import Hero from './components/Hero.svelte';
  import ToolCard from './components/ToolCard.svelte';
  import Footer from './components/Footer.svelte';
  import Toast from './components/Toast.svelte';
  import ToolDispatcher from './tools/ToolDispatcher.svelte';

  $: filteredTools = $searchQuery.trim()
    ? searchTools($searchQuery)
    : ($selectedCategory === 'all'
        ? TOOLS
        : TOOLS.filter(t => t.category === $selectedCategory));

  $: popularTools = TOOLS.filter(t => t.is_popular);

  $: favToolsList = TOOLS.filter(t => $favoriteTools.includes(t.slug));

  $: recentToolsList = $recentTools
    .map(item => TOOLS.find(t => t.slug === item.slug))
    .filter(Boolean);

  function resetCategory() {
    $selectedCategory = 'all';
    $searchQuery = '';
  }

  // Sync dark mode class on document html
  $: if (typeof document !== 'undefined') {
    if ($isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<div class="min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-indigo-500/30 {$isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}">
  
  <!-- TOAST NOTIFICATION CONTAINER -->
  <Toast />

  <!-- TOP NAVBAR -->
  <Navbar />

  <!-- MAIN VIEW -->
  <main class="flex-1">
    {#if $activeToolSlug}
      <!-- ACTIVE TOOL DETAIL VIEW -->
      <ToolDispatcher />
    {:else}
      <!-- HOMEPAGE (PRD Section 8 - 10) -->
      <Hero />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        
        <!-- CATEGORY PILL FILTER BAR -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="ri-apps-2-line text-indigo-500"></i>
              <span>Jelajahi Kategori</span>
            </h2>
            {#if $selectedCategory !== 'all' || $searchQuery}
              <button
                on:click={resetCategory}
                class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <i class="ri-refresh-line"></i>
                <span>Tampilkan Semua</span>
              </button>
            {/if}
          </div>

          <!-- HORIZONTAL SCROLLABLE CATEGORY PILLS -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              on:click={() => $selectedCategory = 'all'}
              class="px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 {
                $selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
              }"
            >
              Semua Tools ({TOOLS.length})
            </button>

            {#each CATEGORIES as cat}
              <button
                on:click={() => $selectedCategory = cat.id}
                class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 {
                  $selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                }"
              >
                <i class="{cat.icon}"></i>
                <span>{cat.name}</span>
              </button>
            {/each}
          </div>
        </div>

        <!-- FAVORITES SECTION (PRD Section 33) -->
        {#if $selectedCategory === 'all' && !$searchQuery && favToolsList.length > 0}
          <section class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="ri-star-fill text-amber-500"></i>
                <span>Tool Favorit Anda</span>
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each favToolsList as tool (tool.slug)}
                <ToolCard {tool} />
              {/each}
            </div>
          </section>
        {/if}

        <!-- RECENT TOOLS SECTION (PRD Section 34) -->
        {#if $selectedCategory === 'all' && !$searchQuery && recentToolsList.length > 0}
          <section class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="ri-history-line text-indigo-500"></i>
                <span>Baru Saja Digunakan</span>
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each recentToolsList.slice(0, 4) as tool (tool.slug)}
                <ToolCard {tool} />
              {/each}
            </div>
          </section>
        {/if}

        <!-- POPULAR TOOLS SECTION (PRD Section 9) -->
        {#if $selectedCategory === 'all' && !$searchQuery}
          <section class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="ri-fire-fill text-orange-500"></i>
                <span>Tools Populer</span>
              </h2>
              <span class="text-xs text-slate-400">Paling sering dipakai sehari-hari</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each popularTools as tool (tool.slug)}
                <ToolCard {tool} />
              {/each}
            </div>
          </section>
        {/if}

        <!-- ALL FILTERED TOOLS GRID -->
        <section class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {#if $searchQuery}
                <i class="ri-search-line text-indigo-500"></i>
                <span>Hasil Pencarian: "{$searchQuery}" ({filteredTools.length})</span>
              {:else if $selectedCategory !== 'all'}
                {@const cat = getCategoryById($selectedCategory)}
                <i class="{cat ? cat.icon : 'ri-tools-line'} text-indigo-500"></i>
                <span>{cat ? cat.name : 'Kategori'} ({filteredTools.length})</span>
              {:else}
                <i class="ri-grid-fill text-indigo-500"></i>
                <span>Semua Tools ({filteredTools.length})</span>
              {/if}
            </h2>
          </div>

          {#if filteredTools.length === 0}
            <div class="text-center py-16 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <i class="ri-search-line text-4xl text-slate-300"></i>
              <h3 class="font-bold text-slate-800 dark:text-slate-200">Tidak ada tool yang cocok</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih kategori di bagian atas.
              </p>
              <button
                on:click={resetCategory}
                class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
              >
                Reset Pencarian
              </button>
            </div>
          {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each filteredTools as tool (tool.slug)}
                <ToolCard {tool} />
              {/each}
            </div>
          {/if}
        </section>

      </div>
    {/if}
  </main>

  <!-- FOOTER -->
  <Footer />

  <!-- MOBILE BOTTOM NAVIGATION (PRD Section 50) -->
  <div class="md:hidden sticky bottom-0 z-40 border-t backdrop-blur-xl px-4 py-2 flex items-center justify-around text-xs transition-colors {$isDarkMode ? 'bg-slate-950/90 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-600'}">
    <button
      on:click={() => { $activeToolSlug = null; $selectedCategory = 'all'; }}
      class="flex flex-col items-center gap-0.5 {!$activeToolSlug ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}"
    >
      <i class="ri-home-4-line text-lg"></i>
      <span class="text-[10px]">Beranda</span>
    </button>

    <button
      on:click={() => { $activeToolSlug = null; window.scrollTo({ top: 400, behavior: 'smooth' }); }}
      class="flex flex-col items-center gap-0.5"
    >
      <i class="ri-grid-line text-lg"></i>
      <span class="text-[10px]">Tools</span>
    </button>

    <button
      on:click={() => { $activeToolSlug = 'qr-generator'; }}
      class="flex flex-col items-center gap-0.5 {$activeToolSlug === 'qr-generator' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}"
    >
      <i class="ri-qr-code-line text-lg"></i>
      <span class="text-[10px]">QR Code</span>
    </button>

    <button
      on:click={() => { $activeToolSlug = 'image-compressor'; }}
      class="flex flex-col items-center gap-0.5 {$activeToolSlug === 'image-compressor' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}"
    >
      <i class="ri-file-reduce-line text-lg"></i>
      <span class="text-[10px]">Kompres</span>
    </button>
  </div>

</div>
