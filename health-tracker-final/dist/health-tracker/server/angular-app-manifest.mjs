
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
    'index.csr.html': {size: 24109, hash: '125231b297db8509ee936d71d6571e49eb0b0769d101f902dff629cd8140d92e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1032, hash: '1f3bf6fa9dad5082afd8fc44349548162e07a5a9c96a040a68f4b2fef6789290', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 143585, hash: 'fb6e5b244b33041aea31c425e18a5e1af8565e26317991bd6edd24a440b9112d', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-55PZ6X6H.css': {size: 30622, hash: '+xXV/8jJuHs', text: () => import('./assets-chunks/styles-55PZ6X6H_css.mjs').then(m => m.default)}
  },
};
