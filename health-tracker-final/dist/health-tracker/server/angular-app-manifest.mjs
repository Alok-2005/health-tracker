
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
    'index.csr.html': {size: 24720, hash: '3dfc5c073b9c9452042a94a542e8f4db9339ee1be21605d7bdf7a26cbdf68a72', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1032, hash: '894640e754f7ab6a8060ddce349525c3a9008fee62178b32fb8e025807d00e2d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 144228, hash: '07baa2441743b8553c4b3c7f972ae920f20adf7d3a5d24b1cb50ee5c8927a797', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-ZBNXGDKG.css': {size: 33343, hash: 'SOzW9cw5QlY', text: () => import('./assets-chunks/styles-ZBNXGDKG_css.mjs').then(m => m.default)}
  },
};
