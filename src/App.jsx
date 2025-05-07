// App.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { BoxingGloves } from './boxer/boxer'
import { Ring } from './boxer/ring'
import { Spaceship } from './Spaceship';

export default function App() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 1.6, 5] }}>
      <ambientLight />
      <Environment preset="warehouse" />

      <Physics gravity={[0, -9.81, 0]}>
        <Ring />
        <BoxingGloves />
        <Suspense fallback={null}>
          <Spaceship position={[0, 1, 0]} scale={0.5} />
        </Suspense>
      </Physics>

      {/* OrbitControls retiré */}
    </Canvas>
  )
}
