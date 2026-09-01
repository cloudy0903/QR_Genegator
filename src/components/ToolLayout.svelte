<script>
  import { activeToolSlug, favoriteTools, toggleFavorite } from '../stores/appStore.js';
  import { getToolBySlug, getCategoryById, getRelatedTools } from '../tools/registry.js';

  export let slug;

  $: tool = getToolBySlug(slug);
  $: category = tool ? getCategoryById(tool.category) : null;
  $: isFav = tool ? $favoriteTools.includes(tool.slug) : false;
  $: relatedTools = tool ? getRelatedTools(tool.slug, 3) : [];

  function goBack() {
    $activeToolSlug = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openRelated(relatedSlug) {
    $activeToolSlug = relatedSlug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

{#if tool}
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    
    <!-- BREADCRUMBS -->
    <nav class="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
      <button on:click={goBack} class="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
        <i class="ri-home-4-line"></i>
        <span>Beranda</span>
      </button>
      <i class="ri-arrow-right-s-line text-slate-400"></i>
      {#if category}
        <span class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{category.name}</span>
        <i class="ri-arrow-right-s-line text-slate-400"></i>
      {/if}
      <span class="text-slate-900 dark:text-slate-200 font-semibold">{tool.name}</span>
    </nav>

    <!-- TOOL HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-indigo-500/25 shrink-0">
          <i class="{tool.icon}"></i>
        </div>

        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            
            <!-- PRIVACY BADGE (PRD Section 47) -->
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Local Processing
            </span>
          </div>

          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            {tool.description}
          </p>
        </div>
      </div>

      <!-- HEADER ACTION BUTTONS -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          on:click={() => toggleFavorite(tool.slug)}
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 {
            isFav
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }"
        >
          <i class="{isFav ? 'ri-star-fill text-amber-500' : 'ri-star-line'} text-sm"></i>
          <span>{isFav ? 'Tersimpan di Favorit' : 'Tambah Favorit'}</span>
        </button>

        <button
          on:click={goBack}
          class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
        >
          <i class="ri-close-line text-sm"></i>
          <span>Kembali</span>
        </button>
      </div>
    </div>

    <!-- MAIN TOOL CONTENT SLOT -->
    <div class="mb-16">
      <slot />
    </div>

    <!-- FREQUENTLY ASKED QUESTIONS (PRD Section 61) -->
    {#if tool.faq && tool.faq.length > 0}
      <div class="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <i class="ri-question-line text-indigo-500"></i>
          <span>Pertanyaan Umum (FAQ)</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each tool.faq as item}
            <div class="p-5 rounded-2xl border bg-slate-50/60 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80">
              <h3 class="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                {item.q}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- RELATED TOOLS (PRD Section 60) -->
    {#if relatedTools.length > 0}
      <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Tool Terkait
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {#each relatedTools as rel}
            <button
              on:click={() => openRelated(rel.slug)}
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all group"
            >
              <div class="flex items-center gap-2.5 mb-1 text-slate-800 dark:text-slate-200 font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <i class="{rel.icon} text-indigo-500"></i>
                <span class="truncate">{rel.name}</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{rel.description}</p>
            </button>
          {/each}
        </div>
      </div>
    {/if}

  </div>
{/if}
