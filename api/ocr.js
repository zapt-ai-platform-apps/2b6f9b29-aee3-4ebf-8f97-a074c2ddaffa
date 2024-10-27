import FormData from 'form-data';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { image, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove the data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const formData = new FormData();
    formData.append('language', language || 'ara');
    formData.append('isOverlayRequired', 'false');
    formData.append('base64Image', base64Data);
    formData.append('iscreatesearchablepdf', 'false');
    formData.append('apikey', process.env.OCR_SPACE_API_KEY);

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      res.status(500).json({ error: data.ErrorMessage[0] });
    } else {
      const parsedText = data.ParsedResults.map(result => result.ParsedText).join('\n');
      res.status(200).json({ text: parsedText });
    }
  } catch (error) {
    console.error('Error in OCR API:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
}