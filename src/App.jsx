// App.jsx
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { AsteroidRain } from "./boxer/scene";
import { Stars } from "@react-three/drei";

export default function App() {
  return (
    <Canvas camera={{ fov: 50, position: [0, 10, 20] }} style={{ background: "black" }}>
      <OrbitControls />
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Stars radius={300} depth={60} count={10000} factor={4} fade />
      <ambientLight intensity={0.2} />
      <pointLight
        position={[10, 10, 10]}
        intensity={0.5}
        decay={2}
        distance={100}
      />
      <Environment
        background
        files="space.jpg"
      />
      <AsteroidRain count={500} />
    </Canvas>
  );
}
