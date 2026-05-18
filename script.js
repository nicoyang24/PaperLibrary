const paperForm = document.querySelector('[data-paper-form]');
const paperFile = document.querySelector('[data-paper-file]');
const paperFolder = document.querySelector('[data-paper-folder]');
const paperFileName = document.querySelector('[data-paper-file-name]');
const paperSubmit = document.querySelector('[data-paper-submit]');
const paperStatus = document.querySelector('[data-paper-status]');
const paperText = document.querySelector('[data-paper-text]');
const textImport = document.querySelector('[data-text-import]');
const paperList = document.querySelector('[data-paper-list]');
const paperCount = document.querySelector('[data-paper-count]');
const paperSearch = document.querySelector('[data-paper-search]');
const categoryFilter = document.querySelector('[data-category-filter]');
const categoryOptions = document.querySelector('[data-category-options]');
const paperDetail = document.querySelector('[data-paper-detail]');
const emptyState = document.querySelector('[data-empty-state]');
const detailHeading = document.querySelector('[data-detail-heading]');
const paperMeta = document.querySelector('[data-paper-meta]');
const paperTitle = document.querySelector('[data-paper-title]');
const paperCategory = document.querySelector('[data-paper-category]');
const paperAbstract = document.querySelector('[data-paper-abstract]');
const paperOriginalTitle = document.querySelector('[data-paper-original-title]');
const paperOriginalAbstract = document.querySelector('[data-paper-original-abstract]');
const paperBibliography = document.querySelector('[data-paper-bibliography]');
const paperGallery = document.querySelector('[data-paper-gallery]');
const paperSave = document.querySelector('[data-paper-save]');
const paperDelete = document.querySelector('[data-paper-delete]');
const paperClear = document.querySelector('[data-paper-clear]');
const paperOpen = document.querySelector('[data-paper-open]');
const paperOpenFolder = document.querySelector('[data-paper-open-folder]');
const paperManageStatus = document.querySelector('[data-paper-manage-status]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const langToggle = document.querySelector('[data-lang-toggle]');
const settingsToggle = document.querySelector('[data-settings-toggle]');
const settingsPanel = document.querySelector('[data-settings-panel]');
const libraryManage = document.querySelector('[data-library-manage]');
const managerPane = document.querySelector('[data-manager-pane]');
const managerSearch = document.querySelector('[data-manager-search]');
const managerCategory = document.querySelector('[data-manager-category]');
const managerSort = document.querySelector('[data-manager-sort]');
const managerPageSize = document.querySelector('[data-manager-page-size]');
const managerRows = document.querySelector('[data-manager-rows]');
const managerSummary = document.querySelector('[data-manager-summary]');
const managerBulk = document.querySelector('[data-manager-bulk]');
const managerSelectedSummary = document.querySelector('[data-manager-selected-summary]');
const managerBulkCategory = document.querySelector('[data-manager-bulk-category]');
const managerBulkApply = document.querySelector('[data-manager-bulk-apply]');
const managerBulkDelete = document.querySelector('[data-manager-bulk-delete]');
const managerClearSelection = document.querySelector('[data-manager-clear-selection]');
const managerSelectPage = document.querySelector('[data-manager-select-page]');
const managerPrevPage = document.querySelector('[data-manager-prev-page]');
const managerNextPage = document.querySelector('[data-manager-next-page]');
const managerPageInfo = document.querySelector('[data-manager-page-info]');

const messages = {
  zh: {
    themeDark: '深色',
    themeLight: '浅色',
    appearance: '外观',
    language: '语言',
    langCurrent: '中文',
    settings: '设置',
    importModule: '导入论文',
    manageModule: '管理论文',
    openManager: '打开管理',
    clearLibrary: '清空论文库',
    manage: '管理',
    clear: '清空',
    importPdf: '导入 PDF',
    choosePapers: '选择多个论文文件',
    importFolder: '导入文件夹',
    parseImport: '解析并入库',
    ready: '论文库准备就绪。',
    textPlaceholder: '粘贴 ChatGPT、网页或笔记里的论文推荐文本，自动识别其中的 PDF 链接。',
    textImport: '识别链接并导入',
    searchPlaceholder: '搜索标题、摘要或文件名',
    allCategories: '全部分类',
    selectedCount: (count) => `已选 ${count} 篇`,
    bulkCategoryPlaceholder: '设置分类',
    apply: '应用',
    selectVisible: '全选当前',
    cancelSelection: '取消选择',
    delete: '删除',
    currentPaper: '当前论文',
    noPaperSelected: '未选择论文',
    openPdf: '打开 PDF',
    openFolder: '打开文件夹',
    title: '标题',
    category: '分类',
    uncategorized: '未分类',
    abstract: '摘要',
    saveChanges: '保存修改',
    original: '原文',
    figures: '论文图片',
    figuresLabel: '图片',
    library: '论文库',
    emptyTitle: '导入论文后开始整理。',
    emptyText: '标题、摘要、图片和原始 PDF 会保存在这个浏览器的本地论文库。',
    managerTitle: '论文库管理',
    managerLoading: '正在读取论文库...',
    managerSearchPlaceholder: '搜索标题、摘要、文件名、分类或来源链接',
    importedDesc: '最近导入',
    importedAsc: '最早导入',
    titleAsc: '标题 A-Z',
    titleDesc: '标题 Z-A',
    sizeDesc: '文件从大到小',
    sizeAsc: '文件从小到大',
    perPage: (count) => `每页 ${count}`,
    bulkSetCategory: '批量设置分类',
    applyCategory: '应用分类',
    deleteSelected: '删除所选',
    file: '文件',
    pages: '页数',
    images: '图片',
    size: '大小',
    importedAt: '导入时间',
    actions: '操作',
    previousPage: '上一页',
    nextPage: '下一页',
    pageInfo: (page, total) => `第 ${page} / ${total} 页`,
    managerSummary: (total, shown) => `共 ${total} 篇，当前显示 ${shown} 篇`,
    view: '查看',
    source: '来源',
    noPapers: '暂无论文。',
    noMatches: '没有匹配结果。',
    noFolderPath: '这条记录没有本地文件路径。请重新导入一次，之后就能打开文件夹。',
    folderOpened: '已打开论文所在文件夹。',
  },
  en: {
    themeDark: 'Dark',
    themeLight: 'Light',
    appearance: 'Appearance',
    language: 'Language',
    langCurrent: 'English',
    settings: 'Settings',
    importModule: 'Import Papers',
    manageModule: 'Manage Papers',
    openManager: 'Open Manager',
    clearLibrary: 'Clear library',
    manage: 'Manage',
    clear: 'Clear',
    importPdf: 'Import PDF',
    choosePapers: 'Choose paper files',
    importFolder: 'Import folder',
    parseImport: 'Parse and save',
    ready: 'Library is ready.',
    textPlaceholder: 'Paste paper recommendations from ChatGPT, webpages, or notes. PDF links will be detected automatically.',
    textImport: 'Detect links and import',
    searchPlaceholder: 'Search title, abstract, or filename',
    allCategories: 'All categories',
    selectedCount: (count) => `${count} selected`,
    bulkCategoryPlaceholder: 'Set category',
    apply: 'Apply',
    selectVisible: 'Select page',
    cancelSelection: 'Cancel',
    delete: 'Delete',
    currentPaper: 'Current paper',
    noPaperSelected: 'No paper selected',
    openPdf: 'Open PDF',
    openFolder: 'Open folder',
    title: 'Title',
    category: 'Category',
    uncategorized: 'Uncategorized',
    abstract: 'Abstract',
    saveChanges: 'Save changes',
    original: 'Original',
    figures: 'Paper figures',
    figuresLabel: 'Figures',
    library: 'Library',
    emptyTitle: 'Import papers to start organizing.',
    emptyText: 'Titles, abstracts, figures, and original PDFs are saved in this browser library.',
    managerTitle: 'Library Manager',
    managerLoading: 'Reading library...',
    managerSearchPlaceholder: 'Search title, abstract, filename, category, or source URL',
    importedDesc: 'Newest first',
    importedAsc: 'Oldest first',
    titleAsc: 'Title A-Z',
    titleDesc: 'Title Z-A',
    sizeDesc: 'Largest first',
    sizeAsc: 'Smallest first',
    perPage: (count) => `${count} per page`,
    bulkSetCategory: 'Set category',
    applyCategory: 'Apply category',
    deleteSelected: 'Delete selected',
    file: 'File',
    pages: 'Pages',
    images: 'Images',
    size: 'Size',
    importedAt: 'Imported',
    actions: 'Actions',
    previousPage: 'Previous',
    nextPage: 'Next',
    pageInfo: (page, total) => `Page ${page} / ${total}`,
    managerSummary: (total, shown) => `${total} total, ${shown} shown`,
    view: 'View',
    source: 'Source',
    noPapers: 'No papers yet.',
    noMatches: 'No matches.',
    noFolderPath: 'This record has no local file path. Re-import it once to enable opening its folder.',
    folderOpened: 'Opened the paper folder.',
  },
};

let currentPaperId = null;
let lastPdfUrl = null;
let selectedImportFiles = [];
let isManagerOpen = false;
let managerPapers = [];
let managerFilteredPapers = [];
let managerPage = 1;
const managerSelectedIds = new Set();
let apiBase = window.location.protocol === 'file:' ? 'http://localhost:8000' : '';
let currentLang = localStorage.getItem('paper-library-language') || 'zh';
let currentTheme = localStorage.getItem('paper-library-theme') || 'light';

const t = (key, ...args) => {
  const value = messages[currentLang]?.[key] ?? messages.zh[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const setPlaceholder = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.placeholder = value;
  }
};

const applyTheme = () => {
  document.documentElement.dataset.theme = currentTheme;
  const themeValue = themeToggle?.querySelector('strong');
  if (themeValue) {
    themeValue.textContent = currentTheme === 'dark' ? t('themeLight') : t('themeDark');
  }
};

const applyLanguage = () => {
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-CN';
  setText('[data-settings-toggle]', t('settings'));
  setText('[data-theme-toggle] span', t('appearance'));
  setText('[data-lang-toggle] span', t('language'));
  setText('[data-lang-toggle] strong', t('langCurrent'));
  setText('[data-import-module-title]', t('importModule'));
  setText('[data-manage-module-title]', t('manageModule'));
  setText('[data-library-manage]', t('openManager'));
  setText('[data-paper-clear] span', t('clearLibrary'));
  setText('[data-paper-clear] strong', t('clear'));
  setText('.file-drop span', t('importPdf'));
  if (selectedImportFiles.length === 0) {
    paperFileName.textContent = t('choosePapers');
  }
  setText('.secondary-drop', t('importFolder'));
  setText('[data-paper-submit]', t('parseImport'));
  if (!paperStatus.textContent || paperStatus.textContent.includes('准备就绪') || paperStatus.textContent.includes('ready')) {
    setStatus(t('ready'));
  }
  setPlaceholder('[data-paper-text]', t('textPlaceholder'));
  setText('[data-text-import]', t('textImport'));
  setPlaceholder('[data-paper-search]', t('searchPlaceholder'));
  setText('[data-paper-open]', t('openPdf'));
  setText('[data-paper-open-folder]', t('openFolder'));
  setText('[data-paper-delete]', t('delete'));
  setText('[data-paper-save]', t('saveChanges'));
  setText('[data-paper-detail] .eyebrow', t('currentPaper'));
  setText('.editor-card .field:nth-of-type(1) span', t('title'));
  setText('.editor-card .field:nth-of-type(2) span', t('category'));
  setPlaceholder('[data-paper-category]', t('uncategorized'));
  setText('.editor-card .field:nth-of-type(3) span', t('abstract'));
  setText('.source-card .eyebrow', t('original'));
  setText('.figures-section .eyebrow', t('figuresLabel'));
  setText('.figures-section h2', t('figures'));
  setText('[data-empty-state] .eyebrow', t('library'));
  setText('[data-empty-state] h1', t('emptyTitle'));
  setText('[data-empty-state] p:last-child', t('emptyText'));
  setText('[data-manager-pane] .eyebrow', 'Library Manager');
  setText('[data-manager-pane] h1', t('managerTitle'));
  setPlaceholder('[data-manager-search]', t('managerSearchPlaceholder'));
  setPlaceholder('[data-manager-bulk-category]', t('bulkSetCategory'));
  setText('[data-manager-bulk-apply]', t('applyCategory'));
  setText('[data-manager-clear-selection]', t('cancelSelection'));
  setText('[data-manager-bulk-delete]', t('deleteSelected'));
  setText('[data-manager-prev-page]', t('previousPage'));
  setText('[data-manager-next-page]', t('nextPage'));

  const managerHeaders = document.querySelectorAll('.manager-table th');
  [null, t('title'), t('category'), t('file'), t('pages'), t('images'), t('size'), t('importedAt'), t('actions')]
    .forEach((label, index) => {
      if (label && managerHeaders[index]) {
        managerHeaders[index].textContent = label;
      }
    });

  managerSort.options[0].textContent = t('importedDesc');
  managerSort.options[1].textContent = t('importedAsc');
  managerSort.options[2].textContent = t('titleAsc');
  managerSort.options[3].textContent = t('titleDesc');
  managerSort.options[4].textContent = t('sizeDesc');
  managerSort.options[5].textContent = t('sizeAsc');
  [...managerPageSize.options].forEach((option) => {
    option.textContent = t('perPage', option.value);
  });

  applyTheme();
  renderList().catch(() => {});
  if (isManagerOpen) {
    renderManager();
  }
};

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
const getCategory = (paper) => (paper.category || t('uncategorized')).trim() || t('uncategorized');

const getPaperSummaries = async () => {
  const database = await openPaperDB();
  return new Promise((resolve, reject) => {
    const summaries = [];
    const transaction = database.transaction('papers', 'readonly');
    const store = transaction.objectStore('papers');
    const request = store.openCursor();

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) {
        resolve(summaries);
        return;
      }
      const paper = cursor.value;
      summaries.push({
        id: paper.id,
        title: paper.title,
        abstract: paper.abstract,
        original_title: paper.original_title,
        original_abstract: paper.original_abstract,
        authors: paper.authors || [],
        year: paper.year,
        doi: paper.doi,
        arxiv_id: paper.arxiv_id,
        publication: paper.publication,
        publisher: paper.publisher,
        keywords: paper.keywords || [],
        reference_count: paper.reference_count,
        metadata_source: paper.metadata_source,
        metadata_error: paper.metadata_error,
        file_name: paper.file_name,
        source_url: paper.source_url,
        local_file_path: paper.local_file_path,
        category: paper.category,
        page_count: paper.page_count,
        image_count: paper.images?.length || 0,
        file_size: paper.file_size,
        importedAt: paper.importedAt,
        updatedAt: paper.updatedAt,
      });
      cursor.continue();
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
};

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
  return hashBuffer(buffer);
};

const hashBuffer = async (buffer) => {
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
    ...(paper.authors || []),
    ...(paper.keywords || []),
    paper.doi,
    paper.arxiv_id,
    paper.year,
    paper.publication,
    paper.publisher,
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

const metadataLabels = {
  zh: {
    authors: '\u4f5c\u8005',
    year: '\u5e74\u4efd',
    doi: 'DOI',
    arxiv: 'arXiv',
    publication: '\u671f\u520a / \u4f1a\u8bae',
    publisher: '\u51fa\u7248\u65b9',
    keywords: '\u5173\u952e\u8bcd',
    references: '\u53c2\u8003\u6587\u732e',
    source: '\u5143\u6570\u636e\u6765\u6e90',
  },
  en: {
    authors: 'Authors',
    year: 'Year',
    doi: 'DOI',
    arxiv: 'arXiv',
    publication: 'Venue',
    publisher: 'Publisher',
    keywords: 'Keywords',
    references: 'References',
    source: 'Metadata source',
  },
};

const joinPeople = (people = []) => people.filter(Boolean).join(', ');

const metadataValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  return value || '';
};

const paperMetadataRows = (paper) => {
  const labels = metadataLabels[currentLang] || metadataLabels.zh;
  return [
    [labels.authors, joinPeople(paper.authors || [])],
    [labels.year, paper.year],
    [labels.doi, paper.doi],
    [labels.arxiv, paper.arxiv_id],
    [labels.publication, paper.publication],
    [labels.publisher, paper.publisher],
    [labels.keywords, metadataValue(paper.keywords || [])],
    [labels.references, paper.reference_count ? String(paper.reference_count) : ''],
    [labels.source, paper.metadata_source],
  ].filter(([, value]) => value);
};

const renderBibliography = (paper) => {
  if (!paperBibliography) {
    return;
  }
  paperBibliography.replaceChildren();
  paperMetadataRows(paper).forEach(([label, value]) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const detail = document.createElement('dd');
    detail.textContent = value;
    paperBibliography.append(term, detail);
  });
};

