import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cylinder, Text } from '@react-three/drei';
import { motion } from 'framer-motion';

const Coin = ({ spinning = false, scale = 1 }) => {
  const coinRef = useRef();

  useFrame((state) => {
    if (coinRef.current && spinning) {
      coinRef.current.rotation.y += 0.05;
      coinRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group
      ref={coinRef}
      scale={scale}
    >
      {/* Main coin body */}
      <Cylinder args={[1, 1, 0.1, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Coin edge */}
      <Cylinder args={[1.02, 1.02, 0.12, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFA500" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* AVAX text on front */}
      <Text
        position={[0, 0, 0.07]}
        fontSize={0.3}
        color="#8B0000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        AVAX
      </Text>
      
      {/* Logo on back */}
      <Text
        position={[0, 0, -0.07]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.2}
        color="#8B0000"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        ⛰️
      </Text>
    </group>
  );
};

const SpinningCoin = ({ spinning = false, className = '', size = 200 }) => {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Coin spinning={spinning} />
      </Canvas>
    </div>
  );
};

export default SpinningCoin;