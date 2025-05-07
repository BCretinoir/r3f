import { useTexture } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import * as THREE from 'three'

export function BoxingGloves() {
  // Utiliser les textures d'astéroïdes disponibles
  const [baseColor] = useTexture([
    '/textures/space_asteroids_02_l_0001_baseColor.jpeg',
  ])

  // Créer une géométrie simple pour représenter les gants de boxe
  const boxingGeometry = useMemo(() => new THREE.TorusGeometry(3, 1, 16, 32), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    map: baseColor,
    metalness: 0.5,
    roughness: 1.0,
  }), [baseColor])

  return (
    <RigidBody colliders="hull" type="fixed">
      <mesh 
        geometry={boxingGeometry} 
        material={material} 
        scale={1} 
        position={[0, 1.2, 0]}
        castShadow 
        receiveShadow
      />
    </RigidBody>
  )
}