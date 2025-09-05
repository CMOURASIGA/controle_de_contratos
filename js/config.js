(function(){
  try {
    var stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('API_BASE') : null;
    if (stored) window.API_BASE = stored;
    if (!window.API_BASE) {
      window.API_BASE = 'https://controledecontratos-production.up.railway.app';
    }
  } catch (e) {
    window.API_BASE = window.API_BASE || 'https://controledecontratos-production.up.railway.app';
  }
})();

