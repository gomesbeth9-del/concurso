// viewer.js - visualizador mínimo usando PDF.js
// Depende de pdfjsLib carregado via CDN (pdf.min.js)

(function(){
  // configura worker (ajuste para versão do CDN)
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.10.139/build/pdf.worker.min.js';
  }

  const state = {
    pdfDoc: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.0,
    url: null
  };

  const canvas = document.getElementById('pdf-render');
  const ctx = canvas.getContext('2d');
  const pageNumInput = document.getElementById('page-num');
  const pageCount = document.getElementById('page-count');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const zoomIn = document.getElementById('zoom-in');
  const zoomOut = document.getElementById('zoom-out');
  const zoomLevel = document.getElementById('zoom-level');
  const downloadLink = document.getElementById('download-link');
  const openNew = document.getElementById('open-new');
  const htmlIframe = document.getElementById('html-iframe');
  const pdfMessage = document.getElementById('pdf-message');

  function showMessage(msg){
    pdfMessage.textContent = msg;
    pdfMessage.style.display = '';
    canvas.style.display = 'none';
    htmlIframe.style.display = 'none';
  }
  function hideMessage(){
    pdfMessage.style.display = 'none';
  }

  async function renderPage(num){
    state.pageRendering = true;
    hideMessage();
    const page = await state.pdfDoc.getPage(num);
    const viewport = page.getViewport({scale: state.scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // render
    const renderCtx = {
      canvasContext: ctx,
      viewport: viewport
    };
    const renderTask = page.render(renderCtx);
    await renderTask.promise;
    state.pageRendering = false;

    if (state.pageNumPending !== null) {
      const next = state.pageNumPending;
      state.pageNumPending = null;
      renderPage(next);
    }
  }

  function queueRenderPage(num){
    if (state.pageRendering) {
      state.pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage(){
    if (state.pageNum <= 1) return;
    state.pageNum--;
    pageNumInput.value = state.pageNum;
    queueRenderPage(state.pageNum);
  }
  function onNextPage(){
    if (state.pdfDoc && state.pageNum >= state.pdfDoc.numPages) return;
    state.pageNum++;
    pageNumInput.value = state.pageNum;
    queueRenderPage(state.pageNum);
  }

  function onZoomIn(){
    state.scale = Math.min(3.0, state.scale + 0.25);
    zoomLevel.textContent = Math.round(state.scale * 100) + '%';
    queueRenderPage(state.pageNum);
  }
  function onZoomOut(){
    state.scale = Math.max(0.5, state.scale - 0.25);
    zoomLevel.textContent = Math.round(state.scale * 100) + '%';
    queueRenderPage(state.pageNum);
  }

  async function loadPDF(url){
    try{
      htmlIframe.style.display = 'none';
      canvas.style.display = '';
      pdfMessage.style.display = 'none';
      state.url = url;
      // set download link
      downloadLink.href = url;
      openNew.onclick = () => window.open(url, '_blank');

      // fetch and load
      const loadingTask = pdfjsLib.getDocument(url);
      state.pdfDoc = await loadingTask.promise;
      state.pageNum = 1;
      pageCount.textContent = '/ ' + state.pdfDoc.numPages;
      pageNumInput.value = state.pageNum;
      state.scale = 1.0;
      zoomLevel.textContent = Math.round(state.scale * 100) + '%';
      // render first
      await renderPage(state.pageNum);
    } catch(err){
      console.error('Erro ao carregar PDF', err);
      showMessage('Erro ao carregar PDF. Verifique se o arquivo existe.');
    }
  }

  function loadHTML(url){
    // mostra iframe e carrega
    canvas.style.display = 'none';
    htmlIframe.style.display = '';
    pdfMessage.style.display = 'none';
    htmlIframe.src = url;
    downloadLink.href = url;
    openNew.onclick = () => window.open(url, '_blank');
  }

  // liga eventos
  prevBtn && prevBtn.addEventListener('click', onPrevPage);
  nextBtn && nextBtn.addEventListener('click', onNextPage);
  zoomIn && zoomIn.addEventListener('click', onZoomIn);
  zoomOut && zoomOut.addEventListener('click', onZoomOut);
  pageNumInput && pageNumInput.addEventListener('change', (e)=>{
    let val = parseInt(e.target.value,10)||1;
    val = Math.min(Math.max(1,val), state.pdfDoc ? state.pdfDoc.numPages : val);
    state.pageNum = val;
    pageNumInput.value = val;
    queueRenderPage(val);
  });

  // expose minimal API
  window.viewer = {
    loadPDF,
    loadHTML
  };

  // initial message
  showMessage('Selecione um documento à esquerda para visualizar.');
})();
