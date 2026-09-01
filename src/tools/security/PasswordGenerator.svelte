<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let length = 16;
  let useUppercase = true;
  let useLowercase = true;
  let useNumbers = true;
  let useSymbols = true;
  let avoidAmbiguous = true;
  let generatedPassword = '';

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const AMBIGUOUS = 'iIlL1oO0';

  function generatePassword() {
    let charset = '';
    if (useUppercase) charset += UPPER;
    if (useLowercase) charset += LOWER;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;

    if (avoidAmbiguous) {
      charset = charset.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
    }

    if (!charset) {
      showToast('Pilih minimal satu jenis karakter!', 'warning');
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    generatedPassword = result;
  }

  // Calculate password strength entropy
  $: entropy = Math.round(length * Math.log2(
    (useUppercase ? 26 : 0) +
    (useLowercase ? 26 : 0) +
    (useNumbers ? 10 : 0) +
    (useSymbols ? 30 : 0) || 1
  ));

  $: strengthText =
    entropy > 80 ? 'Sangat Kuat (Very Strong)' :
    entropy > 60 ? 'Kuat (Strong)' :
    entropy > 40 ? 'Cukup (Moderate)' :
    'Lemah (Weak)';

  $: strengthColor =
    entropy > 80 ? 'bg-emerald-500 text-emerald-600' :
    entropy > 60 ? 'bg-blue-500 text-blue-600' :
    entropy > 40 ? 'bg-amber-500 text-amber-600' :
    'bg-rose-500 text-rose-600';

  function copyPassword() {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    showToast('Password disalin ke clipboard!', 'success');
  }

  generatePassword();
</script>

<ToolLayout slug="password-generator">
  <div class="max-w-3xl mx-auto space-y-6">
    
    <!-- GENERATED PASSWORD DISPLAY -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Kata Sandi Anda</span>
        <div class="flex items-center gap-1.5 text-xs font-bold {strengthColor.split(' ')[1]}">
          <i class="ri-shield-check-fill text-sm"></i>
          <span>{strengthText}</span>
        </div>
      </div>

      <div class="relative flex items-center">
        <input
          readonly
          value={generatedPassword}
          class="w-full py-4 pl-5 pr-28 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-slate-900 dark:text-white tracking-wider select-all focus:outline-none"
        />
        <div class="absolute right-2 flex items-center gap-1">
          <button
            on:click={generatePassword}
            aria-label="Acak ulang"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <i class="ri-refresh-line text-lg"></i>
          </button>
          <button
            on:click={copyPassword}
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <i class="ri-file-copy-line"></i>
            <span>Salin</span>
          </button>
        </div>
      </div>

      <!-- STRENGTH BAR -->
      <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-300 {strengthColor.split(' ')[0]}"
          style="width: {Math.min(100, (entropy / 90) * 100)}%"
        ></div>
      </div>
    </div>

    <!-- CONTROLS & OPTIONS -->
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
      <!-- LENGTH SLIDER -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Panjang Password</label>
          <span class="text-base font-black text-indigo-600 dark:text-indigo-400">{length} Karakter</span>
        </div>
        <input
          type="range"
          min="6"
          max="64"
          bind:value={length}
          on:input={generatePassword}
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div class="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>6 Karakter</span>
          <span>16 Karakter (Direkomendasikan)</span>
          <span>64 Karakter</span>
        </div>
      </div>

      <!-- CHECKBOXES -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" bind:checked={useUppercase} on:change={generatePassword} class="w-4 h-4 rounded text-indigo-600" />
          <span>Huruf Besar (A-Z)</span>
        </label>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" bind:checked={useLowercase} on:change={generatePassword} class="w-4 h-4 rounded text-indigo-600" />
          <span>Huruf Kecil (a-z)</span>
        </label>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" bind:checked={useNumbers} on:change={generatePassword} class="w-4 h-4 rounded text-indigo-600" />
          <span>Angka (0-9)</span>
        </label>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" bind:checked={useSymbols} on:change={generatePassword} class="w-4 h-4 rounded text-indigo-600" />
          <span>Simbol Karakter Khusus (!@#$)</span>
        </label>

        <label class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer sm:col-span-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <input type="checkbox" bind:checked={avoidAmbiguous} on:change={generatePassword} class="w-4 h-4 rounded text-indigo-600" />
          <span>Hindari karakter ambigu yang mirip (seperti: l, 1, I, O, 0)</span>
        </label>
      </div>

    </div>

  </div>
</ToolLayout>
