<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let count = 3;
  let type = 'paragraphs'; // paragraphs, sentences, words
  let startWithLorem = true;
  let output = '';

  const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  function generateSentence() {
    const len = Math.floor(Math.random() * 10) + 8;
    const words = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  }

  function generateParagraph() {
    const sentenceCount = Math.floor(Math.random() * 4) + 4;
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }

  function generate() {
    if (type === 'paragraphs') {
      const paras = [];
      for (let i = 0; i < count; i++) {
        paras.push(generateParagraph());
      }
      if (startWithLorem && paras.length > 0) {
        paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
      }
      output = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sents = [];
      for (let i = 0; i < count; i++) {
        sents.push(generateSentence());
      }
      output = sents.join(' ');
    } else {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      output = words.join(' ');
    }
  }

  function copyText() {
    navigator.clipboard.writeText(output);
    showToast('Lorem Ipsum disalin ke clipboard!', 'success');
  }

  generate();
</script>

<ToolLayout slug="lorem-ipsum">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Satuan</label>
          <select
            bind:value={type}
            on:change={generate}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold dark:text-white"
          >
            <option value="paragraphs">Paragraf</option>
            <option value="sentences">Kalimat</option>
            <option value="words">Kata</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Jumlah</label>
          <input
            type="number"
            min="1"
            max="50"
            bind:value={count}
            on:input={generate}
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold dark:text-white"
          />
        </div>

        <div class="flex items-center sm:pt-6">
          <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" bind:checked={startWithLorem} on:change={generate} class="w-4 h-4 rounded text-indigo-600" />
            <span>Mulai dengan "Lorem ipsum"</span>
          </label>
        </div>
      </div>

      <button
        on:click={generate}
        class="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
      >
        <i class="ri-refresh-line text-lg"></i>
        <span>Generate Teks Baru</span>
      </button>
    </div>

    <!-- RESULT -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Hasil Lorem Ipsum</span>
        <button on:click={copyText} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          <i class="ri-file-copy-line"></i>
          <span>Salin Teks</span>
        </button>
      </div>

      <textarea
        readonly
        value={output}
        rows="12"
        class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none dark:text-white leading-relaxed"
      ></textarea>
    </div>
  </div>
</ToolLayout>
