import { createSignal, Show, onMount } from 'solid-js';

function App() {
  const [selectedImage, setSelectedImage] = createSignal(null);
  const [extractedText, setExtractedText] = createSignal('');
  const [translatedText, setTranslatedText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [translationLoading, setTranslationLoading] = createSignal(false);
  const [selectedLanguage, setSelectedLanguage] = createSignal('ara');
  const [targetLanguage, setTargetLanguage] = createSignal('en');

  const ocrLanguages = [
    { code: 'ara', name: 'العربية' },
    { code: 'eng', name: 'الإنجليزية' },
    { code: 'fra', name: 'الفرنسية' },
    { code: 'tur', name: 'التركية' },
    // أضف لغات أخرى إذا لزم الأمر
  ];

  const targetLanguages = [
    { code: 'AR', name: 'العربية' },
    { code: 'EN', name: 'الإنجليزية' },
    { code: 'FR', name: 'الفرنسية' },
    { code: 'TR', name: 'التركية' },
    // أضف لغات أخرى إذا لزم الأمر
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setExtractedText('');
      setTranslatedText('');
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage()) return;
    setLoading(true);

    try {
      // قراءة ملف الصورة كـ base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        // إرسال الصورة إلى API الخلفي
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image, language: selectedLanguage() }),
        });

        const data = await response.json();

        if (response.ok) {
          setExtractedText(data.text);
        } else {
          console.error('خطأ في استخراج النص:', data.error);
          alert('خطأ في استخراج النص: ' + data.error);
        }
        setLoading(false);
      };
      reader.readAsDataURL(selectedImage());
    } catch (error) {
      console.error('خطأ:', error);
      alert('خطأ في استخراج النص');
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText())
      .then(() => alert('تم نسخ النص إلى الحافظة'))
      .catch((err) => console.error('Error copying text: ', err));
  };

  const handleDownloadText = () => {
    const blob = new Blob([extractedText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTranslateText = async () => {
    if (!extractedText()) return;
    setTranslationLoading(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractedText(), targetLang: targetLanguage() }),
      });

      const data = await response.json();

      if (response.ok) {
        setTranslatedText(data.translatedText);
      } else {
        console.error('خطأ في الترجمة:', data.error);
        alert('خطأ في الترجمة: ' + data.error);
      }
      setTranslationLoading(false);
    } catch (error) {
      console.error('خطأ:', error);
      alert('خطأ في الترجمة');
      setTranslationLoading(false);
    }
  };

  return (
    <div dir="rtl" class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 flex items-center justify-center">
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 class="text-3xl font-bold mb-6 text-center text-purple-600">استخراج النص من الصورة</h1>
        <div class="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            class="block w-full text-sm text-gray-500
                   file:ml-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-purple-50 file:text-purple-700
                   hover:file:bg-purple-100
                   cursor-pointer
                   box-border"
          />
        </div>
        <Show when={selectedImage()}>
          <div class="mb-4">
            <img
              src={URL.createObjectURL(selectedImage())}
              alt="الصورة المحددة"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">اختر لغة النص في الصورة:</label>
            <select
              value={selectedLanguage()}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border"
            >
              <For each={ocrLanguages}>
                {(lang) => <option value={lang.code}>{lang.name}</option>}
              </For>
            </select>
          </div>
          <button
            onClick={handleExtractText}
            class={`w-full px-6 py-3 mt-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={!loading()} fallback={'جارٍ استخراج النص...'}>
              استخراج النص
            </Show>
          </button>
        </Show>
        <Show when={extractedText()}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold mb-2 text-purple-600">النص المستخرج</h2>
            <p class="whitespace-pre-wrap text-gray-700">{extractedText()}</p>
          </div>
          <div class="mt-4 flex flex-col space-y-2">
            <button
              onClick={handleCopyText}
              class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              نسخ إلى الحافظة
            </button>
            <button
              onClick={handleDownloadText}
              class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              تنزيل النص
            </button>
            <div>
              <label class="block text-gray-700 mb-2">اختر لغة الترجمة:</label>
              <select
                value={targetLanguage()}
                onChange={(e) => setTargetLanguage(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer box-border mb-2"
              >
                <For each={targetLanguages}>
                  {(lang) => <option value={lang.code}>{lang.name}</option>}
                </For>
              </select>
              <button
                onClick={handleTranslateText}
                class={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                  translationLoading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={translationLoading()}
              >
                <Show when={!translationLoading()} fallback={'جارٍ الترجمة...'}>
                  ترجمة النص
                </Show>
              </button>
            </div>
          </div>
        </Show>
        <Show when={translatedText()}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold mb-2 text-purple-600">النص المترجم</h2>
            <p class="whitespace-pre-wrap text-gray-700">{translatedText()}</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;