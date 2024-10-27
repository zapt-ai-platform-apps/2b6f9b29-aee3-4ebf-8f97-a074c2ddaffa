import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    const encodedText = encodeURIComponent(text);
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedText}&langpair=|${targetLang}`);

    const data = await response.json();

    if (data.responseData) {
      res.status(200).json({ translatedText: data.responseData.translatedText });
    } else {
      res.status(500).json({ error: 'Failed to translate text' });
    }
  } catch (error) {
    console.error('Error in Translation API:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
}