const paperMetaLine = (paper) => {
  const parts = [
    getCategory(paper),
    paper.year,
    joinPeople(paper.authors || []),
    paper.file_name,
    `${paper.page_count} \u9875`,
    `${paper.images?.length || 0} \u5f20\u56fe\u7247`,
    formatBytes(paper.file_size),
  ];
  return parts.filter(Boolean).join(' \u00b7 ');
};

const showPaper = async (id) => {
  const paper = await getPaper(id);
  if (!paper) {
    currentPaperId = null;
    paperDetail.hidden = true;
    emptyState.hidden = false;
    managerPane.hidden = true;
    isManagerOpen = false;
    await renderList();
    return;
  }

  isManagerOpen = false;
  currentPaperId = paper.id;
  detailHeading.textContent = paper.title || paper.file_name;
  paperTitle.value = paper.title || '未识别到标题';
  paperCategory.value = getCategory(paper);
  paperAbstract.value = paper.abstract || '未识别到摘要。';
  paperOriginalTitle.textContent = paper.original_title || paper.title || '未识别到标题';
  paperOriginalAbstract.textContent = paper.original_abstract || paper.abstract || '未识别到摘要。';
  paperMeta.textContent = paperMetaLine(paper);
  renderBibliography(paper);
  renderGallery(paper.images);

  const note = paper.translated
    ? `已使用 ${paper.translation_provider || '本地模型'} 翻译。`
    : (paper.translation_error || '当前显示解析出的原文。');
  setManageStatus(note, !paper.translated && Boolean(paper.translation_error));

  paperDetail.hidden = false;
  emptyState.hidden = true;
  managerPane.hidden = true;
  await renderList();
};

