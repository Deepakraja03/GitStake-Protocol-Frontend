import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import SpinningCoin from '../components/3d/SpinningCoin';
import GlassCard from '../components/animations/GlassCard';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import TypingText from '../components/animations/TypingText';
import AuthDebug from '../components/AuthDebug';

const AmountSlider = ({ value, onChange, max = 1000, apy = 12.5 }) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  
  const estimatedRewards = (value * (apy / 100)) / 365;

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
            setIsAdjusting(true);
            setTimeout(() => setIsAdjusting(false), 500);
          }}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(value/max)*100}%, #374151 ${(value/max)*100}%, #374151 100%)`
          }}
        />
        
        <motion.div
          className="absolute top-0 w-6 h-6 bg-blue-500 rounded-full shadow-lg pointer-events-none"
          style={{ 
            left: `calc(${(value/max)*100}% - 12px)`,
            top: '-6px'
          }}
          animate={{ 
            scale: isAdjusting ? 1.2 : 1,
            boxShadow: isAdjusting ? '0 0 20px rgba(59, 130, 246, 0.6)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-400">
        <span>0 AVAX</span>
        <span>{max} AVAX</span>
      </div>
      
      <motion.div
        className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg"
        animate={{ scale: isAdjusting ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="text-center">
          <p className="text-gray-400 text-sm">Daily Rewards</p>
          <p className="text-green-400 text-lg font-bold">
            <AnimatedCounter value={estimatedRewards} decimals={4} suffix=" AVAX" />
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Annual Yield</p>
          <p className="text-blue-400 text-lg font-bold">
            <AnimatedCounter value={value * (apy / 100)} decimals={2} suffix=" AVAX" />
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, amount, onConfirm }) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    // Simulate transaction
    setTimeout(() => {
      onConfirm();
      setConfirming(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-slate-900 border border-white/20 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Staking</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount to Stake:</span>
                <span className="text-white font-bold">{amount} AVAX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated APY:</span>
                <span className="text-green-400 font-bold">12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lock Period:</span>
                <span className="text-white">Flexible</span>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
              <div className="flex items-start space-x-2">
                <FaInfoCircle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-200 text-sm">
                  Your AVAX will be staked in the Avalanche network. You can unstake at any time.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={confirming}
              >
                Cancel
              </motion.button>
              
              <motion.button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirming ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Stake</span>
                    <FaArrowRight />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Stake = () => {
  const [stakeAmount, setStakeAmount] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [balance] = useState(500.75);
  const [totalStaked] = useState(1250.75);

  const handleStake = () => {
    console.log('Staking confirmed:', stakeAmount);
    // Handle successful staking
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="Stake Your AVAX" speed={100} />
          </h1>
          <p className="text-gray-400">Earn rewards while supporting the network</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Staking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">Stake Amount</h2>
                <div className="text-4xl font-bold text-blue-400 mb-4">
                  <AnimatedCounter value={stakeAmount} decimals={2} suffix=" AVAX" />
                </div>
              </div>

              <AmountSlider
                value={stakeAmount}
                onChange={setStakeAmount}
                max={balance}
              />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available Balance:</span>
                  <span className="text-white">{balance} AVAX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Currently Staked:</span>
                  <span className="text-white">{totalStaked} AVAX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current APY:</span>
                  <span className="text-green-400 font-semibold">12.5%</span>
                </div>
              </div>

              <motion.button
                onClick={() => setShowModal(true)}
                disabled={stakeAmount === 0 || stakeAmount > balance}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: stakeAmount > 0 && stakeAmount <= balance ? 1.02 : 1 }}
                whileTap={{ scale: stakeAmount > 0 && stakeAmount <= balance ? 0.98 : 1 }}
              >
                <span>Stake AVAX</span>
                <FaArrowRight />
              </motion.button>
            </GlassCard>
          </motion.div>

          {/* Right Column - 3D Coin */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center"
          >
            <GlassCard className="p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-6">AVAX Staking</h3>
              
              <div className="mb-6">
                <SpinningCoin 
                  spinning={stakeAmount > 0} 
                  size={300}
                  className="mx-auto"
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Network</p>
                    <p className="text-white font-semibold">Avalanche</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Validator</p>
                    <p className="text-white font-semibold">GitStake</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                  <p className="text-green-400 text-sm mb-1">Estimated Annual Rewards</p>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter 
                      value={stakeAmount * 0.125} 
                      decimals={2} 
                      suffix=" AVAX" 
                    />
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          amount={stakeAmount}
          onConfirm={handleStake}
        />
      </div>
      {/* <AuthDebug pageName="Stake" /> */}
    </div>
  );
};

export default Stake;
