import { useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState } from 'react'
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

function Asteroid({ mesh, texture, position, scale, direction, rotationSpeed }) {
  const ref = useRef()
  const [exploding, setExploding] = useState(false)
  const [explosionTime, setExplosionTime] = useState(0)

  const rotationAxis = useMemo(
    () => new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
    []
  )

  useFrame((_, delta) => {
    if (!ref.current) return

    if (exploding) {
      setExplosionTime((t) => t + delta)
      ref.current.scale.multiplyScalar(1 + delta * 5)
      if (explosionTime > 0.5) {
   
        ref.current.position.set(
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000
        )
        ref.current.scale.set(scale, scale, scale)
        setExploding(false)
        setExplosionTime(0)
      }
      return
    }

    ref.current.rotation.x += delta * rotationSpeed
    ref.current.rotation.y += delta * rotationSpeed
    ref.current.rotateOnAxis(rotationAxis, 0.002)

    // Mouvement
    ref.current.position.addScaledVector(direction, delta)

    const limit = 600
    const pos = ref.current.position
    if (Math.abs(pos.x) > limit || Math.abs(pos.y) > limit || Math.abs(pos.z) > limit) {
      pos.set(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
      )
    }

    if (Math.random() < 0.0005) {
      setExploding(true)
    }
  })

  return (
    <primitive
      object={mesh.clone()}
      ref={ref}
      position={position}
      scale={[scale, scale, scale]}
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

  const meshes = useMemo(() => {
    return nodes ? Object.values(nodes).filter((n) => n.isMesh) : []
  }, [nodes])

  const asteroids = useMemo(() => {
    if (!meshes.length || !loadedTextures.length) return []

    return Array.from({ length: count }, () => {
      const scale = Math.random() * 2 + 0.5
      return {
        mesh: meshes[Math.floor(Math.random() * meshes.length)],
        texture: loadedTextures[Math.floor(Math.random() * loadedTextures.length)],
        position: [
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000,
        ],
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(5),
        scale,
        rotationSpeed: Math.random() * 2 + 0.5, 
      }
    })
  }, [meshes, loadedTextures, count])

  return (
    <>
      {asteroids.map((props, i) => (
        <Asteroid key={i} {...props} />
      ))}
    </>
  )
}