async function renderList() {
  const papers = await getPapers();
  const query = paperSearch.value.trim();
  const category = categoryFilter.value;
  const categories = [...new Set(papers.map(getCategory))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  const visiblePapers = papers.filter((paper) => matchesQuery(paper, query) && matchesCategory(paper, category));
  paperCount.textContent = `${papers.length} 篇`;
  paperList.replaceChildren();
  categoryFilter.replaceChildren(new Option(t('allCategories'), ''));
  categoryOptions.replaceChildren();
  categories.forEach((name) => {
    categoryFilter.append(new Option(name, name));
    const option = document.createElement('option');
    option.value = name;
    categoryOptions.append(option);
  });
  categoryFilter.value = categories.includes(category) ? category : '';
  if (visiblePapers.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'list-empty';
    empty.textContent = papers.length === 0 ? t('noPapers') : t('noMatches');
    paperList.append(empty);
    if (papers.length === 0) {
      paperDetail.hidden = true;
      emptyState.hidden = !isManagerOpen;
      managerPane.hidden = !isManagerOpen;
    }
    return;
  }

  visiblePapers.forEach((paper) => {
    const item = document.createElement('article');
    item.className = `paper-list-item${paper.id === currentPaperId ? ' is-active' : ''}`;
    item.dataset.paperId = paper.id;

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
    item.append(openButton);
    paperList.append(item);
  });
}

const formatDate = (timestamp) => {
  if (!timestamp) {
    return '-';
  }
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const managerMatchesQuery = (paper, query) => {
  if (!query) {
    return true;
  }
  const haystack = [
    paper.title,
    paper.abstract,
    paper.original_title,
    paper.original_abstract,
    ...(paper.authors || []),
    ...(paper.keywords || []),
    paper.doi,
    paper.arxiv_id,
    paper.year,
    paper.publication,
    paper.publisher,
    paper.file_name,
    paper.source_url,
    getCategory(paper),
  ].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
};

const compareText = (left, right) => String(left || '').localeCompare(String(right || ''), 'zh-CN');

const sortManagerPapers = (items) => {
  const sortMode = managerSort.value;
  return [...items].sort((left, right) => {
    if (sortMode === 'imported-asc') {
      return (left.importedAt || 0) - (right.importedAt || 0);
    }
    if (sortMode === 'title-asc') {
      return compareText(left.title || left.file_name, right.title || right.file_name);
    }
    if (sortMode === 'title-desc') {
      return compareText(right.title || right.file_name, left.title || left.file_name);
    }
    if (sortMode === 'size-desc') {
      return (right.file_size || 0) - (left.file_size || 0);
    }
    if (sortMode === 'size-asc') {
      return (left.file_size || 0) - (right.file_size || 0);
    }
    return (right.importedAt || 0) - (left.importedAt || 0);
  });
};

const applyManagerFilters = () => {
  const query = managerSearch.value.trim();
  const category = managerCategory.value;
  managerFilteredPapers = sortManagerPapers(
    managerPapers.filter((paper) => managerMatchesQuery(paper, query) && (!category || getCategory(paper) === category)),
  );
  const maxPage = Math.max(1, Math.ceil(managerFilteredPapers.length / Number(managerPageSize.value)));
  managerPage = Math.min(managerPage, maxPage);
};

const renderManagerCategories = () => {
  const current = managerCategory.value;
  const categories = [...new Set(managerPapers.map(getCategory))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  managerCategory.replaceChildren(new Option(t('allCategories'), ''));
  categories.forEach((name) => managerCategory.append(new Option(name, name)));
  managerCategory.value = categories.includes(current) ? current : '';
};

const renderManagerBulk = () => {
  managerBulk.hidden = managerSelectedIds.size === 0;
  managerSelectedSummary.textContent = t('selectedCount', managerSelectedIds.size);
};

const renderManagerRows = () => {
  managerRows.replaceChildren();
  const pageSize = Number(managerPageSize.value);
  const start = (managerPage - 1) * pageSize;
  const pageItems = managerFilteredPapers.slice(start, start + pageSize);

  if (pageItems.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 9;
    cell.className = 'manager-empty';
    cell.textContent = managerPapers.length === 0 ? t('noPapers') : t('noMatches');
    row.append(cell);
    managerRows.append(row);
  }

  pageItems.forEach((paper) => {
    const row = document.createElement('tr');
    row.dataset.paperId = paper.id;

    const checkCell = document.createElement('td');
    checkCell.className = 'check-cell';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = managerSelectedIds.has(paper.id);
    checkbox.dataset.managerSelectPaper = paper.id;
    checkCell.append(checkbox);

    const titleCell = document.createElement('td');
    titleCell.className = 'title-cell';
    const title = document.createElement('strong');
    title.textContent = paper.title || paper.original_title || paper.file_name || t('noPaperSelected');
    const subtitle = document.createElement('span');
    const parsedMeta = [paper.year, joinPeople(paper.authors || []), paper.doi || paper.arxiv_id].filter(Boolean).join(' · ');
    subtitle.textContent = parsedMeta || (paper.original_title && paper.original_title !== paper.title ? paper.original_title : paper.source_url || '');
    titleCell.append(title, subtitle);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = getCategory(paper);

    const fileCell = document.createElement('td');
    fileCell.textContent = paper.file_name || '-';

    const pageCell = document.createElement('td');
    pageCell.textContent = paper.page_count || '-';

    const imageCell = document.createElement('td');
    imageCell.textContent = paper.image_count || 0;

    const sizeCell = document.createElement('td');
    sizeCell.textContent = formatBytes(paper.file_size);

    const dateCell = document.createElement('td');
    dateCell.textContent = formatDate(paper.importedAt);

    const actionCell = document.createElement('td');
    actionCell.className = 'row-actions';
    const viewButton = document.createElement('button');
    viewButton.type = 'button';
    viewButton.className = 'table-action';
    viewButton.dataset.managerViewPaper = paper.id;
    viewButton.textContent = t('view');
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'table-action';
    openButton.dataset.managerOpenPdf = paper.id;
    openButton.textContent = 'PDF';
    const folderButton = document.createElement('button');
    folderButton.type = 'button';
    folderButton.className = 'table-action';
    folderButton.dataset.managerOpenFolder = paper.id;
    folderButton.textContent = t('openFolder');
    folderButton.disabled = !paper.local_file_path;
    const sourceButton = document.createElement('button');
    sourceButton.type = 'button';
    sourceButton.className = 'table-action';
    sourceButton.dataset.managerOpenSource = paper.id;
    sourceButton.textContent = t('source');
    sourceButton.disabled = !paper.source_url;
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'table-action danger';
    deleteButton.dataset.managerDeletePaper = paper.id;
    deleteButton.textContent = t('delete');
    actionCell.append(viewButton, openButton, folderButton, sourceButton, deleteButton);

    row.append(checkCell, titleCell, categoryCell, fileCell, pageCell, imageCell, sizeCell, dateCell, actionCell);
    managerRows.append(row);
  });

  const totalPages = Math.max(1, Math.ceil(managerFilteredPapers.length / pageSize));
  managerPageInfo.textContent = t('pageInfo', managerPage, totalPages);
  managerPrevPage.disabled = managerPage <= 1;
  managerNextPage.disabled = managerPage >= totalPages;
  managerSelectPage.checked = pageItems.length > 0 && pageItems.every((paper) => managerSelectedIds.has(paper.id));
  managerSelectPage.indeterminate = pageItems.some((paper) => managerSelectedIds.has(paper.id)) && !managerSelectPage.checked;
  managerSummary.textContent = t('managerSummary', managerPapers.length, managerFilteredPapers.length);
  renderManagerBulk();
};

const renderManager = () => {
  renderManagerCategories();
  applyManagerFilters();
  renderManagerRows();
};

const loadManager = async () => {
  managerSummary.textContent = t('managerLoading');
  managerPapers = await getPaperSummaries();
  managerSelectedIds.forEach((id) => {
    if (!managerPapers.some((paper) => paper.id === id)) {
      managerSelectedIds.delete(id);
    }
  });
  renderManager();
};

const showManager = async () => {
  isManagerOpen = true;
  paperDetail.hidden = true;
  emptyState.hidden = true;
  managerPane.hidden = false;
  await loadManager();
};

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

settingsToggle?.addEventListener('click', () => {
  settingsPanel.hidden = !settingsPanel.hidden;
});

document.addEventListener('click', (event) => {
  if (!settingsPanel || settingsPanel.hidden) {
    return;
  }
  if (!event.target.closest('.sidebar-settings')) {
    settingsPanel.hidden = true;
  }
});

themeToggle?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('paper-library-theme', currentTheme);
  applyTheme();
});

langToggle?.addEventListener('click', () => {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('paper-library-language', currentLang);
  applyLanguage();
});

const stripTrackingParams = (rawUrl) => {
  const parsed = new URL(rawUrl);
  [...parsed.searchParams.keys()].forEach((key) => {
    if (key.toLowerCase().startsWith('utm_')) {
      parsed.searchParams.delete(key);
    }
  });
  return parsed.toString();
};

const normalizePaperUrl = (rawUrl) => {
  const cleaned = rawUrl.trim().replace(/[)\].,，。；;]+$/g, '');
  const parsed = new URL(cleaned);
  if (parsed.hostname === 'arxiv.org' && parsed.pathname.startsWith('/abs/')) {
    const id = parsed.pathname.replace('/abs/', '').replace(/\.pdf$/i, '');
    parsed.pathname = `/pdf/${id}.pdf`;
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  }
  return stripTrackingParams(parsed.toString());
};

