(function () {
  function getCurrentPage() {
    try {
      var path = window.location.pathname || '';
      var parts = path.split('/').filter(Boolean);
      return (parts[parts.length - 1] || 'index.html').toLowerCase();
    } catch (e) {
      return 'index.html';
    }
  }

  function setActiveNavItem() {
    var current = getCurrentPage();
    var links = document.querySelectorAll('.nav-menu a.nav-item[href]');
    if (!links || links.length === 0) return;

    var activeTarget = current;
    var moduleMap = {
      'contratos.html': 'contratos-modulo.html',
      'novo-contrato.html': 'contratos-modulo.html',
      'novo-centro.html': 'centros-modulo.html',
      'nova-conta.html': 'contas-modulo.html',
      'centros.html': 'centros-modulo.html',
      'contas.html': 'contas-modulo.html',
      'relatorio.html': 'relatorios-modulo.html',
      'dashboard.html': 'relatorios-modulo.html'
    };
    if (moduleMap[current]) activeTarget = moduleMap[current];

    links.forEach(function (a) {
      a.classList.remove('active');
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (!href) return;
      if (href === activeTarget) a.classList.add('active');
      if ((activeTarget === '' || activeTarget === 'index.html') && href === 'index.html') a.classList.add('active');
    });

    if (current === 'dashboard.html') {
      var dashboardLink = document.querySelector('.nav-menu a.nav-item[href="index.html"]');
      if (dashboardLink) dashboardLink.classList.add('active');
    }
  }

  function setupSidebarToggle() {
    var sidebar = document.getElementById('sidebar');
    var btn = document.getElementById('btnToggleSidebar');
    if (!sidebar || !btn) return;

    btn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') sidebar.classList.remove('open');
    });

    document.querySelectorAll('.nav-menu a.nav-item').forEach(function (a) {
      a.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    });
  }

  function setTopbarTitleFromH1() {
    var titleEl = document.getElementById('topbarTitle');
    if (!titleEl) return;

    var h1 = document.querySelector('.header h1');
    if (!h1) h1 = document.querySelector('h1');
    if (!h1) return;

    var txt = (h1.textContent || '').trim();
    if (txt) titleEl.textContent = txt;
  }

  document.addEventListener('DOMContentLoaded', function () {
    setActiveNavItem();
    setupSidebarToggle();
    setTopbarTitleFromH1();
  });
})();
