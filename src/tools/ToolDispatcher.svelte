<script>
  import { activeToolSlug } from '../stores/appStore.js';

  // QR Tools
  import QrGenerator from './qr/QrGenerator.svelte';
  import QrScanner from './qr/QrScanner.svelte';
  import BarcodeGenerator from './qr/BarcodeGenerator.svelte';

  // Image Tools
  import ImageCompressor from './image/ImageCompressor.svelte';
  import ImageConverter from './image/ImageConverter.svelte';
  import ImageResizer from './image/ImageResizer.svelte';
  import ImageCropRotate from './image/ImageCropRotate.svelte';

  // PDF Tools
  import ImageToPdf from './pdf/ImageToPdf.svelte';
  import PdfMerge from './pdf/PdfMerge.svelte';
  import PdfSplit from './pdf/PdfSplit.svelte';

  // Developer Tools
  import JsonFormatter from './developer/JsonFormatter.svelte';
  import Base64Tool from './developer/Base64Tool.svelte';
  import UuidGenerator from './developer/UuidGenerator.svelte';
  import HashGenerator from './developer/HashGenerator.svelte';
  import JwtDecoder from './developer/JwtDecoder.svelte';
  import TimestampConverter from './developer/TimestampConverter.svelte';

  // Security Tools
  import PasswordGenerator from './security/PasswordGenerator.svelte';
  import RandomStringGenerator from './security/RandomStringGenerator.svelte';

  // Text Tools
  import WordCounter from './text/WordCounter.svelte';
  import CaseConverter from './text/CaseConverter.svelte';
  import RemoveDuplicates from './text/RemoveDuplicates.svelte';
  import LoremIpsum from './text/LoremIpsum.svelte';

  // Calculator & Converter
  import PercentageCalculator from './calculator/PercentageCalculator.svelte';
  import AgeCalculator from './calculator/AgeCalculator.svelte';
  import UnitConverter from './calculator/UnitConverter.svelte';

  // Design Tools
  import ColorPicker from './design/ColorPicker.svelte';
  import GradientGenerator from './design/GradientGenerator.svelte';
  import BoxShadowGenerator from './design/BoxShadowGenerator.svelte';

  // Web Tools
  import UrlEncoder from './web/UrlEncoder.svelte';
  import MetaTagGenerator from './web/MetaTagGenerator.svelte';

  // Audio Tools
  import YouTubeAudioConverter from './audio/YouTubeAudioConverter.svelte';

  const toolComponents = {
    'youtube-audio-converter': YouTubeAudioConverter,
    'qr-generator': QrGenerator,
    'qr-scanner': QrScanner,
    'barcode-generator': BarcodeGenerator,
    'image-compressor': ImageCompressor,
    'image-converter': ImageConverter,
    'image-resizer': ImageResizer,
    'image-crop-rotate': ImageCropRotate,
    'image-to-pdf': ImageToPdf,
    'pdf-merge': PdfMerge,
    'pdf-split': PdfSplit,
    'json-formatter': JsonFormatter,
    'base64-tool': Base64Tool,
    'uuid-generator': UuidGenerator,
    'hash-generator': HashGenerator,
    'jwt-decoder': JwtDecoder,
    'timestamp-converter': TimestampConverter,
    'password-generator': PasswordGenerator,
    'random-string-generator': RandomStringGenerator,
    'word-counter': WordCounter,
    'case-converter': CaseConverter,
    'remove-duplicates': RemoveDuplicates,
    'lorem-ipsum': LoremIpsum,
    'percentage-calculator': PercentageCalculator,
    'age-calculator': AgeCalculator,
    'unit-converter': UnitConverter,
    'color-picker': ColorPicker,
    'gradient-generator': GradientGenerator,
    'box-shadow-generator': BoxShadowGenerator,
    'url-encoder': UrlEncoder,
    'meta-tag-generator': MetaTagGenerator
  };

  $: CurrentComponent = $activeToolSlug ? toolComponents[$activeToolSlug] : null;
</script>

{#if CurrentComponent}
  <svelte:component this={CurrentComponent} />
{:else if $activeToolSlug}
  <div class="max-w-md mx-auto my-20 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
    <i class="ri-tools-line text-4xl text-indigo-500"></i>
    <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200">Tool Sedang Disiapkan</h3>
    <p class="text-xs text-slate-500">Modul ini akan segera hadir pada pembaruan rilis berikutnya.</p>
    <button
      on:click={() => $activeToolSlug = null}
      class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
    >
      Kembali ke Beranda
    </button>
  </div>
{/if}