const titleToFileName = (title, fallbackUrl) => {
  const fallback = decodeURIComponent(new URL(fallbackUrl).pathname.split('/').pop() || 'paper.pdf');
  const name = (title || fallback)
    .replace(/\s*\(PDF\)\s*$/i, '')
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const baseName = name || fallback.replace(/\.pdf$/i, '');
  return baseName.toLowerCase().endsWith('.pdf') ? baseName : `${baseName}.pdf`;
};

const extractPaperLinks = (text) => {
  const links = [];
  const seen = new Set();
  const addLink = (url, title = '') => {
    try {
      const normalizedUrl = normalizePaperUrl(url);
      const parsed = new URL(normalizedUrl);
      const isPdf = parsed.pathname.toLowerCase().endsWith('.pdf');
      if (!isPdf || seen.has(normalizedUrl)) {
        return;
      }
      seen.add(normalizedUrl);
      links.push({
        url: normalizedUrl,
        fileName: titleToFileName(title, normalizedUrl),
      });
    } catch {
      // Ignore malformed links in pasted text.
    }
  };

  for (const match of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
    addLink(match[2], match[1]);
  }
  for (const match of text.matchAll(/https?:\/\/[^\s<>"']+/g)) {
    addLink(match[0]);
  }
  return links;
};

const base64ToBlob = (base64, type = 'application/pdf') => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type });
};

