import { useEffect, useRef } from 'react'

const VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }'

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 st = vec2(uv.x * ar, uv.y);

  float perto = exp(-distance(st, vec2(u_mouse.x * ar, u_mouse.y)) * 3.4) * u_hover;

  vec2 p = mod(st * 5.5, 6.2831853) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.0046 + perto * 0.0008;

  for (int n = 0; n < 5; n++){
    float t = u_time * 0.115 * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
  }

  c /= 5.0;
  c = 1.17 - pow(c, 1.35);
  float luz = pow(abs(c), 7.0);

  vec2 d = (uv - vec2(0.5, 0.86)) / vec2(1.35, 1.0);
  float mask = 1.0 - smoothstep(0.20, 0.80, length(d));

  float a = clamp(luz * mask * (0.42 + perto * 0.3), 0.0, 0.5);
  vec3 tint = mix(vec3(0.247, 0.663, 0.878), vec3(0.686, 0.886, 1.0), luz);

  gl_FragColor = vec4(tint * a, a);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    return null
  }

  return shader
}

export function Water() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const context = el.getContext('webgl', {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!context) return

    const canvas = el
    const gl = context

    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
    if (!precision || precision.precision === 0) return

    const program = gl.createProgram()
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!program || !vs || !fs) return

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const attr = gl.getAttribLocation(program, 'a')
    gl.enableVertexAttribArray(attr)
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uHover = gl.getUniformLocation(program, 'u_hover')

    document.documentElement.dataset.water = 'gl'

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let mouseX = 0.5
    let mouseY = 0.7
    let hover = 0
    let target = 0
    let frame = 0

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.25)
      canvas.width = Math.round(innerWidth * dpr)
      canvas.height = Math.round(innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    function draw(now: number) {
      hover += (target - hover) * 0.06
      gl.uniform1f(uTime, now / 1000)
      gl.uniform2f(uMouse, mouseX, mouseY)
      gl.uniform1f(uHover, hover)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    function loop(now: number) {
      draw(now)
      frame = requestAnimationFrame(loop)
    }

    function onPointerMove(event: PointerEvent) {
      mouseX = event.clientX / innerWidth
      mouseY = 1 - event.clientY / innerHeight
      target = 1
    }

    function onPointerLeave() {
      target = 0
    }

    function onResize() {
      resize()
      draw(performance.now())
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (!frame && !reduced.matches) {
        frame = requestAnimationFrame(loop)
      }
    }

    addEventListener('pointermove', onPointerMove, { passive: true })
    addEventListener('resize', onResize, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    resize()
    if (reduced.matches) draw(performance.now())
    else frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('pointermove', onPointerMove)
      removeEventListener('resize', onResize)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      delete document.documentElement.dataset.water
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[3] h-full w-full"
    />
  )
}
