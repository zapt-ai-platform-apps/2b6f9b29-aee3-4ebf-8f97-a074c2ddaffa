# New App

## Description

New App is a user-friendly application that allows you to extract text from images. Simply upload an image containing text, and the app will use Optical Character Recognition (OCR) technology to extract and display the text for you.

## User Journey

1. **Access the App**

   - Open the application in your web browser. You'll be greeted with a simple and clean interface.

2. **Upload an Image**

   - Click on the "Choose File" button to select an image from your device. The app accepts images in formats such as JPEG, PNG, GIF, etc.
   - Once you've selected an image, a preview of the image will be displayed on the screen.

3. **Extract Text from Image**

   - Click the "Extract Text" button to initiate the text extraction process.
   - While the app is processing, the "Extract Text" button will indicate that it's working, and you won't be able to click it again until it's done. This prevents multiple submissions.

4. **View Extracted Text**

   - After a short moment, the extracted text will appear below the button.
   - The text is displayed in a readable format, preserving line breaks where applicable.

5. **Repeat as Needed**

   - If you wish to extract text from another image, you can repeat the process by selecting a new image.

## Features

- **Image Preview**: See a preview of the image you've selected before extracting text.
- **Loading State**: The app provides visual feedback during the extraction process.
- **Error Handling**: If there's an issue with the extraction, an error message will be displayed.
- **Responsive Design**: The app is responsive and works well on various screen sizes, from mobile devices to desktops.

## External Services

- **OCR.space API**: The app uses the OCR.space API to perform the text extraction from images.

## Environment Variables

The app requires the following environment variable:

- `OCR_SPACE_API_KEY`: API key for the OCR.space service.
