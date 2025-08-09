import React from 'react';
import { motion } from 'framer-motion';

const SpinningCoin = ({ spinning = false, className = '', size = 200 }) => {
  return (
    <div className={`${className} flex items-center justify-center`} style={{ width: size, height: size }}>
      <motion.div
        className="relative"
        style={{ width: size * 0.8, height: size * 0.8 }}
        animate={spinning ? {
          rotateY: [0, 360],
          y: [0, -10, 0]
        } : {}}
        transition={{
          rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Coin Shadow */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/20 rounded-full blur-sm"
          style={{
            width: size * 0.6,
            height: size * 0.15,
            transform: 'translateX(-50%) translateY(20px)'
          }}
        />

        {/* Main Coin */}
        <motion.div
          className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-2xl border-4 border-yellow-300"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.3)'
          }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Inner Ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-yellow-200/50"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
            }}
          />

          {/* AVAX Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="font-bold text-red-800 mb-1"
                style={{
                  fontSize: size * 0.15,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                AVAX
              </div>
              <div
                className="text-red-700"
                style={{ fontSize: size * 0.08 }}
              >
                ⛰️
              </div>
            </div>
          </div>

          {/* Highlight Effect */}
          <div
            className="absolute top-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-sm"
            style={{
              width: size * 0.15,
              height: size * 0.15
            }}
          />

          {/* Edge Details */}
          <div className="absolute inset-0 rounded-full border border-yellow-600/30" />
          <div className="absolute inset-1 rounded-full border border-yellow-200/20" />
        </motion.div>

        {/* Spinning Particles */}
        {spinning && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * size * 0.6],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * size * 0.6],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SpinningCoin;