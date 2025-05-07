import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function Spaceship(props) {
  const { scene } = useGLTF('/scene.gltf');
  const rigidBodyRef = useRef();
  const { camera } = useThree();

  // État pour suivre les touches pressées
  const [controls, setControls] = useState({
    accelerate: false,
    turnLeft: false,
    turnRight: false,
    pitchUp: false,    // Flèche du bas pour tangage vers le haut
    pitchDown: false,  // Flèche du haut pour tangage vers le bas
  });

  // Gérer les entrées clavier
  useEffect(() => {
    const keyMap = {
      ' ': 'accelerate', // Espace pour accélérer
      'ArrowLeft': 'turnLeft',
      'ArrowRight': 'turnRight',
      'ArrowDown': 'pitchUp',    // Flèche du bas -> nez vers le haut
      'ArrowUp': 'pitchDown',  // Flèche du haut -> nez vers le bas
    };

    const handleKeyDown = (e) => {
      const action = keyMap[e.key];
      if (action) {
        setControls((prev) => ({ ...prev, [action]: true }));
      }
    };
    const handleKeyUp = (e) => {
      const action = keyMap[e.key];
      if (action) {
        setControls((prev) => ({ ...prev, [action]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'au montage/démontage

  // Constantes pour le mouvement (à ajuster)
  const thrustForce = 10;
  const turnTorque = 0.5;
  const pitchTorque = 0.3;

  // Caméra
  const cameraIdealOffset = new THREE.Vector3(0, 2.5, 7); // Offset idéal de la caméra par rapport au vaisseau
  const cameraLookAtOffset = new THREE.Vector3(0, 1, -2); // Point que la caméra regarde, en avant du vaisseau

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const shipQuaternion = new THREE.Quaternion().copy(rb.rotation());
    const shipPosition = new THREE.Vector3().copy(rb.translation());

    // --- Contrôle du vaisseau ---
    // Accélération (vers l'avant local du vaisseau)
    if (controls.accelerate) {
      const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion);
      rb.addForce(forwardDir.multiplyScalar(thrustForce * delta), true);
    }

    // Rotation (Lacet - Gauche/Droite)
    let yawTorqueValue = 0;
    if (controls.turnLeft) yawTorqueValue += turnTorque;
    if (controls.turnRight) yawTorqueValue -= turnTorque;
    if (yawTorqueValue !== 0) {
      // Appliquer le couple sur l'axe Y local du vaisseau
      rb.addTorque(new THREE.Vector3(0, yawTorqueValue * delta, 0).applyQuaternion(shipQuaternion), true);
    }

    // Rotation (Tangage - Haut/Bas)
    // Flèche Haut (pitchDown) -> nez vers le bas (rotation positive sur X local)
    // Flèche Bas (pitchUp) -> nez vers le haut (rotation négative sur X local)
    let pitchTorqueValue = 0;
    if (controls.pitchDown) pitchTorqueValue += pitchTorque; // Flèche Haut
    if (controls.pitchUp) pitchTorqueValue -= pitchTorque;   // Flèche Bas
    if (pitchTorqueValue !== 0) {
      // Appliquer le couple sur l'axe X local du vaisseau
      rb.addTorque(new THREE.Vector3(pitchTorqueValue * delta, 0, 0).applyQuaternion(shipQuaternion), true);
    }

    // --- Contrôle de la caméra --- 
    // Position cible de la caméra
    const idealOffset = cameraIdealOffset.clone().applyQuaternion(shipQuaternion);
    const cameraTargetPosition = shipPosition.clone().add(idealOffset);

    // Point cible que la caméra regarde
    const lookAtTargetPosition = shipPosition.clone().add(cameraLookAtOffset.clone().applyQuaternion(shipQuaternion));

    // Lissage du mouvement de la caméra (interpolation linéaire)
    const lerpFactor = 0.05; // Ajuster pour une caméra plus ou moins réactive
    camera.position.lerp(cameraTargetPosition, lerpFactor);
    camera.lookAt(lookAtTargetPosition);
  });

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      {...props} 
      colliders="hull" 
      linearDamping={0.5} // Amortissement linéaire pour simuler la résistance de l'espace
      angularDamping={0.8} // Amortissement angulaire
    >
      <primitive object={scene} />
    </RigidBody>
  );
}

// Précharger le modèle pour une meilleure expérience utilisateur
useGLTF.preload('/scene.gltf');
