<script>
  import { createEventDispatcher } from 'svelte';
  import { showToast } from '../stores/appStore.js';

  export let accept = "*";
  export let multiple = false;
  export let maxSizeMb = 50;
  export let label = "Tarik & lepas file ke sini";
  export let sublabel = "atau klik untuk memilih file dari perangkat Anda";
  export let fileIcon = "ri-upload-cloud-2-line";

  const dispatch = createEventDispatcher();
  let isDragging = false;
  let fileInput;

  function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;

    const validFiles = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeMb * 1024 * 1024) {
        showToast(`File "${file.name}" melebihi batas ukuran (${maxSizeMb} MB)`, 'error');
        continue;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      if (multiple) {
        dispatch('filesSelected', validFiles);
      } else {
        dispatch('fileSelected', validFiles[0]);
      }
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function onDragLeave(e) {
    e.preventDefault();
    isDragging = false;
  }

  function onDrop(e) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function onInputChange(e) {
    if (e.target && e.target.files) {
      handleFiles(e.target.files);
      e.target.value = ''; // reset so same file can be re-selected
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  on:dragover={onDragOver}
  on:dragleave={onDragLeave}
  on:drop={onDrop}
  on:click={() => fileInput && fileInput.click()}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput && fileInput.click()}
  class="relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group {
    isDragging
      ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99] ring-4 ring-indigo-500/20'
      : 'border-slate-300 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20'
  }"
>
  <input
    bind:this={fileInput}
    type="file"
    {accept}
    {multiple}
    on:change={onInputChange}
    class="hidden"
  />

  <div class="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
    <i class="{fileIcon}"></i>
  </div>

  <h3 class="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 text-center mb-1">
    {label}
  </h3>
  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
    {sublabel}
  </p>

  <div class="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
    <i class="ri-shield-check-line text-emerald-500"></i>
    <span>Maksimal {maxSizeMb} MB • Diproses 100% Lokal</span>
  </div>
</div>
