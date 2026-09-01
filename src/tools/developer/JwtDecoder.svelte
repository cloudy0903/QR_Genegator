<script>
  import ToolLayout from '../../components/ToolLayout.svelte';
  import { showToast } from '../../stores/appStore.js';

  let jwtInput = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4zC3b9-o93P-l478z';
  let header = {};
  let payload = {};
  let signature = '';
  let error = '';
  let isExpired = false;
  let expDate = '';

  function decodeJwt() {
    error = '';
    if (!jwtInput.trim()) {
      header = {};
      payload = {};
      signature = '';
      return;
    }

    const parts = jwtInput.trim().split('.');
    if (parts.length !== 3) {
      error = 'Format JWT tidak valid. JWT harus terdiri dari 3 bagian yang dipisahkan titik (.)';
      return;
    }

    try {
      header = JSON.parse(decodeBase64Url(parts[0]));
      payload = JSON.parse(decodeBase64Url(parts[1]));
      signature = parts[2];

      if (payload.exp) {
        const expMs = payload.exp * 1000;
        isExpired = Date.now() > expMs;
        expDate = new Date(expMs).toLocaleString('id-ID');
      } else {
        isExpired = false;
        expDate = 'Tidak ada klaim kedaluwarsa (exp)';
      }
    } catch (e) {
      error = 'Gagal mendekode token: ' + e.message;
    }
  }

  function decodeBase64Url(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  }

  $: if (jwtInput !== undefined) {
    decodeJwt();
  }

  function copyJson(data) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showToast('JSON disalin ke clipboard!', 'success');
  }
</script>

<ToolLayout slug="jwt-decoder">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Ketik atau Paste JWT Token</label>
      <textarea
        bind:value={jwtInput}
        rows="4"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        class="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
      ></textarea>
    </div>

    {#if error}
      <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
        <i class="ri-error-warning-fill text-lg"></i>
        <span>{error}</span>
      </div>
    {:else}
      <!-- TOKEN STATUS -->
      {#if payload.exp}
        <div class="p-4 rounded-2xl border flex items-center justify-between {
          isExpired
            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
        }">
          <div class="flex items-center gap-2 text-xs font-bold">
            <i class="{isExpired ? 'ri-close-circle-fill text-lg' : 'ri-checkbox-circle-fill text-lg'}"></i>
            <span>{isExpired ? 'Token Sudah Kedaluwarsa (Expired)' : 'Token Masih Berlaku (Active)'}</span>
          </div>
          <span class="text-xs font-medium">Batas Waktu: {expDate}</span>
        </div>
      {/if}

      <!-- DECODED BLOCKS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- HEADER -->
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span class="text-xs font-black text-rose-500 uppercase tracking-wider">Header (Algorithm & Token Type)</span>
            <button on:click={() => copyJson(header)} class="text-xs text-slate-400 hover:text-slate-600 font-semibold">Salin</button>
          </div>
          <pre class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">{JSON.stringify(header, null, 2)}</pre>
        </div>

        <!-- PAYLOAD -->
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span class="text-xs font-black text-indigo-500 uppercase tracking-wider">Payload (Data Claims)</span>
            <button on:click={() => copyJson(payload)} class="text-xs text-slate-400 hover:text-slate-600 font-semibold">Salin</button>
          </div>
          <pre class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">{JSON.stringify(payload, null, 2)}</pre>
        </div>
      </div>
    {/if}
  </div>
</ToolLayout>
