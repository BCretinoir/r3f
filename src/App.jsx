// App.tsx
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { BoxingGloves } from './boxer/boxer'
import { Ring } from './boxer/ring'

export default function App() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 1.6, 5] }}>
      <ambientLight />
      <Environment preset="warehouse" />

      <Physics gravity={[0, -9.81, 0]}>
        <Ring />
        <BoxingGloves />
      </Physics>

      <OrbitControls /> 
    </Canvas>
  )
}
