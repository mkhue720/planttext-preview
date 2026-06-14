const textarea = document.getElementById('uml');
const img = document.getElementById('preview');
const formatSelect = document.getElementById('format');
const downloadBtn = document.getElementById('download');

// Encode using pako.deflateRaw and PlantUML's custom 6-bit encoding
function encode(text) {
  const utf8 = new TextEncoder().encode(text);
  const deflated = pako.deflateRaw(utf8, { level: 9 });
  return encode64(deflated);
}

function encode64(data) {
  let res = '';
  for (let i = 0; i < data.length; i += 3) {
    const b1 = data[i];
    const b2 = i + 1 < data.length ? data[i + 1] : 0;
    const b3 = i + 2 < data.length ? data[i + 2] : 0;
    res += append3bytes(b1, b2, b3);
  }
  return res;
}

function append3bytes(b1, b2, b3) {
  const c1 = (b1 >> 2) & 0x3F;
  const c2 = ((b1 & 0x3) << 4) | ((b2 >> 4) & 0xF);
  const c3 = ((b2 & 0xF) << 2) | ((b3 >> 6) & 0x3);
  const c4 = b3 & 0x3F;
  return encode6bit(c1) + encode6bit(c2) + encode6bit(c3) + encode6bit(c4);
}

function encode6bit(b) {
  if (b <= 9) return String.fromCharCode(48 + b);
  b -= 10;
  if (b <= 25) return String.fromCharCode(65 + b);
  b -= 26;
  if (b <= 25) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return '-';
  if (b === 1) return '_';
  return '?';
}

function render() {
  const text = textarea.value || '';
  try {
    const encoded = encode(text);
    const fmt = formatSelect.value;
    img.src = `https://www.plantuml.com/plantuml/${fmt}/${encoded}`;
  } catch (err) {
    console.error('Encode error', err);
  }
}

let timer = null;
textarea.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(render, 300);
});
formatSelect.addEventListener('change', render);

downloadBtn.addEventListener('click', () => {
  if (!img.src) return;
  const a = document.createElement('a');
  a.href = img.src;
  a.download = `diagram.${formatSelect.value === 'svg' ? 'svg' : 'png'}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
});

window.addEventListener('load', () => {
  textarea.value = `@startuml\\nAlice -> Bob: Hello from PlantUML\\n@enduml`;
  render();
});