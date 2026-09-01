<script>
  import { activeToolSlug, selectedCategory } from '../stores/appStore.js';
  import { CATEGORIES } from '../tools/registry.js';

  function filterCat(id) {
    $activeToolSlug = null;
    $selectedCategory = id;
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  function goHome() {
    $activeToolSlug = null;
    $selectedCategory = 'all';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<footer class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors py-12 sm:py-16 text-slate-600 dark:text-slate-400 text-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      
      <!-- BRAND COLUMN -->
      <div class="md:col-span-1 space-y-3">
        <button on:click={goHome} class="flex items-center gap-2.5 text-left">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm text-lg">
            <i class="ri-tools-fill"></i>
          </div>
          <span class="font-black text-xl text-slate-900 dark:text-white tracking-tight">QuickTools</span>
        </button>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Digital Toolbox serbaguna untuk kebutuhan konversi, pembuatan barcode & QR, kompres gambar, manipulasi PDF, dan produktivitas harian.
        </p>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Privacy First: Local In-Browser Processing
        </div>
      </div>

      <!-- CATEGORIES COL 1 -->
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
          Tools Populer
        </h4>
        <ul class="space-y-2">
          {#each CATEGORIES.slice(0, 5) as cat}
            <li>
              <button on:click={() => filterCat(cat.id)} class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {cat.name}
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- CATEGORIES COL 2 -->
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
          Kategori Lainnya
        </h4>
        <ul class="space-y-2">
          {#each CATEGORIES.slice(5) as cat}
            <li>
              <button on:click={() => filterCat(cat.id)} class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {cat.name}
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- PRIVACY & PHILOSOPHY -->
      <div class="space-y-3">
        <h4 class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
          Keamanan & Privasi
        </h4>
        <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          File dokumen, gambar, QR, dan password Anda diproses langsung di peramban lokal perangkat Anda (Client-Side) dan <strong>tidak pernah disimpan atau dikirim ke server pihak ketiga</strong>.
        </p>
      </div>

    </div>

    <!-- BOTTOM ROW -->
    <div class="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500">
      <p>© {new Date().getFullYear()} QuickTools. Satu website untuk semua kebutuhan tools digital.</p>
      <div class="flex items-center gap-4">
        <span>Cepat</span>
        <span>•</span>
        <span>Privat</span>
        <span>•</span>
        <span>Tanpa Batas</span>
      </div>
    </div>
  </div>
</footer>
