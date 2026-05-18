const paperForm = document.querySelector('[data-paper-form]');
const paperFile = document.querySelector('[data-paper-file]');
const paperFolder = document.querySelector('[data-paper-folder]');
const paperFileName = document.querySelector('[data-paper-file-name]');
const paperSubmit = document.querySelector('[data-paper-submit]');
const paperStatus = document.querySelector('[data-paper-status]');
const paperList = document.querySelector('[data-paper-list]');
const paperCount = document.querySelector('[data-paper-count]');
const paperSearch = document.querySelector('[data-paper-search]');
const categoryFilter = document.querySelector('[data-category-filter]');
const categoryOptions = document.querySelector('[data-category-options]');
const bulkBar = document.querySelector('[data-bulk-bar]');
const selectedCount = document.querySelector('[data-selected-count]');
const bulkCategory = document.querySelector('[data-bulk-category]');
const bulkApply = document.querySelector('[data-bulk-apply]');
const bulkDelete = document.querySelector('[data-bulk-delete]');
const selectVisible = document.querySelector('[data-select-visible]');
const clearSelection = document.querySelector('[data-clear-selection]');
const paperDetail = document.querySelector('[data-paper-detail]');
const emptyState = document.querySelector('[data-empty-state]');
const detailHeading = document.querySelector('[data-detail-heading]');
const paperMeta = document.querySelector('[data-paper-meta]');
const paperTitle = document.querySelector('[data-paper-title]');
const paperCategory = document.querySelector('[data-paper-category]');
const paperAbstract = document.querySelector('[data-paper-abstract]');
const paperOriginalTitle = document.querySelector('[data-paper-original-title]');
const paperOriginalAbstract = document.querySelector('[data-paper-original-abstract]');
const paperGallery = document.querySelector('[data-paper-gallery]');
const paperSave = document.querySelector('[data-paper-save]');
const paperDelete = document.querySelector('[data-paper-delete]');
const paperClear = document.querySelector('[data-paper-clear]');
const paperOpen = document.querySelector('[data-paper-open]');
const paperManageStatus = document.querySelector('[data-paper-manage-status]');

let currentPaperId = null;
let lastPdfUrl = null;
let selectedImportFiles = [];
let visiblePaperIds = [];
const selectedPaperIds = new Set();
let apiBase = window.location.protocol === 'file:' ? 'http://localhost:8000' : '';

const openPaperDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open('aura-paper-library', 2);

  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains('papers')) {
      database.createObjectStore('papers', { keyPath: 'id' });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const withPaperStore = async (mode, callback) => {
  const database = await openPaperDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('papers', mode);
    const store = transaction.objectStore('papers');
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
};

const getPapers = async () => {
  const papers = await withPaperStore('readonly', (store) => store.getAll());
  return papers.sort((a, b) => b.importedAt - a.importedAt);
};

const getPaper = (id) => withPaperStore('readonly', (store) => store.get(id));
const savePaper = (paper) => withPaperStore('readwrite', (store) => store.put(paper));
const removePaper = (id) => withPaperStore('readwrite', (store) => store.delete(id));
const clearPapers = () => withPaperStore('readwrite', (store) => store.clear());
const getCategory = (paper) => (paper.category || '未分类').trim() || '未分类';

const resolveApiBase = async () => {
  const candidates = [apiBase || ''];
  if (window.location.protocol === 'file:') {
    candidates.push('http://localhost:8000');
  }

  for (const candidate of [...new Set(candidates)]) {
    try {
      const response = await fetch(`${candidate}/api/status`, { cache: 'no-store' });
      if (response.ok) {
        apiBase = candidate;
        return apiBase;
      }
    } catch {
      // Try the next candidate.
    }
  }

  if (window.location.protocol === 'file:') {
    try {
      const portResponse = await fetch('paper-library-port.json', { cache: 'no-store' });
      if (portResponse.ok) {
        const { port } = await portResponse.json();
        apiBase = `http://localhost:${port}`;
        return apiBase;
      }
    } catch {
      // Keep the default error below.
    }
  }

  throw new Error('无法连接本地解析服务。请先启动 PaperLibrary.exe，或运行 python server.py 后打开 http://localhost:8000。');
};

const setStatus = (message, isError = false) => {
  paperStatus.textContent = message;
  paperStatus.classList.toggle('is-error', isError);
};

const setManageStatus = (message, isError = false) => {
  paperManageStatus.textContent = message;
  paperManageStatus.classList.toggle('is-error', isError);
};

const formatBytes = (bytes) => {
  if (!bytes) {
    return '0 KB';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const hashFile = async (file) => {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const matchesQuery = (paper, query) => {
  if (!query) {
    return true;
  }
  const haystack = [
    paper.title,
    paper.abstract,
    paper.original_title,
    paper.original_abstract,
    paper.file_name,
    getCategory(paper),
  ].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
};

const matchesCategory = (paper, category) => !category || getCategory(paper) === category;

const renderGallery = (images) => {
  paperGallery.replaceChildren();

  if (!images || images.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = '没有提取到图片。';
    paperGallery.append(empty);
    return;
  }

  images.forEach((image, index) => {
    const figure = document.createElement('figure');
    figure.className = 'paper-figure';

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = `论文图片 ${index + 1}`;

    const caption = document.createElement('figcaption');
    caption.textContent = `第 ${image.page} 页 · ${image.width} × ${image.height}`;

    const remove = document.createElement('button');
    remove.className = 'image-remove';
    remove.type = 'button';
    remove.dataset.imageIndex = String(index);
    remove.textContent = '移除';

    figure.append(img, caption, remove);
    paperGallery.append(figure);
  });
};

const showPaper = async (id) => {
  const paper = await getPaper(id);
  if (!paper) {
    currentPaperId = null;
    paperDetail.hidden = true;
    emptyState.hidden = false;
    await renderList();
    return;
  }

  currentPaperId = paper.id;
  detailHeading.textContent = paper.title || paper.file_name;
  paperTitle.value = paper.title || '未识别到标题';
  paperCategory.value = getCategory(paper);
  paperAbstract.value = paper.abstract || '未识别到摘要。';
  paperOriginalTitle.textContent = paper.original_title || paper.title || '未识别到标题';
  paperOriginalAbstract.textContent = paper.original_abstract || paper.abstract || '未识别到摘要。';
  paperMeta.textContent = `${getCategory(paper)} · ${paper.file_name} · ${paper.page_count} 页 · ${paper.images.length} 张图片 · ${formatBytes(paper.file_size)}`;
  renderGallery(paper.images);

  const note = paper.translated
    ? `已使用 ${paper.translation_provider || '本地模型'} 翻译。`
    : (paper.translation_error || '当前显示解析出的原文。');
  setManageStatus(note, !paper.translated && Boolean(paper.translation_error));

  paperDetail.hidden = false;
  emptyState.hidden = true;
  await renderList();
};

async function renderList() {
  const papers = await getPapers();
  const query = paperSearch.value.trim();
  const category = categoryFilter.value;
  const categories = [...new Set(papers.map(getCategory))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  const visiblePapers = papers.filter((paper) => matchesQuery(paper, query) && matchesCategory(paper, category));
  visiblePaperIds = visiblePapers.map((paper) => paper.id);

  paperCount.textContent = `${papers.length} 篇`;
  paperList.replaceChildren();
  categoryFilter.replaceChildren(new Option('全部分类', ''));
  categoryOptions.replaceChildren();
  categories.forEach((name) => {
    categoryFilter.append(new Option(name, name));
    const option = document.createElement('option');
    option.value = name;
    categoryOptions.append(option);
  });
  categoryFilter.value = categories.includes(category) ? category : '';
  selectedPaperIds.forEach((id) => {
    if (!papers.some((paper) => paper.id === id)) {
      selectedPaperIds.delete(id);
    }
  });
  bulkBar.hidden = selectedPaperIds.size === 0;
  selectedCount.textContent = `已选 ${selectedPaperIds.size} 篇`;

  if (visiblePapers.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'list-empty';
    empty.textContent = papers.length === 0 ? '暂无论文。' : '没有匹配结果。';
    paperList.append(empty);
    if (papers.length === 0) {
      paperDetail.hidden = true;
      emptyState.hidden = false;
    }
    return;
  }

  visiblePapers.forEach((paper) => {
    const item = document.createElement('article');
    item.className = `paper-list-item${paper.id === currentPaperId ? ' is-active' : ''}`;
    item.dataset.paperId = paper.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedPaperIds.has(paper.id);
    checkbox.dataset.selectPaper = paper.id;

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.dataset.openPaper = paper.id;

    const title = document.createElement('strong');
    title.textContent = paper.title || paper.original_title || paper.file_name;

    const meta = document.createElement('span');
    const imported = new Date(paper.importedAt).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    meta.textContent = `${getCategory(paper)} · ${imported} · ${paper.page_count} 页`;

    openButton.append(title, meta);
    item.append(checkbox, openButton);
    paperList.append(item);
  });
}

const setImportFiles = (files) => {
  selectedImportFiles = [...files].filter((file) => file.name.toLowerCase().endsWith('.pdf'));
  if (selectedImportFiles.length === 0) {
    paperFileName.textContent = '选择多个论文文件';
    setStatus('没有选择 PDF。', true);
    return;
  }
  paperFileName.textContent = selectedImportFiles.length === 1
    ? selectedImportFiles[0].name
    : `已选择 ${selectedImportFiles.length} 个 PDF`;
  const totalSize = selectedImportFiles.reduce((sum, file) => sum + file.size, 0);
  setStatus(`${selectedImportFiles.length} 个文件 · ${formatBytes(totalSize)}`);
};

paperFile?.addEventListener('change', () => setImportFiles(paperFile.files || []));
paperFolder?.addEventListener('change', () => setImportFiles(paperFolder.files || []));

const importOneFile = async (file, index, total) => {
  setStatus(`(${index + 1}/${total}) 正在检查重复：${file.name}`);
  const id = await hashFile(file);
  const existing = await getPaper(id);
  if (existing) {
    return { id, status: 'duplicate' };
  }

  const formData = new FormData();
  formData.append('paper', file);
  setStatus(`(${index + 1}/${total}) 正在解析：${file.name}`);

    const base = await resolveApiBase();
    const response = await fetch(`${base}/api/paper`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `论文解析失败：${file.name}`);
  }

  const folderPath = file.webkitRelativePath ? file.webkitRelativePath.split('/').slice(0, -1).join('/') : '';
  const paper = {
    ...data,
    id,
    importedAt: Date.now(),
    updatedAt: Date.now(),
    file_size: file.size,
    folder_path: folderPath,
    category: folderPath ? folderPath.split('/')[0] : '未分类',
    pdf_blob: file,
    title: data.title || '未识别到标题',
    abstract: data.abstract || '未识别到摘要。',
    images: data.images || [],
  };

  await savePaper(paper);
  return { id, status: paper.translated ? 'imported' : 'imported_untranslated' };
};

paperForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const files = selectedImportFiles;
  if (files.length === 0) {
    setStatus('请先选择 PDF 或文件夹。', true);
    return;
  }

  paperSubmit.disabled = true;
  paperFile.disabled = true;
  paperFolder.disabled = true;

  try {
    let imported = 0;
    let duplicates = 0;
    let lastImportedId = null;

    for (let index = 0; index < files.length; index += 1) {
      const result = await importOneFile(files[index], index, files.length);
      if (result.status === 'duplicate') {
        duplicates += 1;
      } else {
        imported += 1;
        lastImportedId = result.id;
      }
    }

    if (lastImportedId) {
      await showPaper(lastImportedId);
    } else {
      await renderList();
    }
    setStatus(`导入完成：新增 ${imported} 篇，跳过重复 ${duplicates} 篇。`);
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : '论文解析失败。';
    const message = rawMessage === 'Failed to fetch'
      ? '无法连接本地解析服务。请先启动 PaperLibrary.exe，或运行 python server.py 后打开 http://localhost:8000。'
      : rawMessage;
    setStatus(message, true);
  } finally {
    paperSubmit.disabled = false;
    paperFile.disabled = false;
    paperFolder.disabled = false;
  }
});

paperList?.addEventListener('click', async (event) => {
  const checkbox = event.target.closest('[data-select-paper]');
  if (checkbox) {
    if (checkbox.checked) {
      selectedPaperIds.add(checkbox.dataset.selectPaper);
    } else {
      selectedPaperIds.delete(checkbox.dataset.selectPaper);
    }
    await renderList();
    return;
  }

  const button = event.target.closest('[data-open-paper]');
  if (button) {
    await showPaper(button.dataset.openPaper);
  }
});

paperSearch?.addEventListener('input', () => {
  renderList().catch(() => setStatus('无法读取论文库。', true));
});

categoryFilter?.addEventListener('change', () => {
  renderList().catch(() => setStatus('无法读取论文库。', true));
});

paperSave?.addEventListener('click', async () => {
  if (!currentPaperId) {
    return;
  }
  const paper = await getPaper(currentPaperId);
  if (!paper) {
    return;
  }

  paper.title = paperTitle.value.trim() || '未命名论文';
  paper.category = paperCategory.value.trim() || '未分类';
  paper.abstract = paperAbstract.value.trim() || '未填写摘要。';
  paper.updatedAt = Date.now();
  await savePaper(paper);
  await showPaper(paper.id);
  setManageStatus('已保存。');
});

paperOpen?.addEventListener('click', async () => {
  if (!currentPaperId) {
    return;
  }
  const paper = await getPaper(currentPaperId);
  if (!paper?.pdf_blob) {
    setManageStatus('这条记录没有保存原始 PDF。', true);
    return;
  }

  if (lastPdfUrl) {
    URL.revokeObjectURL(lastPdfUrl);
  }
  lastPdfUrl = URL.createObjectURL(paper.pdf_blob);
  window.open(lastPdfUrl, '_blank', 'noopener');
});

paperDelete?.addEventListener('click', async () => {
  if (!currentPaperId) {
    return;
  }

  await removePaper(currentPaperId);
  const papers = await getPapers();
  if (papers[0]) {
    await showPaper(papers[0].id);
  } else {
    currentPaperId = null;
    paperDetail.hidden = true;
    emptyState.hidden = false;
    await renderList();
  }
  setStatus('已删除。');
});

paperClear?.addEventListener('click', async () => {
  await clearPapers();
  selectedPaperIds.clear();
  currentPaperId = null;
  paperDetail.hidden = true;
  emptyState.hidden = false;
  await renderList();
  setStatus('论文库已清空。');
});

bulkApply?.addEventListener('click', async () => {
  const category = bulkCategory.value.trim();
  if (!category || selectedPaperIds.size === 0) {
    return;
  }

  for (const id of selectedPaperIds) {
    const paper = await getPaper(id);
    if (paper) {
      paper.category = category;
      paper.updatedAt = Date.now();
      await savePaper(paper);
    }
  }
  bulkCategory.value = '';
  await renderList();
  setStatus(`已将 ${selectedPaperIds.size} 篇论文归类为「${category}」。`);
});

bulkDelete?.addEventListener('click', async () => {
  if (selectedPaperIds.size === 0) {
    return;
  }

  const deleted = selectedPaperIds.size;
  for (const id of selectedPaperIds) {
    await removePaper(id);
  }
  selectedPaperIds.clear();
  const papers = await getPapers();
  if (papers[0]) {
    await showPaper(papers[0].id);
  } else {
    currentPaperId = null;
    paperDetail.hidden = true;
    emptyState.hidden = false;
    await renderList();
  }
  setStatus(`已删除 ${deleted} 篇论文。`);
});

selectVisible?.addEventListener('click', async () => {
  visiblePaperIds.forEach((id) => selectedPaperIds.add(id));
  await renderList();
});

clearSelection?.addEventListener('click', async () => {
  selectedPaperIds.clear();
  await renderList();
});

paperGallery?.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-image-index]');
  if (!button || !currentPaperId) {
    return;
  }

  const paper = await getPaper(currentPaperId);
  if (!paper) {
    return;
  }

  paper.images.splice(Number(button.dataset.imageIndex), 1);
  paper.updatedAt = Date.now();
  await savePaper(paper);
  await showPaper(paper.id);
  setManageStatus('图片已移除。');
});

renderList().catch(() => setStatus('无法打开本地论文库。', true));
