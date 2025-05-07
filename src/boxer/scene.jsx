import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const texturePaths = [
  '/textures/space_asteroids_02_l_0001_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0002_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0003_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0004_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0005_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0006_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0007_baseColor.jpeg',
  '/textures/space_asteroids_02_l_0008_baseColor.jpeg',
]

function Asteroid({ mesh, texture, position, scale }) {
  const ref = useRef()
  const rotationAxis = useMemo(() => new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), [])

  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.1
    ref.current.rotation.y += delta * 0.1
    ref.current.rotateOnAxis(rotationAxis, 0.002)

    ref.current.position.y -= delta * 2
    if (ref.current.position.y < -30) {
      ref.current.position.y = 30 + Math.random() * 10
    }
  })

  return (
    <primitive
      object={mesh.clone()}
      ref={ref}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial attach="material" map={texture} flatShading />
    </primitive>
  )
}

export function AsteroidRain({ count = 100 }) {
  const { nodes } = useGLTF('scene.gltf')
  const loadedTextures = useTexture(texturePaths)

  // Sécurité : attendre que les données soient prêtes
  const meshes = useMemo(() => {
    return nodes ? Object.values(nodes).filter((n) => n.isMesh) : []
  }, [nodes])

  const asteroids = useMemo(() => {
    if (!meshes.length || !loadedTextures.length) return []

    return Array.from({ length: count }, () => ({
      mesh: meshes[Math.floor(Math.random() * meshes.length)],
      texture: loadedTextures[Math.floor(Math.random() * loadedTextures.length)],
      position: [
        (Math.random() - 0.5) * 50,
        Math.random() * 60,
        (Math.random() - 0.5) * 50,
      ],
      scale: Math.random() * 2 + 0.5,
    }))
  }, [meshes, loadedTextures, count])

  return (
    <>
      {asteroids.map((props, i) => (
        <Asteroid key={i} {...props} />
      ))}
    </>
  )
}
