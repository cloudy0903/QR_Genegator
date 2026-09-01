<script>
  import { activeToolSlug, favoriteTools, toggleFavorite, recordToolUsage } from '../stores/appStore.js';
  import { getCategoryById } from '../tools/registry.js';

  export let tool;

  $: isFav = $favoriteTools.includes(tool.slug);
  $: category = getCategoryById(tool.category);

  function openTool() {
    recordToolUsage(tool.slug);
    $activeToolSlug = tool.slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFavClick(e) {
    e.stopPropagation();
    toggleFavorite(tool.slug);
  }
</script>

<div
  role="button"
  tabindex="0"
  on:click={openTool}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openTool()}
  class="group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:-translate-y-1"
>
  <div>
    <!-- TOP ROW: ICON & ACTIONS -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100 dark:from-indigo-950/60 dark:to-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <i class="{tool.icon}"></i>
      </div>

      <div class="flex items-center gap-1.5">
        {#if tool.is_popular}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 uppercase tracking-wide">
            Popular
          </span>
        {/if}

        <button
          on:click={handleFavClick}
          aria-label="Add to favorites"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <i class="{isFav ? 'ri-star-fill text-amber-400 text-lg' : 'ri-star-line text-lg'}"></i>
        </button>
      </div>
    </div>

    <!-- TITLE & DESCRIPTION -->
    <h3 class="font-bold text-base text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
      {tool.name}
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
      {tool.description}
    </p>
  </div>

  <!-- FOOTER ROW: BADGES & ARROW -->
  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
    <div class="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-medium">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      <span class="text-[11px]">Client-side</span>
    </div>

    <span class="inline-flex items-center gap-1 font-semibold text-xs text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
      Buka Tool
      <i class="ri-arrow-right-line"></i>
    </span>
  </div>
</div>
