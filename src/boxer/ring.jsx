// components/Ring.tsx
import { useGLTF } from '@react-three/drei'

export function Ring() {
  const { scene } = useGLTF('scene.gltf')

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}
