import { useGLTF, useTexture } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useEffect } from 'react'
import * as THREE from 'three'

export function BoxingGloves() {
  const { scene } = useGLTF('/models/scene.gltf') 

  const [baseColor, roughnessMetalness, normalMap] = useTexture([
    '/models/textures/manche_baseColor.png',
    '/models/textures/manche_metallicRoughness.png',
    '/models/textures/manche_normal.png',
  ])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: baseColor,
          roughnessMap: roughnessMetalness,
          normalMap,
          metalness: 0.5,
          roughness: 1.0,
        })
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene, baseColor, roughnessMetalness, normalMap])

  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={scene} scale={2} position={[0, 1.2, 0]} />
    </RigidBody>
  )
}