
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
    'index.csr.html': {size: 24748, hash: 'cc6bbe39c3beccfd2e51ac0c329f8599fef78e6e1a5faaf83546a46a57962cb1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1032, hash: 'ff95a240143369229c849645b88ddfcd2004c7b71b4efe17ccf7d88c72e8dbf2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 160477, hash: '3438218f36a051cd5e6a74faef0b1d3807c9239e524e5b1a2088ac55b913165f', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-MJJJH4US.css': {size: 34379, hash: 'eLt8XhPXAd4', text: () => import('./assets-chunks/styles-MJJJH4US_css.mjs').then(m => m.default)}
  },
};