const openLocalFolder = async (paper) => {
  if (!paper?.local_file_path) {
    throw new Error(t('noFolderPath'));
  }
  const base = await resolveApiBase();
  const response = await fetch(`${base}/api/open-folder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ local_file_path: paper.local_file_path }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || t('noFolderPath'));
  }
  return data;
};

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

const importOneUrl = async (link, index, total) => {
  setStatus(`(${index + 1}/${total}) 正在下载并解析：${link.fileName}`);
  const base = await resolveApiBase();
  const response = await fetch(`${base}/api/paper-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: link.url,
      file_name: link.fileName,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `PDF 链接导入失败：${link.url}`);
  }

  const pdfBlob = base64ToBlob(data.pdf_base64);
  const pdfBuffer = await pdfBlob.arrayBuffer();
  const id = await hashBuffer(pdfBuffer);
  const existing = await getPaper(id);
  if (existing) {
    return { id, status: 'duplicate' };
  }

  const paper = {
    ...data,
    id,
    importedAt: Date.now(),
    updatedAt: Date.now(),
    file_size: data.file_size || pdfBlob.size,
    folder_path: '',
    category: '网络导入',
    pdf_blob: pdfBlob,
    title: data.title || '未识别到标题',
    abstract: data.abstract || '未识别到摘要。',
    images: data.images || [],
  };
  delete paper.pdf_base64;

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

