// Local: /new e /new/ activam a preview.
// PR preview em staging: o site inteiro é servido sob /pr/N/ — toda a página é a versão nova.
export const isPreview =
  ['/new', '/new/'].includes(window.location.pathname) ||
  /^\/pr\/\d+\//.test(window.location.pathname)
