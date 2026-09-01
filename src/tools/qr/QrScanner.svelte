<script>
  import { onMount, onDestroy } from 'svelte';
  import ToolLayout from '../../components/ToolLayout.svelte';
  import Dropzone from '../../components/Dropzone.svelte';
  import { showToast } from '../../stores/appStore.js';

  let scanMode = 'upload'; // 'upload' | 'camera'
  let videoElement;
  let canvasElement;
  let stream = null;
  let isScanningCamera = false;
  let scanResult = null;
  let uploadedImageUrl = null;
  let detector = null;

  onMount(async () => {
    if ('BarcodeDetector' in window) {
      try {
        detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13'] });
      } catch (e) {
        console.warn('BarcodeDetector format not supported', e);
      }
    }
  });

  onDestroy(() => {
    stopCamera();
  });

  async function startCamera() {
    scanMode = 'camera';
    scanResult = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.setAttribute('playsinline', true);
        await videoElement.play();
        isScanningCamera = true;
        scanCameraFrame();
        showToast('Kamera aktif', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal mengakses kamera: ' + err.message, 'error');
    }
  }

  function stopCamera() {
    isScanningCamera = false;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  async function scanCameraFrame() {
    if (!isScanningCamera || !videoElement) return;

    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      try {
        if (detector) {
          const barcodes = await detector.detect(videoElement);
          if (barcodes.length > 0) {
            scanResult = barcodes[0].rawValue;
            showToast('QR Code berhasil terdeteksi!', 'success');
            stopCamera();
            return;
          }
        }
      } catch (e) {
        // continue scanning
      }
    }

    if (isScanningCamera) {
      requestAnimationFrame(scanCameraFrame);
    }
  }

  async function handleFileSelected(e) {
    const file = e.detail;
    if (!file) return;

    uploadedImageUrl = URL.createObjectURL(file);
    scanResult = null;

    const img = new Image();
    img.onload = async () => {
      try {
        if (detector) {
          const barcodes = await detector.detect(img);
          if (barcodes.length > 0) {
            scanResult = barcodes[0].rawValue;
            showToast('QR Code berhasil dibaca!', 'success');
          } else {
            showToast('Tidak ada QR Code yang terdeteksi pada gambar ini.', 'warning');
          }
        } else {
          // If BarcodeDetector is not natively available in browser
          showToast('Gambar dimuat. Peramban ini tidak mendukung BarcodeDetector API bawaan.', 'warning');
        }
      } catch (err) {
        showToast('Error memproses gambar: ' + err.message, 'error');
      }
    };
    img.src = uploadedImageUrl;
  }

  function copyResult() {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    showToast('Hasil QR berhasil disalin!', 'success');
  }
</script>

<ToolLayout slug="qr-scanner">
  <div class="max-w-3xl mx-auto space-y-6">
    
    <!-- MODE SELECTOR -->
    <div class="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-sm mx-auto">
      <button
        on:click={() => { stopCamera(); scanMode = 'upload'; }}
        class="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all {
          scanMode === 'upload'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400'
        }"
      >
        <i class="ri-upload-cloud-line text-sm"></i>
        <span>Upload Gambar</span>
      </button>

      <button
        on:click={startCamera}
        class="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all {
          scanMode === 'camera'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400'
        }"
      >
        <i class="ri-camera-line text-sm"></i>
        <span>Gunakan Kamera</span>
      </button>
    </div>

    <!-- SCANNING AREA -->
    {#if scanMode === 'upload'}
      <div class="space-y-6">
        <Dropzone
          accept="image/*"
          label="Pilih atau tarik foto QR Code"
          sublabel="Mendukung JPG, PNG, WEBP, GIF"
          fileIcon="ri-qr-scan-2-line"
          on:fileSelected={handleFileSelected}
        />

        {#if uploadedImageUrl}
          <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Foto yang Diupload</h4>
            <img src={uploadedImageUrl} alt="QR Source" class="max-h-64 rounded-xl shadow-md object-contain" />
          </div>
        {/if}
      </div>
    {:else}
      <!-- CAMERA VIEW -->
      <div class="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] max-h-[420px] flex items-center justify-center shadow-2xl border border-slate-800">
        <video bind:this={videoElement} class="w-full h-full object-cover"></video>
        
        <!-- TARGET RETICLE -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-56 h-56 rounded-2xl border-2 border-indigo-500/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] relative">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 animate-pulse"></div>
          </div>
        </div>

        <!-- CAMERA ACTION OVERLAY -->
        <button
          on:click={stopCamera}
          class="absolute bottom-4 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-slate-800"
        >
          Hentikan Kamera
        </button>
      </div>
    {/if}

    <!-- RESULT CARD -->
    {#if scanResult}
      <div class="p-6 rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg animate-in fade-in duration-300">
        <div class="flex items-center justify-between gap-4 mb-3">
          <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <i class="ri-checkbox-circle-fill text-xl"></i>
            <span>QR Code Terdeteksi!</span>
          </div>
          <button
            on:click={copyResult}
            class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <i class="ri-file-copy-line"></i>
            <span>Salin Isi</span>
          </button>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 break-all font-mono text-sm text-slate-800 dark:text-slate-100 select-all">
          {scanResult}
        </div>

        {#if scanResult.startsWith('http://') || scanResult.startsWith('https://')}
          <div class="mt-4 flex justify-end">
            <a
              href={scanResult}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Buka Tautan di Tab Baru</span>
              <i class="ri-external-link-line"></i>
            </a>
          </div>
        {/if}
      </div>
    {/if}

  </div>
</ToolLayout>
