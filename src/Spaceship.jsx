import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function Spaceship(props) {
  // Charger le modèle GLTF du vaisseau spatial
  const { scene } = useGLTF('/vso.gltf');
  
  const rigidBodyRef = useRef();
  const { camera } = useThree();

  // Pour le moment, pas de contrôles pour le déplacer
  // Nous allons simplement afficher le modèle

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      {...props} 
      colliders="hull" 
      type="fixed" // Type fixed pour qu'il ne bouge pas pour l'instant
    >
      <primitive 
        object={scene} 
        scale={0.5} // Ajuster l'échelle selon les besoins
        castShadow 
        receiveShadow
      />
    </RigidBody>
  );
}

// Précharger le modèle pour une meilleure expérience utilisateur
useGLTF.preload('/vso.gltf');
