# pdf_reader

A sleek, browser-based PDF text extractor and reader with real-time search, dark mode, text download, and basic summarization functionality. Built with JavaScript, HTML, and CSS, using PDF.js for rendering and extracting text from PDFs.

**Features**
- Upload and Read PDFs
- Live Text Search
- Dark Mode Toggle
- Download Extracted Text
- One-Line summary

**Technologies used**
- HTML - Page structure and semantic layout
- CSS - Styling, layout, dark mode, and responsive design (with CSS Variables)
- JavaScript -  Core application logic for PDF rendering, interaction, and summarization
- PDF.js – Library by Mozilla for rendering and extracting text from PDFs directly in the browser
- FileReader API – Reads user-uploaded files (PDF) as ArrayBuffer
- Blob API – Generates downloadable .txt file of extracted text
- RegEx (JavaScript) – Used for text highlighting and simple keyword-based summarization
