// App.jsx
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { AsteroidRain } from './boxer/scene' 

export default function App() {
  return (
    <Canvas>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
    <AsteroidRain count={50} />
  </Canvas>
  )
}
