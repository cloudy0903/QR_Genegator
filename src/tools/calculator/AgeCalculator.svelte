<script>
  import ToolLayout from '../../components/ToolLayout.svelte';

  let birthDate = '2000-01-01';

  $: ageStats = calculateAge(birthDate);

  function calculateAge(dateStr) {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    const now = new Date();

    if (birth > now) {
      return null;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // Next Birthday countdown
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      daysUntilNext
    };
  }
</script>

<ToolLayout slug="age-calculator">
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Tanggal Lahir</label>
      <input
        type="date"
        bind:value={birthDate}
        class="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-800 dark:text-white"
      />
    </div>

    {#if ageStats}
      <!-- HERO AGE STATS -->
      <div class="grid grid-cols-3 gap-4">
        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-sm">
          <div class="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">{ageStats.years}</div>
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Tahun</div>
        </div>

        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-sm">
          <div class="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white">{ageStats.months}</div>
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Bulan</div>
        </div>

        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-sm">
          <div class="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white">{ageStats.days}</div>
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Hari</div>
        </div>
      </div>

      <!-- ADDITIONAL BREAKDOWN -->
      <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400">Rincian Tambahan</h4>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <div class="text-xl font-bold text-slate-800 dark:text-slate-200">{ageStats.totalDays.toLocaleString('id-ID')}</div>
            <div class="text-[11px] text-slate-400 mt-1">Total Hari Dihabiskan</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
            <div class="text-xl font-bold text-slate-800 dark:text-slate-200">{ageStats.totalWeeks.toLocaleString('id-ID')}</div>
            <div class="text-[11px] text-slate-400 mt-1">Total Minggu</div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <div class="text-xl font-black text-emerald-600 dark:text-emerald-400">{ageStats.daysUntilNext} Hari</div>
            <div class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-1">Menuju Ulang Tahun Berikutnya 🎂</div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</ToolLayout>
