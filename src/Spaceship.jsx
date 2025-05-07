import React, { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function Spaceship(props) {
  const { scene } = useGLTF('/vso.gltf');
  const rigidBodyRef = useRef();
  const { camera } = useThree();

  // Recentrer automatiquement le modèle au chargement
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
  }, [scene]);

  // Extraire et cloner les Meshes uniquement
  const meshes = useMemo(() => {
    const result = [];
    scene.traverse((child) => {
      if (child.isMesh && child.geometry?.attributes?.position) {
        child.castShadow = true;
        child.receiveShadow = true;
        result.push(child.clone());
      }
    });
    return result;
  }, [scene]);

  return (
    <RigidBody ref={rigidBodyRef} type="fixed" colliders={false} {...props}>
      <group scale={50}>
        {meshes.map((mesh, index) => (
          <primitive key={index} object={mesh} />
        ))}
        {/* Simplified collider to wrap the model */}
        <CuboidCollider args={[2, 2, 2]} />
      </group>
    </RigidBody>
  );
}

useGLTF.preload('/vso.gltf');
