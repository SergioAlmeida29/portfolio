import { Float } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

/**
 * Placeholder da cena 3D — um sólido a flutuar.
 * Substituir pelo modelo .glb (portátil) na próxima fase.
 */
export function Scene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial color="#e5e5e5" flatShading roughness={0.35} />
        </mesh>
      </Float>
    </Canvas>
  )
}
