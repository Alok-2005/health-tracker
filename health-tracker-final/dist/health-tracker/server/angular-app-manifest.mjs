
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24748, hash: '1e1a026e806f6c9b245612375c3d2df1822f1a7e213ee6113fdf5fa1c385141e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1032, hash: 'bb253ee9cea9878e27acd2d4d177b9f1689361eb5b146994cbda390ced357ed0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 160477, hash: '2b320df006d46bf379c6ffa39cf50d621701ea5093645474b658ca79a36e33a8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-XAFF36S5.css': {size: 34412, hash: 'tkFMq2GOzfQ', text: () => import('./assets-chunks/styles-XAFF36S5_css.mjs').then(m => m.default)}
  },
};
