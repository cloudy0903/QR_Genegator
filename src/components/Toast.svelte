<script>
  import { toasts } from '../stores/appStore.js';
  import { fly, fade } from 'svelte/transition';
</script>

<div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
  {#each $toasts as toast (toast.id)}
    <div
      in:fly={{ y: 20, duration: 250 }}
      out:fade={{ duration: 200 }}
      class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium transition-all {
        toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
        toast.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' :
        toast.type === 'warning' ? 'bg-amber-500/90 border-amber-400 text-white' :
        'bg-slate-900/90 dark:bg-slate-800/90 border-slate-700 text-white'
      }"
    >
      <i class="{
        toast.type === 'success' ? 'ri-checkbox-circle-fill text-lg text-emerald-200' :
        toast.type === 'error' ? 'ri-error-warning-fill text-lg text-rose-200' :
        toast.type === 'warning' ? 'ri-alert-fill text-lg text-amber-200' :
        'ri-information-fill text-lg text-blue-300'
      }"></i>
      <span class="flex-1">{toast.message}</span>
    </div>
  {/each}
</div>
