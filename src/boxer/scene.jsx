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

function Asteroid({ mesh, position, scale }) {
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
      object={mesh}
      ref={ref}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    />
  )
}

export function AsteroidRain({ count = 100 }) {
  // Charger les textures d'astéroïdes
  const loadedTextures = useTexture(texturePaths)
  
  // Créer des géométries d'astéroïdes simples
  const asteroidGeometries = useMemo(() => [
    new THREE.IcosahedronGeometry(1, 0), // Forme d'astéroïde simple
    new THREE.DodecahedronGeometry(1, 0), // Autre forme d'astéroïde
    new THREE.TetrahedronGeometry(1, 0), // Forme plus angulaire
    new THREE.OctahedronGeometry(1, 0), // Encore une autre forme
  ], [])

  // Créer les données pour chaque astéroïde
  const asteroids = useMemo(() => {
    if (!loadedTextures.length) return []

    return Array.from({ length: count }, () => ({
      // Utiliser une géométrie aléatoire au lieu d'un mesh du modèle GLTF
      mesh: new THREE.Mesh(
        asteroidGeometries[Math.floor(Math.random() * asteroidGeometries.length)],
        new THREE.MeshStandardMaterial({ map: loadedTextures[Math.floor(Math.random() * loadedTextures.length)] })
      ),
      position: [
        (Math.random() - 0.5) * 50,
        Math.random() * 60,
        (Math.random() - 0.5) * 50,
      ],
      scale: Math.random() * 2 + 0.5,
    }))
  }, [asteroidGeometries, loadedTextures, count])

  return (
    <>
      {asteroids.map((props, i) => (
        <Asteroid key={i} {...props} />
      ))}
    </>
  )
}
