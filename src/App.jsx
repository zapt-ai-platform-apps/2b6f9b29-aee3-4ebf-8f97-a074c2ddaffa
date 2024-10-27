import { createSignal, Show } from 'solid-js';

function App() {
  const [selectedImage, setSelectedImage] = createSignal(null);
  const [extractedText, setExtractedText] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setExtractedText(''); // Clear previous text when a new image is selected
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage()) return;
    setLoading(true);

    try {
      // Read the image file as base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Send the image to the backend API
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (response.ok) {
          setExtractedText(data.text);
        } else {
          console.error('Error extracting text:', data.error);
          alert('Error extracting text: ' + data.error);
        }
        setLoading(false);
      };
      reader.readAsDataURL(selectedImage());
    } catch (error) {
      console.error('Error:', error);
      alert('Error extracting text');
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 flex items-center justify-center">
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 class="text-3xl font-bold mb-6 text-center text-purple-600">Extract Text from Image</h1>
        <div class="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            class="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
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
              alt="Selected"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <button
            onClick={handleExtractText}
            class={`w-full px-6 py-3 mt-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            <Show when={!loading()} fallback={'Extracting Text...'}>
              Extract Text
            </Show>
          </button>
        </Show>
        <Show when={extractedText()}>
          <div class="mt-6">
            <h2 class="text-2xl font-bold mb-2 text-purple-600">Extracted Text</h2>
            <p class="whitespace-pre-wrap text-gray-700">{extractedText()}</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;