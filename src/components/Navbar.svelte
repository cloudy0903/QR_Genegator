<script>
  import { activeToolSlug, selectedCategory, favoriteTools, recentTools, isDarkMode, toggleFavorite } from '../stores/appStore.js';
  import { CATEGORIES, TOOLS, getToolBySlug } from '../tools/registry.js';

  let showMobileMenu = false;
  let showRecentDropdown = false;
  let showFavsDropdown = false;

  function goHome() {
    $activeToolSlug = null;
    $selectedCategory = 'all';
    showMobileMenu = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectTool(slug) {
    $activeToolSlug = slug;
    showMobileMenu = false;
    showRecentDropdown = false;
    showFavsDropdown = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function filterCategory(catId) {
    $activeToolSlug = null;
    $selectedCategory = catId;
    showMobileMenu = false;
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  function toggleTheme() {
    $isDarkMode = !$isDarkMode;
  }
</script>

<header class="sticky top-0 z-40 backdrop-blur-xl transition-colors duration-300 border-b {$isDarkMode ? 'bg-slate-950/80 border-slate-800/80 text-slate-100' : 'bg-white/85 border-slate-200/80 text-slate-900'}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
    
    <!-- BRAND / LOGO -->
    <button on:click={goHome} class="flex items-center gap-3 group text-left focus:outline-none">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
        <i class="ri-tools-fill text-white text-xl"></i>
      </div>
      <div>
        <div class="flex items-center gap-1.5">
          <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">QuickTools</span>
          <span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">v1.0</span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 hidden sm:block">Digital Toolbox & Converter</p>
      </div>
    </button>

    <!-- DESKTOP NAV -->
    <nav class="hidden md:flex items-center gap-1">
      <button
        on:click={goHome}
        class="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 {
          !$activeToolSlug && $selectedCategory === 'all' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
        }"
      >
        Beranda
      </button>

      <!-- RECENT TOOLS DROPDOWN -->
      <div class="relative">
        <button
          on:click={() => { showRecentDropdown = !showRecentDropdown; showFavsDropdown = false; }}
          class="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <i class="ri-history-line"></i>
          <span>Riwayat</span>
          {#if $recentTools.length > 0}
            <span class="ml-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
              {$recentTools.length}
            </span>
          {/if}
        </button>

        {#if showRecentDropdown}
          <div class="absolute left-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 {$isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}">
            <div class="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Terakhir Digunakan</div>
            {#if $recentTools.length === 0}
              <div class="p-3 text-xs text-slate-500 text-center">Belum ada riwayat tool.</div>
            {:else}
              {#each $recentTools as item}
                {@const tool = getToolBySlug(item.slug)}
                {#if tool}
                  <button
                    on:click={() => selectTool(tool.slug)}
                    class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <i class="{tool.icon} text-indigo-500 text-sm"></i>
                    <span class="truncate flex-1">{tool.name}</span>
                  </button>
                {/if}
              {/each}
            {/if}
          </div>
        {/if}
      </div>

      <!-- FAVORITES DROPDOWN -->
      <div class="relative">
        <button
          on:click={() => { showFavsDropdown = !showFavsDropdown; showRecentDropdown = false; }}
          class="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <i class="ri-star-line text-amber-500"></i>
          <span>Favorit</span>
          {#if $favoriteTools.length > 0}
            <span class="ml-1 w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 text-[10px] flex items-center justify-center font-bold">
              {$favoriteTools.length}
            </span>
          {/if}
        </button>

        {#if showFavsDropdown}
          <div class="absolute left-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 {$isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}">
            <div class="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tool Favorit Anda</div>
            {#if $favoriteTools.length === 0}
              <div class="p-3 text-xs text-slate-500 text-center">Beri bintang ⭐ pada tool untuk menyimpannya di sini.</div>
            {:else}
              {#each $favoriteTools as slug}
                {@const tool = getToolBySlug(slug)}
                {#if tool}
                  <button
                    on:click={() => selectTool(tool.slug)}
                    class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <i class="{tool.icon} text-amber-500 text-sm"></i>
                    <span class="truncate flex-1">{tool.name}</span>
                  </button>
                {/if}
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </nav>

    <!-- RIGHT CONTROLS -->
    <div class="flex items-center gap-2.5">
      <!-- THEME TOGGLE BUTTON -->
      <button
        on:click={toggleTheme}
        aria-label="Toggle dark mode"
        class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 {$isDarkMode ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700 ring-1 ring-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 ring-1 ring-slate-200'}"
      >
        {#if $isDarkMode}
          <i class="ri-sun-line text-lg"></i>
        {:else}
          <i class="ri-moon-line text-lg"></i>
        {/if}
      </button>

      <!-- MOBILE HAMBURGER -->
      <button
        on:click={() => showMobileMenu = !showMobileMenu}
        aria-label="Open mobile menu"
        class="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <i class="{showMobileMenu ? 'ri-close-line' : 'ri-menu-line'} text-xl"></i>
      </button>
    </div>
  </div>

  <!-- MOBILE DROPDOWN MENU -->
  {#if showMobileMenu}
    <div class="md:hidden border-t px-4 py-4 space-y-3 {$isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}">
      <button
        on:click={goHome}
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <i class="ri-home-4-line text-indigo-500 text-lg"></i>
        <span>Beranda</span>
      </button>

      <div class="pt-2 border-t {$isDarkMode ? 'border-slate-800' : 'border-slate-100'}">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Kategori Populer</div>
        <div class="grid grid-cols-2 gap-1.5">
          {#each CATEGORIES.slice(0, 6) as cat}
            <button
              on:click={() => filterCategory(cat.id)}
              class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left truncate"
            >
              <i class="{cat.icon} text-indigo-500"></i>
              <span class="truncate">{cat.name}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</header>
