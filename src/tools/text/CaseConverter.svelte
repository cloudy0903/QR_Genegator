<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let inputText = 'Halo dunia, ini adalah contoh teks untuk konversi format huruf!';

  function toUppercase() {
    inputText = inputText.toUpperCase();
    showToast('Diubah ke UPPERCASE', 'success');
  }

  function toLowercase() {
    inputText = inputText.toLowerCase();
    showToast('Diubah ke lowercase', 'success');
  }

  function toTitleCase() {
    inputText = inputText.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    showToast('Diubah ke Title Case', 'success');
  }

  function toSentenceCase() {
    inputText = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    showToast('Diubah ke Sentence case', 'success');
  }

  function toCamelCase() {
    inputText = inputText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    showToast('Diubah ke camelCase', 'success');
  }

  function toPascalCase() {
    const camel = inputText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    inputText = camel.charAt(0).toUpperCase() + camel.slice(1);
    showToast('Diubah ke PascalCase', 'success');
  }

  function toSnakeCase() {
    inputText = inputText
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w]/g, '');
    showToast('Diubah ke snake_case', 'success');
  }

  function toKebabCase() {
    inputText = inputText
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    showToast('Diubah ke kebab-case', 'success');
  }

  function toConstantCase() {
    inputText = inputText
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w]/g, '');
    showToast('Diubah ke CONSTANT_CASE', 'success');
  }

  function copyText() {
    navigator.clipboard.writeText(inputText);
    showToast('Teks berhasil disalin!', 'success');
  }
</script>

<ToolLayout slug="case-converter">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- ACTION BUTTONS GRID -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
      <button on:click={toSentenceCase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left">
        Sentence case
      </button>
      <button on:click={toTitleCase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left">
        Title Case
      </button>
      <button on:click={toUppercase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left">
        UPPERCASE
      </button>
      <button on:click={toLowercase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left">
        lowercase
      </button>
      <button on:click={toCamelCase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left font-mono">
        camelCase
      </button>
      <button on:click={toPascalCase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left font-mono">
        PascalCase
      </button>
      <button on:click={toSnakeCase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left font-mono">
        snake_case
      </button>
      <button on:click={toKebabCase} class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-all text-left font-mono">
        kebab-case
      </button>
    </div>

    <!-- TEXT EDITOR -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Teks Masukan</span>
        <button on:click={copyText} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          <i class="ri-file-copy-line"></i>
          <span>Salin Teks</span>
        </button>
      </div>

      <textarea
        bind:value={inputText}
        rows="10"
        class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
      ></textarea>
    </div>
  </div>
</ToolLayout>
