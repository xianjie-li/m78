import { createSeed } from 'm78/seed';

var m78Config = createSeed({
  state: {
    darkMode: false
  }
});
m78Config.subscribe(function (_ref) {
  var darkMode = _ref.darkMode;

  if (typeof window !== 'undefined' && window.document) {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }
});

export { m78Config };
