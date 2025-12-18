(function () {
  var PROD = 'https://controledecontratos-production.up.railway.app';
  var LOCAL = 'http://localhost:8081';

  function detectLocalHost() {
    if (typeof window === 'undefined' || !window.location) return true;
    var host = (window.location.hostname || '').toLowerCase();
    if (!host) return true;
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;
    if (host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) return true;
    return false;
  }

  try {
    var hasWindow = typeof window !== 'undefined';
    var fromStorage =
      hasWindow && typeof localStorage !== 'undefined'
        ? localStorage.getItem('API_BASE')
        : null;

    if (fromStorage) {
      window.API_BASE = fromStorage;
      return;
    }

    window.API_BASE = detectLocalHost() ? LOCAL : PROD;
  } catch (e) {
    window.API_BASE = window.API_BASE || LOCAL;
  }
})();