textImport?.addEventListener('click', async () => {
  const text = paperText.value.trim();
  const links = extractPaperLinks(text);
  if (links.length === 0) {
    setStatus('没有识别到 PDF 链接。请粘贴包含 .pdf 或 arXiv abs 链接的文本。', true);
    return;
  }

  textImport.disabled = true;
  paperText.disabled = true;

  try {
    let imported = 0;
    let duplicates = 0;
    let lastImportedId = null;

    for (let index = 0; index < links.length; index += 1) {
      const result = await importOneUrl(links[index], index, links.length);
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
    setStatus(`文本导入完成：新增 ${imported} 篇，跳过重复 ${duplicates} 篇。`);
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : '文本导入失败。';
    const message = rawMessage === 'Failed to fetch'
      ? '无法连接本地解析服务。请先启动 PaperLibrary.exe，或运行 python server.py 后打开 http://localhost:8000。'
      : rawMessage;
    setStatus(message, true);
  } finally {
    textImport.disabled = false;
    paperText.disabled = false;
  }
});

paperList?.addEventListener('click', async (event) => {
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

libraryManage?.addEventListener('click', () => {
  showManager().catch((error) => setStatus(`无法打开论文管理：${error instanceof Error ? error.message : error}`, true));
});

managerSearch?.addEventListener('input', () => {
  managerPage = 1;
  renderManager();
});

managerCategory?.addEventListener('change', () => {
  managerPage = 1;
  renderManager();
});

managerSort?.addEventListener('change', renderManager);

managerPageSize?.addEventListener('change', () => {
  managerPage = 1;
  renderManager();
});

managerPrevPage?.addEventListener('click', () => {
  managerPage = Math.max(1, managerPage - 1);
  renderManagerRows();
});

managerNextPage?.addEventListener('click', () => {
  const totalPages = Math.max(1, Math.ceil(managerFilteredPapers.length / Number(managerPageSize.value)));
  managerPage = Math.min(totalPages, managerPage + 1);
  renderManagerRows();
});

managerSelectPage?.addEventListener('change', () => {
  const pageSize = Number(managerPageSize.value);
  const start = (managerPage - 1) * pageSize;
  const pageItems = managerFilteredPapers.slice(start, start + pageSize);
  pageItems.forEach((paper) => {
    if (managerSelectPage.checked) {
      managerSelectedIds.add(paper.id);
    } else {
      managerSelectedIds.delete(paper.id);
    }
  });
  renderManagerRows();
});

managerRows?.addEventListener('click', async (event) => {
  const checkbox = event.target.closest('[data-manager-select-paper]');
  if (checkbox) {
    if (checkbox.checked) {
      managerSelectedIds.add(checkbox.dataset.managerSelectPaper);
    } else {
      managerSelectedIds.delete(checkbox.dataset.managerSelectPaper);
    }
    renderManagerRows();
    return;
  }

  const viewButton = event.target.closest('[data-manager-view-paper]');
  if (viewButton) {
    await showPaper(viewButton.dataset.managerViewPaper);
    return;
  }

  const openButton = event.target.closest('[data-manager-open-pdf]');
  if (openButton) {
    const paper = await getPaper(openButton.dataset.managerOpenPdf);
    if (!paper?.pdf_blob) {
      setStatus('这条记录没有保存原始 PDF。', true);
      return;
    }
    if (lastPdfUrl) {
      URL.revokeObjectURL(lastPdfUrl);
    }
    lastPdfUrl = URL.createObjectURL(paper.pdf_blob);
    window.open(lastPdfUrl, '_blank', 'noopener');
    return;
  }

  const sourceButton = event.target.closest('[data-manager-open-source]');
  if (sourceButton) {
    const paper = managerPapers.find((item) => item.id === sourceButton.dataset.managerOpenSource);
    if (paper?.source_url) {
      window.open(paper.source_url, '_blank', 'noopener');
    }
    return;
  }

  const folderButton = event.target.closest('[data-manager-open-folder]');
  if (folderButton) {
    const paper = managerPapers.find((item) => item.id === folderButton.dataset.managerOpenFolder);
    try {
      await openLocalFolder(paper);
      setStatus(t('folderOpened'));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t('noFolderPath'), true);
    }
    return;
  }

  const deleteButton = event.target.closest('[data-manager-delete-paper]');
  if (deleteButton && confirm('确定删除这篇论文吗？')) {
    await removePaper(deleteButton.dataset.managerDeletePaper);
    managerSelectedIds.delete(deleteButton.dataset.managerDeletePaper);
    await renderList();
    await loadManager();
  }
});

managerBulkApply?.addEventListener('click', async () => {
  const category = managerBulkCategory.value.trim();
  if (!category || managerSelectedIds.size === 0) {
    return;
  }

  for (const id of managerSelectedIds) {
    const paper = await getPaper(id);
    if (paper) {
      paper.category = category;
      paper.updatedAt = Date.now();
      await savePaper(paper);
    }
  }
  managerBulkCategory.value = '';
  await renderList();
  await loadManager();
  setStatus(`已将 ${managerSelectedIds.size} 篇论文归类为「${category}」。`);
});

managerBulkDelete?.addEventListener('click', async () => {
  if (managerSelectedIds.size === 0 || !confirm(`确定删除选中的 ${managerSelectedIds.size} 篇论文吗？`)) {
    return;
  }

  const deleted = managerSelectedIds.size;
  for (const id of managerSelectedIds) {
    await removePaper(id);
  }
  managerSelectedIds.clear();
  await renderList();
  await loadManager();
  setStatus(`已删除 ${deleted} 篇论文。`);
});

managerClearSelection?.addEventListener('click', () => {
  managerSelectedIds.clear();
  renderManagerRows();
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

paperOpenFolder?.addEventListener('click', async () => {
  if (!currentPaperId) {
    return;
  }
  const paper = await getPaper(currentPaperId);
  try {
    await openLocalFolder(paper);
    setManageStatus(t('folderOpened'));
  } catch (error) {
    setManageStatus(error instanceof Error ? error.message : t('noFolderPath'), true);
  }
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
  managerSelectedIds.clear();
  currentPaperId = null;
  paperDetail.hidden = true;
  emptyState.hidden = isManagerOpen;
  managerPane.hidden = !isManagerOpen;
  await renderList();
  if (isManagerOpen) {
    await loadManager();
  }
  setStatus('论文库已清空。');
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

applyLanguage();
renderList().catch(() => setStatus('无法打开本地论文库。', true));
