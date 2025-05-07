import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Physics } from "@react-three/rapier"; // <-- importer Physics
import { AsteroidRain } from "./boxer/scene";
import { Spaceship } from "./Spaceship";

export default function App() {
  return (
    <Canvas camera={{ fov: 50, position: [0, 10, 20] }} style={{ background: "black" }}>
      <OrbitControls />
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      
      
      <Physics>
        <Spaceship position={[0, 0, 0]}/>
        <AsteroidRain count={500} />
      </Physics>

      <Stars radius={300} depth={60} count={10000} factor={4} fade />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} decay={2} distance={100} />
      <mesh position={[0, 0, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>
      <Environment background files="space.jpg" />
    </Canvas>
  );
}
