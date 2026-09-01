<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let title = 'QuickTools - All in One Digital Utilities';
  let description = 'Koleksi lengkap berbagai tools digital: QR Generator, PDF tools, kompres gambar, developer tools, dan kalkulator serbaguna.';
  let siteUrl = 'https://quicktools.app';
  let imageUrl = 'https://quicktools.app/og-image.png';
  let author = 'QuickTools Team';

  $: metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<meta name="author" content="${author}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${siteUrl}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;

  function copyHtml() {
    navigator.clipboard.writeText(metaHtml);
    showToast('Kode Meta Tags HTML disalin!', 'success');
  }
</script>

<ToolLayout slug="meta-tag-generator">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- INPUTS -->
    <div class="lg:col-span-6 space-y-4">
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Judul Halaman (Page Title)</label>
          <input type="text" bind:value={title} class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold dark:text-white" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Deskripsi Meta</label>
          <textarea rows="3" bind:value={description} class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white"></textarea>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">URL Website Kanonis</label>
          <input type="url" bind:value={siteUrl} class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">URL Gambar Pratinjau (OG Image)</label>
          <input type="url" bind:value={imageUrl} class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white" />
        </div>
      </div>

      <!-- HTML OUTPUT -->
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Kode HTML Head</span>
          <button on:click={copyHtml} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            <i class="ri-file-copy-line"></i>
            <span>Salin HTML</span>
          </button>
        </div>
        <pre class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto select-all border border-slate-100 dark:border-slate-800">{metaHtml}</pre>
      </div>
    </div>

    <!-- PREVIEWS -->
    <div class="lg:col-span-6 space-y-6">
      <!-- GOOGLE SEARCH PREVIEW -->
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400">Pratinjau Google Search</h4>
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-500 truncate">{siteUrl}</div>
          <div class="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer">{title}</div>
          <div class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{description}</div>
        </div>
      </div>

      <!-- SOCIAL CARD PREVIEW -->
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400">Pratinjau Media Sosial (Open Graph)</h4>
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950">
          <div class="h-36 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
            <i class="ri-image-2-line text-2xl mr-2"></i>
            <span>{imageUrl}</span>
          </div>
          <div class="p-4 space-y-1">
            <div class="text-[10px] uppercase font-bold text-slate-400">{siteUrl.replace(/^https?:\/\//, '')}</div>
            <div class="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{title}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{description}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</ToolLayout>
