(function(){
  try {
    var hasWindow = (typeof window !== 'undefined');
    var fromStorage = (hasWindow && typeof localStorage !== 'undefined') ? localStorage.getItem('API_BASE') : null;
    // Padrão: sempre usar API da nuvem, a menos que o usuário defina override no localStorage
    var PROD = 'https://controledecontratos-production.up.railway.app';
    window.API_BASE = fromStorage || PROD;
  } catch (e) {
    // Fallback seguro
    // eslint-disable-next-line no-undef
    window.API_BASE = window.API_BASE || 'https://controledecontratos-production.up.railway.app';
  }
})();
