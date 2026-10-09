import { createSpecularAlphaMap } from './specular-map'

type SpecularMapRequest = {
  id: number
  width: number
  height: number
  borderRadius: number
  optics: Parameters<typeof createSpecularAlphaMap>[3]
}

const scope = globalThis as unknown as {
  onmessage: (event: MessageEvent<SpecularMapRequest>) => void
  postMessage: (message: unknown, transfer: Transferable[]) => void
}

scope.onmessage = ({ data }) => {
  const alpha = createSpecularAlphaMap(data.width, data.height, data.borderRadius, data.optics)
  scope.postMessage({ id: data.id, alpha: alpha.buffer }, [alpha.buffer as ArrayBuffer])
}
