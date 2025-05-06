// components/BoxingGloves.tsx
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

export function BoxingGloves() {
  const { scene } = useGLTF("scene.gltf") 

  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={scene} scale={0.5} position={[0, 1, -2]} />
    </RigidBody>
  )
}
