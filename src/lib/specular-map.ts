import type { GlassOptics } from '@samasante/liquid-glass'

/*!
 * B-channel algorithm adapted from @samasante/liquid-glass 0.1.1.
 * MIT License
 * Copyright (c) 2026 Sam Asante
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Published GlassMaterial defaults; displacement-only parameters do not affect B.
export const specularDefaults = {
  mapSize: 512, clipToShape: true, softEdge: true, depth: 0.5,
  sheenAngle: 45, sheen: 0.32, sheenWidth: 3, sheenFalloff: 1.5,
  glow: 0.1, glowSpread: 1, glowFalloff: 0.5,
  specular: 1, frost: 6, saturate: 1.15, brightness: 0,
} satisfies Partial<GlassOptics>

const specularMapCache = new Map<string, string>()
const specularMapPending = new Map<string, Promise<string>>()
const maxCachedSpecularMaps = 16
const workerRequests = new Map<number, { resolve: (alpha: Uint8ClampedArray) => void; reject: (error: Error) => void }>()
let specularWorker: Worker | null = null
let workerRequestId = 0
let workerUnavailable = false

function specularMapKey(width: number, height: number, borderRadius: number, optics: Partial<GlassOptics>) {
  const o = { ...specularDefaults, ...optics }
  return [
    Math.max(1, Math.round(width)), Math.max(1, Math.round(height)), Math.max(0, Math.round(borderRadius)),
    o.mapSize, o.clipToShape, o.softEdge, o.depth, o.sheenAngle, o.sheen, o.sheenWidth,
    o.sheenFalloff, o.glow, o.glowSpread, o.glowFalloff,
  ].join('|')
}

function encode(canvas: HTMLCanvasElement) {
  if (typeof canvas.toBlob !== 'function') return Promise.resolve(canvas.toDataURL('image/png'))
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Não foi possível codificar a máscara especular'))
        return
      }
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error ?? new Error('Não foi possível ler a máscara especular'))
      reader.readAsDataURL(blob)
    }, 'image/png')
  })
}

function getSpecularWorker() {
  if (workerUnavailable || typeof Worker === 'undefined') return null
  if (specularWorker) return specularWorker
  try {
    specularWorker = new Worker(new URL('./specular-map.worker.ts', import.meta.url), { type: 'module' })
    specularWorker.onmessage = (event: MessageEvent<{ id: number; alpha: ArrayBuffer }>) => {
      const request = workerRequests.get(event.data.id)
      if (!request) return
      workerRequests.delete(event.data.id)
      request.resolve(new Uint8ClampedArray(event.data.alpha))
    }
    specularWorker.onerror = () => {
      workerUnavailable = true
      specularWorker?.terminate()
      specularWorker = null
      const error = new Error('Worker da máscara especular indisponível')
      for (const request of workerRequests.values()) request.reject(error)
      workerRequests.clear()
    }
    return specularWorker
  } catch {
    workerUnavailable = true
    return null
  }
}

function renderAlpha(width: number, height: number, borderRadius: number, optics: Partial<GlassOptics>) {
  const worker = getSpecularWorker()
  if (!worker) return Promise.resolve(createSpecularAlphaMap(width, height, borderRadius, optics))
  const id = ++workerRequestId
  return new Promise<Uint8ClampedArray>((resolve, reject) => {
    workerRequests.set(id, { resolve, reject })
    worker.postMessage({ id, width, height, borderRadius, optics })
  }).catch(() => createSpecularAlphaMap(width, height, borderRadius, optics))
}

function renderSpecularMap(width: number, height: number, borderRadius: number, optics: Partial<GlassOptics>) {
  return new Promise<string>((resolve, reject) => {
    requestAnimationFrame(() => {
      try {
        const o = { ...specularDefaults, ...optics }
        const size = o.mapSize
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = size
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Canvas 2D indisponível para a máscara especular'))
          return
        }
        void renderAlpha(width, height, borderRadius, o).then((alpha) => {
          const image = context.createImageData(size, size)
          image.data.fill(255)
          for (let i = 0; i < alpha.length; i++) image.data[i * 4 + 3] = alpha[i]
          context.putImageData(image, 0, 0)
          return encode(canvas)
        }).then(resolve, reject)
      } catch (error) {
        reject(error)
      }
    })
  })
}

export function getSpecularMap(
  width: number, height: number, borderRadius: number, optics: Partial<GlassOptics> = {},
) {
  const key = specularMapKey(width, height, borderRadius, optics)
  const cached = specularMapCache.get(key)
  if (cached) {
    specularMapCache.delete(key)
    specularMapCache.set(key, cached)
    return Promise.resolve(cached)
  }
  const pending = specularMapPending.get(key)
  if (pending) return pending

  const o = { ...specularDefaults, ...optics }
  const request = renderSpecularMap(
    Math.max(1, Math.round(width)), Math.max(1, Math.round(height)), Math.max(0, Math.round(borderRadius)), o,
  )
  specularMapPending.set(key, request)
  void request.then((url) => {
    specularMapPending.delete(key)
    specularMapCache.set(key, url)
    while (specularMapCache.size > maxCachedSpecularMaps) specularMapCache.delete(specularMapCache.keys().next().value!)
  }, () => {
    specularMapPending.delete(key)
  })
  return request
}

const sdf = (x: number, y: number, radius: number) => {
  const ox = Math.max(x, 0), oy = Math.max(y, 0)
  return (ox > 0 || oy > 0 ? Math.sqrt(ox * ox + oy * oy) : 0)
    + Math.min(Math.max(x, y), 0) - radius
}

/** Row-major 8-bit alpha, exactly the published blue byte minus 128. No DOM. */
export function createSpecularAlphaMap(
  width: number, height: number, borderRadius: number, optics: Partial<GlassOptics> = {},
): Uint8ClampedArray {
  const o = { ...specularDefaults, ...optics }
  const size = o.mapSize, half = size >> 1
  const alpha = new Uint8ClampedArray(size * size)
  if (width <= 0 || height <= 0 || (o.glow <= 0 && o.sheen <= 0)) return alpha
  const halfW = width / 2, halfH = height / 2
  const minHalf = Math.min(halfW, halfH), radius = Math.min(borderRadius, minHalf)
  const depthPx = Math.min(o.depth * minHalf, minHalf - 1)
  const innerW = Math.max(0, halfW - depthPx), innerH = Math.max(0, halfH - depthPx)
  const innerRadius = Math.max(0, Math.min(borderRadius, Math.min(innerW, innerH)))
  const falloff = depthPx > 0 ? Math.SQRT1_2 / depthPx : 1e6
  const angle = o.sheenAngle * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle)
  const edgeInv = o.sheenWidth > 0 ? 1 / o.sheenWidth : 0
  const glowInv = 1 / Math.max(2, o.glowSpread * minHalf)
  const stepX = 2 * halfW / size, stepY = 2 * halfH / size
  const invW = 1 / halfW, invH = 1 / halfH
  for (let row = 0; row < half; row++) {
    const py = -((row + 0.5) * stepY - halfH), normY = Math.min(1, py * invH)
    for (let col = 0; col < half; col++) {
      const px = -((col + 0.5) * stepX - halfW), normX = Math.min(1, px * invW)
      const distance = sdf(px - halfW + radius, py - halfH + radius, radius)
      if (o.clipToShape && distance >= 0) continue
      const inner = sdf(px - innerW + innerRadius, py - innerH + innerRadius, innerRadius)
      const edgeOpacity = o.softEdge ? 0.5 * (1 + Math.tanh(Math.sqrt(Math.PI) * (inner * falloff))) : 1
      const main = Math.min(1, Math.abs(normX * cos + normY * sin) * Math.SQRT1_2)
      const cross = Math.min(1, Math.abs(normX * cos - normY * sin) * Math.SQRT1_2)
      const band = distance < 0 ? Math.max(0, 1 + distance * edgeInv) : 0
      const sheen = o.sheen > 0 ? o.sheen * Math.pow(band, o.sheenFalloff) : 0
      const t = 1 - (distance < 0 ? Math.min(1, -distance * glowInv) : 1)
      const glow = o.glow > 0 ? o.glow * Math.pow(t * t * (3 - 2 * t), o.glowFalloff) * edgeOpacity : 0
      const encode = (axis: number) => Math.round(128 + 127 * Math.min(1, Math.max(-1,
        sheen * (0.16 + 0.84 * Math.pow(axis, 1.6)) + glow * (0.6 + 0.4 * axis),
      ))) - 128
      alpha[row * size + col] = alpha[(size - 1 - row) * size + size - 1 - col] = encode(main)
      alpha[row * size + size - 1 - col] = alpha[(size - 1 - row) * size + col] = encode(cross)
    }
  }
  return alpha
}
