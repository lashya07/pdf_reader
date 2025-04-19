let fullText = '';
let pdfTextByPage = [];

document.getElementById('pdf-upload').addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') return;

  const reader = new FileReader();
  reader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

    const container = document.getElementById('pdf-content');
    container.innerHTML = '';
    fullText = '';
    pdfTextByPage = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const lines = {};
      content.items.forEach(item => {
        const y = Math.floor(item.transform[5]);
        if (!lines[y]) lines[y] = [];
        lines[y].push(item.str);
      });

      const sortedLines = Object.keys(lines).sort((a, b) => b - a);
      const pageText = sortedLines.map(y => lines[y].join(' ')).join('\n');

      pdfTextByPage.push(pageText);
      fullText += `Page ${i}:\n${pageText}\n\n`;

      const pageDiv = document.createElement('div');
      pageDiv.className = 'page';
      pageDiv.innerHTML = `<div class="page-title">Page ${i}:</div><pre>${pageText}</pre>`;
      container.appendChild(pageDiv);
    }
  };
  reader.readAsArrayBuffer(file);
});

// Search Feature
document.getElementById('search').addEventListener('input', function () {
  const query = this.value.trim().toLowerCase();
  const pages = document.querySelectorAll('.page pre');

  pages.forEach(pre => {
    let text = pre.textContent;
    if (query.length > 0) {
      const regex = new RegExp(`(${query})`, 'gi');
      pre.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
    } else {
      pre.innerHTML = text;
    }
  });
});

// Dark Mode Toggle
document.getElementById('toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Download Text Button
document.getElementById('download-text').addEventListener('click', () => {
  const blob = new Blob([fullText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'extracted_text.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
});

// Simple one-line summarization
document.getElementById('summarize-btn').addEventListener('click', () => {
  if (!fullText) return alert("Please upload a PDF first!");

  const words = fullText.split(/\s+/).filter(w => w.length > 3);
  const wordFreq = {};

  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
    if (cleanWord.length > 3) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
  const topKeywords = sortedWords.slice(0, 3).map(entry => entry[0]);

  const summary = `This PDF primarily discusses ${topKeywords.join(', ')}.`;

  alert("📘 Summary:\n\n" + summary);
});
