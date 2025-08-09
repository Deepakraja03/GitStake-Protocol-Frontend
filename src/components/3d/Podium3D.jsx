import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';

const PodiumStep = ({ position, height, color, rank, user, isHovered }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.position.y = height / 2 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    } else if (meshRef.current) {
      meshRef.current.position.y = height / 2;
    }
  });

  return (
    <group
      position={position}
    >
      {/* Podium step */}
      <Box ref={meshRef} args={[1, height, 1]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Box>
      
      {/* Rank number */}
      <Text
        position={[0, height + 0.3, 0.6]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        #{rank}
      </Text>
      
      {/* User name */}
      {user && (
        <Text
          position={[0, height + 0.6, 0.6]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {user.username}
        </Text>
      )}
      
      {/* Sparkles for first place */}
      {rank === 1 && (
        <Sparkles
          count={20}
          scale={2}
          size={3}
          speed={0.4}
          position={[0, height + 0.5, 0]}
        />
      )}
    </group>
  );
};

const Podium3D = ({ leaderboard = [], className = '', showConfetti = false }) => {
  const [hoveredRank, setHoveredRank] = useState(null);

  const podiumData = [
    { rank: 2, position: [-1.5, 0, 0], height: 1.5, color: '#C0C0C0' },
    { rank: 1, position: [0, 0, 0], height: 2, color: '#FFD700' },
    { rank: 3, position: [1.5, 0, 0], height: 1, color: '#CD7F32' },
  ];

  return (
    <div 
      className={className} 
      style={{ width: '100%', height: '400px' }}
      onMouseLeave={() => setHoveredRank(null)}
    >
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {podiumData.map(({ rank, position, height, color }) => (
          <div
            key={rank}
            onMouseEnter={() => setHoveredRank(rank)}
          >
            <PodiumStep
              position={position}
              height={height}
              color={color}
              rank={rank}
              user={leaderboard[rank - 1]}
              isHovered={hoveredRank === rank}
            />
          </div>
        ))}
        
        {/* Base platform */}
        <Box args={[5, 0.2, 2]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#2a2a2a" />
        </Box>
      </Canvas>
    </div>
  );
};

export default Podium3D;