// O site nem sempre é servido na raiz: os previews de PR vivem em /pr/<n>/.
// Tudo o que dependa do sítio onde a aplicação está montada sai daqui.

const base = import.meta.env.BASE_URL

export const cvUrl = `${base}Sergio-Almeida-CV.pdf`

export const isHome = (pathname: string) =>
  pathname === base || pathname === `${base}index.html`
