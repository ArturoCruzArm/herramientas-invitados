/* ===== Utilidades compartidas ===== */

/** Formatear bytes a texto legible */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/** Leer archivo como DataURL */
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Leer archivo como ArrayBuffer */
function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/** Cargar imagen desde URL/DataURL */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Convertir imagen usando Canvas */
function convertImage(img, format, quality, maxWidth) {
  const canvas = document.createElement('canvas');
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (maxWidth && w > maxWidth) {
    h = Math.round(h * (maxWidth / w));
    w = maxWidth;
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), format, quality);
  });
}

/** Descargar blob como archivo */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Descargar ZIP usando JSZip */
async function downloadZip(files, zipName) {
  const zip = new JSZip();
  for (const f of files) {
    zip.file(f.name, f.data);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, zipName);
}

/** Configurar zona de drag & drop */
function setupDropZone(el, fileInput, onFiles) {
  el.addEventListener('click', () => fileInput.click());

  el.addEventListener('dragover', e => {
    e.preventDefault();
    el.classList.add('dragover');
  });

  el.addEventListener('dragleave', () => {
    el.classList.remove('dragover');
  });

  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('dragover');
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) onFiles(fileInput.files);
  });
}

/** Actualizar barra de progreso */
function updateProgress(bar, percent) {
  bar.querySelector('.fill').style.width = percent + '%';
}

/** Cambiar extension del nombre de archivo */
function changeExt(name, newExt) {
  return name.replace(/\.[^.]+$/, '') + newExt;
}

/** Obtener extension de un nombre */
function getExt(name) {
  return name.split('.').pop().toLowerCase();
}

/** Mostrar/ocultar elemento */
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
