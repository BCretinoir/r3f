// App.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment, Stars } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { BoxingGloves } from './boxer/boxer'
import { AsteroidRain } from './boxer/scene'
import { Spaceship } from './Spaceship';

export default function App() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 1.6, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Physics gravity={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Spaceship position={[0, 0, 0]} scale={0.5} />
          <BoxingGloves />
          <AsteroidRain count={50} />
        </Suspense>
      </Physics>

      {/* OrbitControls retiré */}
    </Canvas>
  )
}
