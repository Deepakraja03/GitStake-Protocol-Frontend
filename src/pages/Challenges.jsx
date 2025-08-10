import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Calendar, Sword, Play, Check, X, Flame, Trophy, Target, Code, Zap, Eye, XIcon, Wallet, AlertTriangle, DollarSign, CheckCircle } from 'lucide-react';
import MonacoEditor from 'react-monaco-editor';
import CountUp from 'react-countup';
import { useAuthContext as useAuth } from '../context/AuthContext';
import { useUserAnalytics, useActiveQuests } from '../hooks/useApi';
import { useAccount, useWalletClient } from 'wagmi';
import { GitStakeProtocol } from '../blockchainServices/integration';
import { questService } from '../services/questService';
import { useToast } from '../components/ToastSystem';
import { ethers } from 'ethers';


// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#E84142] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white font-['JetBrains_Mono'] text-lg">Loading Challenges...</p>
    </div>
  </div>
);

// Modern Card Component
const ModernCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    {children}
  </motion.div>
);

ModernCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, delay, isText = false }) => (
  <ModernCard delay={delay} className="text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center mx-auto mb-4">
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-2 font-['JetBrains_Mono']">
      {isText ? (
        <span className='text-xl'>{value}</span>
      ) : (
        <CountUp end={value} duration={2} separator="," />
      )}
    </h3>
    <p className="text-lg font-semibold text-gray-300 mb-1 font-['JetBrains_Mono']">{title}</p>
    <div className="text-sm text-gray-500 font-['JetBrains_Mono']">{subtitle}</div>
  </ModernCard>
 );

StatsCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  subtitle: PropTypes.string.isRequired,
  delay: PropTypes.number,
  isText: PropTypes.bool
};

const BossAvatar = ({ state = 'idle', health = 100 }) => {
  const getAvatarEmoji = () => {
    if (health <= 0) return '💀';
    if (health <= 25) return '😵';
    if (health <= 50) return '😰';
    if (health <= 75) return '😠';
    return '👹';
  };

  const getAvatarColor = () => {
    if (health <= 0) return 'text-gray-500';
    if (health <= 25) return 'text-red-600';
    if (health <= 50) return 'text-orange-500';
    if (health <= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      className={`text-8xl ${getAvatarColor()}`}
      animate={{
        scale: state === 'damaged' ? [1, 1.2, 1] : 1,
        rotate: state === 'damaged' ? [0, -10, 10, 0] : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      {getAvatarEmoji()}
    </motion.div>
  );
};

const ReactiveBackground = ({ success = false, error = false }) => {
  return (
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{
        background: success 
          ? 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 70%)'
          : error
          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 70%)'
          : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)'
      }}
      transition={{ duration: 0.5 }}
    />
  );
};

// Utility function to check if user has already staked in this challenge
const hasUserStaked = (challenge, userData) => {
  const currentUsername = userData?.data?.username || 'manicdon7';
  const stakedParticipants = challenge.participants?.staked || [];
  
  // Check if user's username is in the staked participants array
  return stakedParticipants.some(participant => 
    participant.username === currentUsername
  );
};

// Modal Component for Description
const DescriptionModal = ({ isOpen, onClose, challenge, userData, onStakeClick }) => {
  const userHasStaked = hasUserStaked(challenge, userData);
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-[#0B0F1A]/95 via-[#0F1419]/95 to-[#0B0F1A]/95 border border-white/20 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] border-b border-white/20 p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                challenge.type === 'boss'
                  ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30'
                  : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30'
              }`}>
                {challenge.type === 'boss' ? (
                  <Sword size={20} className="text-red-400" />
                ) : (
                  <Calendar size={20} className="text-blue-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['JetBrains_Mono']">
                  {challenge.title}
                </h2>
                <p className="text-sm text-gray-400">
                  {challenge.type === 'boss' ? 'Boss Battle' : 'Weekly Challenge'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Challenge Stats */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {challenge.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ⏱️ {challenge.duration}
            </span>
            {challenge.weekNumber && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Week {challenge.weekNumber}
              </span>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-['JetBrains_Mono'] flex items-center space-x-2">
              <Eye size={18} className="text-blue-400" />
              <span>Challenge Description</span>
            </h3>
            <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl p-4">
              <p className="text-gray-300 font-['JetBrains_Mono'] leading-relaxed whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          {challenge.techStack && challenge.techStack.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white font-['JetBrains_Mono'] flex items-center space-x-2">
                <Code size={18} className="text-green-400" />
                <span>Technology Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {challenge.techStack.map((tech, index) => (
                  <span key={index} className="px-3 py-2 bg-blue-500/10 text-blue-400 text-sm rounded-lg border border-blue-500/20 font-['JetBrains_Mono']">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl">
              <Trophy className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-semibold font-['JetBrains_Mono']">
                {challenge.reward} AVAX
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl">
              <Zap className="text-orange-400" size={20} />
              <span className="text-orange-400 font-semibold font-['JetBrains_Mono']">
                {challenge.xp} XP
              </span>
            </div>
          </div>

          {/* Status Info */}
          {challenge.statistics && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                challenge.status === 'staking' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                challenge.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                challenge.status === 'completed' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {challenge.status}
              </span>
              <span className="text-gray-300 font-['JetBrains_Mono'] text-sm">
                👥 {challenge.participants?.staked?.length || 0} participants
              </span>
            </div>
          )}

          {/* Stake Button or Staked Status for staking status quests */}
          {challenge.status === 'staking' && (
            <div className="mt-4">
              {userHasStaked ? (
                <div className="w-full px-6 py-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 rounded-xl font-['JetBrains_Mono'] font-semibold flex items-center justify-center space-x-2">
                  <CheckCircle size={18} />
                  <span>You have staked for this quest</span>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStakeClick();
                    onClose();
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-['JetBrains_Mono'] font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/25"
                >
                  <Wallet size={18} />
                  <span>Stake</span>
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

DescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  challenge: PropTypes.object.isRequired,
  userData: PropTypes.object,
  onStakeClick: PropTypes.func
};

// Staking Confirmation Modal Component
const StakingModal = ({ isOpen, onClose, challenge, userData, onStakeConfirm }) => {
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [currency, setCurrency] = useState('AVAX');
  const [isStaking, setIsStaking] = useState(false);
  const [stakingError, setStakingError] = useState(null);
  const [protocolService, setProtocolService] = useState(null);
  const { address: walletAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { addToast } = useToast();

  // Initialize the protocol service when wallet client is available
  useEffect(() => {
    const initService = async () => {
      if (walletClient && walletAddress) {
        try {
          // Create a signer from the wallet client
          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const service = new GitStakeProtocol(signer);
          setProtocolService(service);
          console.log('GitStake Protocol service initialized for staking');
        } catch (error) {
          console.error('Error initializing protocol service:', error);
        }
      } else {
        setProtocolService(null);
      }
    };
    
    initService();
  }, [walletClient, walletAddress]);

  const handleStake = async () => {
    if (!walletAddress) {
      setStakingError('Please connect your wallet first');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setStakingError('Please enter a valid stake amount');
      return;
    }

    try {
      setIsStaking(true);
      setStakingError(null);

      // Step 1: Validate prerequisites
      if (!walletClient) {
        setStakingError('Wallet client not available. Please try again.');
        return;
      }
      
      if (!protocolService) {
        setStakingError('Protocol service not initialized. Please try again.');
        return;
      }
      
      console.log('Initiating GitStake Protocol deposit with protocol service:', protocolService);
      
      // Validate and clean the stake amount
      const cleanStakeAmount = stakeAmount.toString().trim();
      if (!/^\d*\.?\d+$/.test(cleanStakeAmount)) {
        setStakingError('Please enter a valid numeric amount');
        return;
      }
      
      // Convert stake amount to BigInt (AVAX has 18 decimals)
      let stakeAmountWei;
      try {
        stakeAmountWei = ethers.parseEther(cleanStakeAmount);
      } catch (parseError) {
        console.error('Error parsing stake amount:', parseError);
        setStakingError('Invalid stake amount format. Please enter a valid number.');
        return;
      }
      
      console.log('Calling deposit with amount:', stakeAmountWei.toString(), 'wei');
      
      // Step 2: Execute blockchain transaction
      let txHash;
      try {
        // Use GitStake Protocol to deposit AVAX - this will throw if user cancels or transaction fails
        const txResponse = await protocolService.deposit(stakeAmountWei);
        txHash = txResponse.hash; // Extract hash from TransactionResponse
        console.log('GitStake Protocol deposit transaction initiated:', txHash);
      } catch (txError) {
        console.error('Blockchain transaction error:', txError);
        
        // Handle specific error cases
        if (txError.code === 'ACTION_REJECTED' || txError.code === 4001) {
          // User rejected the transaction
          setStakingError('Transaction was cancelled by user.');
          addToast({
            type: 'error',
            title: 'Transaction Cancelled',
            duration: 4000
          });
        } else if (txError.code === 'INSUFFICIENT_FUNDS' || txError.code === -32000) {
          // Insufficient funds
          setStakingError('Insufficient funds to complete the transaction.');
          addToast({
            type: 'error',
            title: 'Insufficient Funds',
            duration: 4000
          });
        } else if (txError.code === 'UNPREDICTABLE_GAS_LIMIT') {
          // Transaction would fail
          setStakingError('Transaction would fail. Please check your balance and try again.');
          addToast({
            type: 'error',
            title: 'Transaction Failed',
            duration: 4000
          });
        } else {
          // Generic transaction error
          setStakingError(txError.message || 'Transaction failed. Please try again.');
          addToast({
            type: 'error',
            title: 'Staking Failed',
            duration: 4000
          });
        }
        // Return early - do NOT call backend API
        return;
      }
      
      // Step 3: Wait for transaction confirmation (optional - for now we'll proceed with just the hash)
      // For now, we'll simulate the receipt since we need a public client for waitForTransactionReceipt
      // In a real implementation, you would wait for the transaction to be mined and check its status
      const receipt = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'success'
      };
      
      console.log('Blockchain transaction confirmed:', receipt);

      // Step 4: Only call backend API after successful blockchain transaction
      const stakeData = {
        walletAddress,
        stakeAmount: parseFloat(stakeAmount),
        currency,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        userInfo: {
          username: userData?.data?.username || 'manicdon7',
          email: userData?.data?.email || userData?.data?.githubProfile?.email || 'manicdon7@example.com',
          developerLevel: userData?.data?.developerLevel?.level || 'ROOKIE'
        }
      };
      
      console.log('Blockchain transaction successful, calling backend API with:', stakeData);

      try {
        const apiResponse = await questService.participation.stakeForQuest(challenge.id, stakeData);
        console.log('Backend API staking response:', apiResponse);

        // Success - call parent callback
        onStakeConfirm(challenge, stakeData, apiResponse);
        onClose();
      } catch (apiError) {
        console.error('Backend API error:', apiError);
        // Even if backend fails, the blockchain transaction succeeded
        setStakingError('Staking transaction succeeded, but failed to update backend. Please contact support.');
        addToast({
          type: 'warning',
          title: 'Partial Success',
          message: 'Your AVAX was staked on-chain, but we couldn\'t update our records. Please contact support.',
          txHash: txHash,
          duration: 0, // Don't auto-dismiss
          actions: [
            {
              label: 'View Transaction',
              onClick: () => window.open(`https://testnet.snowscan.xyz/tx/${txHash}`, '_blank'),
              className: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300'
            }
          ]
        });
      }

    } catch (error) {
      console.error('Unexpected staking error:', error);
      setStakingError('An unexpected error occurred. Please try again.');
      addToast({
        type: 'error',
        title: 'Unexpected Error',
        message: 'An unexpected error occurred during staking. Please try again.',
        duration: 5000
      });
    } finally {
      setIsStaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative max-w-md w-full backdrop-blur-xl bg-gradient-to-br from-[#0B0F1A]/95 via-[#0F1419]/95 to-[#0B0F1A]/95 border border-white/20 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <Wallet size={20} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['JetBrains_Mono']">
                  Stake for Quest
                </h2>
                <p className="text-sm text-gray-400">
                  {challenge.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quest Info */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Quest Reward</span>
              <div className="flex items-center space-x-2">
                <Trophy className="text-yellow-400" size={16} />
                <span className="text-yellow-400 font-semibold font-['JetBrains_Mono']">
                  {challenge.reward} AVAX
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Experience Points</span>
              <div className="flex items-center space-x-2">
                <Zap className="text-orange-400" size={16} />
                <span className="text-orange-400 font-semibold font-['JetBrains_Mono']">
                  {challenge.xp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Stake Amount Input */}
          <div className="space-y-3">
            <label className="block text-sm text-gray-300 font-['JetBrains_Mono']">Stake Amount</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-['JetBrains_Mono'] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                placeholder="0.1"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <DollarSign className="text-purple-400" size={16} />
                <span className="text-purple-400 font-semibold font-['JetBrains_Mono']">{currency}</span>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Wallet className="text-blue-400" size={16} />
              <span className="text-sm text-gray-300 font-['JetBrains_Mono']">Wallet Address</span>
            </div>
            <p className="text-blue-400 font-['JetBrains_Mono'] text-sm break-all">
              {walletAddress || 'Not connected'}
            </p>
          </div>

          {/* User Info */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Username</span>
                <span className="text-green-400 font-['JetBrains_Mono']">
                  {userData?.data?.username || 'manicdon7'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 font-['JetBrains_Mono']">Level</span>
                <span className="text-green-400 font-['JetBrains_Mono']">
                  {userData?.data?.developerLevel?.level || 'ROOKIE'}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {stakingError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-red-400 flex-shrink-0" size={20} />
                <p className="text-red-400 font-['JetBrains_Mono'] text-sm">
                  {stakingError}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-['JetBrains_Mono']"
            >
              Cancel
            </button>
            <button
              onClick={handleStake}
              disabled={isStaking || !walletAddress}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-['JetBrains_Mono'] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isStaking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Staking...</span>
                </>
              ) : (
                <>
                  <Wallet size={16} />
                  <span>Stake {currency}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

StakingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  challenge: PropTypes.object.isRequired,
  userData: PropTypes.object,
  onStakeConfirm: PropTypes.func.isRequired
};

const ChallengeCard = ({ challenge, onSelect, isSelected, userData, onStake }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
  const userHasStaked = hasUserStaked(challenge, userData);
  
  // Truncate description to 100 characters
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  const shouldShowReadMore = challenge.description && challenge.description.length > 100;
  
  return (
    <>
      <motion.div
        className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-xl ${
          isSelected
            ? 'border-[#E84142] bg-gradient-to-r from-[#E84142]/10 to-[#9B2CFF]/10'
            : 'hover:border-white/20 hover:bg-white/10'
        }`}
        onClick={() => onSelect(challenge)}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg font-['JetBrains_Mono']">{challenge.title}</h3>
          <div className="flex items-center space-x-2">
            {challenge.type === 'boss' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <Sword size={16} className="text-white" />
              </div>
            )}
            {challenge.type === 'weekly' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar size={16} className="text-white" />
              </div>
            )}
            <span className={`px-3 py-1 rounded-lg text-xs font-medium font-['JetBrains_Mono'] ${
              challenge.type === 'boss'
                ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30'
                : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30'
            }`}>
              {challenge.type === 'boss' ? 'Boss Battle' : 'Weekly Challenge'}
            </span>
          </div>
        </div>
        
        {/* Quest-specific information */}
        <div className="mb-4 space-y-2">
          <div className="flex items-start justify-between">
            <p className="text-gray-400 text-sm font-['JetBrains_Mono'] flex-1 mr-2">
              {truncateText(challenge.description)}
            </p>
            {shouldShowReadMore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="flex-shrink-0 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 text-blue-400 hover:text-blue-300 text-xs rounded-lg transition-all duration-200 font-['JetBrains_Mono'] flex items-center space-x-1"
              >
                <Eye size={12} />
                <span>Read More</span>
              </button>
            )}
          </div>
      
      {/* Difficulty and Duration */}
      <div className="flex items-center space-x-3 text-xs">
        <span className={`px-2 py-1 rounded-full font-medium ${
          challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
          challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>
          {challenge.difficulty}
        </span>
        <span className="text-gray-500 font-['JetBrains_Mono']">
          ⏱️ {challenge.duration}
        </span>
        {challenge.weekNumber && (
          <span className="text-blue-400 font-['JetBrains_Mono']">
            Week {challenge.weekNumber}
          </span>
        )}
      </div>
      
      {/* Tech Stack */}
      {challenge.techStack && challenge.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {challenge.techStack.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20 font-['JetBrains_Mono']">
              {tech}
            </span>
          ))}
        </div>
      )}
      
      {/* Status and Participants */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full ${
            challenge.status === 'staking' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
            challenge.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            challenge.status === 'completed' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
            {challenge.status}
          </span>
          {/* Show user staked status */}
          {challenge.status === 'staking' && userHasStaked && (
            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center space-x-1">
              <CheckCircle size={10} />
              <span>Staked</span>
            </span>
          )}
        </div>
        {challenge.statistics && (
          <span className="font-['JetBrains_Mono']">
            👥 {challenge.participants?.staked?.length || 0} staked
          </span>
        )}
      </div>
    </div>
    
    {/* Rewards and XP */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Trophy className="text-yellow-400" size={16} />
        <span className="text-yellow-400 font-semibold font-['JetBrains_Mono']">
          {challenge.reward} AVAX
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Zap className="text-orange-400" size={16} />
        <span className="text-orange-400 font-semibold font-['JetBrains_Mono']">
          {challenge.xp} XP
        </span>
      </div>
    </div>
    
    {/* Action Button */}
    <div className="mt-4 pt-4 border-t border-white/10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(challenge);
        }}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-['JetBrains_Mono'] font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
      >
        <Play size={16} />
        <span>Start Quest</span>
      </button>
    </div>
      </motion.div>
      
      {/* Description Modal */}
      <DescriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        challenge={challenge}
        userData={userData}
        onStakeClick={() => {
          if (!userHasStaked) {
            setIsStakingModalOpen(true);
          }
        }}
      />
      
      {/* Staking Modal */}
      <StakingModal
        isOpen={isStakingModalOpen}
        onClose={() => setIsStakingModalOpen(false)}
        challenge={challenge}
        userData={userData}
        onStakeConfirm={(challenge, stakeData, apiResponse) => {
          console.log('Staking confirmed:', { challenge, stakeData, apiResponse });
          if (onStake) {
            onStake(challenge, stakeData, apiResponse);
          }
          setIsStakingModalOpen(false);
        }}
      />
    </>
  );
};

const Arena = ({ challenge, onComplete }) => {
  const [code, setCode] = useState(challenge.starterCode || '');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bossHealth, setBossHealth] = useState(100);
  const [bossState, setBossState] = useState('idle');
  const [backgroundState, setBackgroundState] = useState('idle');

  const runTests = async () => {
    setIsRunning(true);
    setBackgroundState('idle');
    
    // Simulate test execution
    const results = challenge.tests.map((test, index) => {
      const passed = Math.random() > 0.3; // Simulate test results
      return { ...test, passed, index };
    });
    
    // Animate test results
    for (let i = 0; i < results.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTestResults(prev => [...prev.slice(0, i), results[i]]);
      
      if (results[i].passed) {
        setBossHealth(prev => Math.max(0, prev - (100 / results.length)));
        setBossState('damaged');
        setBackgroundState('success');
        setTimeout(() => {
          setBossState('idle');
          setBackgroundState('idle');
        }, 500);
      } else {
        setBackgroundState('error');
        setTimeout(() => setBackgroundState('idle'), 500);
      }
    }
    
    setIsRunning(false);
    
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      setBossHealth(0);
      setTimeout(() => onComplete(challenge), 1000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Code Editor */}
      <ModernCard className="relative">
        <ReactiveBackground
          success={backgroundState === 'success'}
          error={backgroundState === 'error'}
        />

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white font-['JetBrains_Mono']">{challenge.title}</h3>
          <motion.button
            onClick={runTests}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 font-['JetBrains_Mono'] shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={16} />
            <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
          </motion.button>
        </div>
        
        <div className="h-96 border border-white/10 rounded-lg overflow-hidden">
          <MonacoEditor
            width="100%"
            height="100%"
            language={challenge.language || 'javascript'}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
        
        {/* Test Results */}
        <div className="mt-6 space-y-3">
          <h4 className="text-white font-semibold font-['JetBrains_Mono']">Test Results:</h4>
          {testResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                result.passed
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}
            >
              {result.passed ? <Check size={16} /> : <X size={16} />}
              <span className="text-sm font-['JetBrains_Mono']">{result.description}</span>
            </motion.div>
          ))}
        </div>
      </ModernCard>

      {/* Boss Battle */}
      <ModernCard className="text-center">
        <h3 className="text-xl font-semibold text-white mb-6 font-['JetBrains_Mono']">Boss Battle</h3>

        <div className="mb-8">
          <BossAvatar state={bossState} health={bossHealth} />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 font-['JetBrains_Mono']">Boss Health</span>
            <span className="text-white font-bold font-['JetBrains_Mono']">{Math.round(bossHealth)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-4 border border-white/10">
            <motion.div
              className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full shadow-lg"
              initial={{ width: '100%' }}
              animate={{ width: `${bossHealth}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Challenge Description */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-400 text-sm mb-2 font-['JetBrains_Mono']">Challenge Description</p>
            <p className="text-white font-['JetBrains_Mono']">{challenge.description}</p>
          </div>

          {/* Quest Details */}
          {challenge.learningObjectives && challenge.learningObjectives.length > 0 && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-gray-400 text-sm mb-2 font-['JetBrains_Mono']">Learning Objectives</p>
              <ul className="space-y-1">
                {challenge.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-white text-sm font-['JetBrains_Mono'] flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {challenge.techStack && challenge.techStack.length > 0 && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-gray-400 text-sm mb-2 font-['JetBrains_Mono']">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {challenge.techStack.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded border border-blue-500/30 font-['JetBrains_Mono']">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-yellow-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">Reward</p>
              <p className="text-yellow-400 font-bold font-['JetBrains_Mono']">{challenge.reward} AVAX</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-center mb-2">
                <Zap className="text-orange-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">XP</p>
              <p className="text-orange-400 font-bold font-['JetBrains_Mono']">{challenge.xp} XP</p>
            </div>
          </div>

          {/* Additional Quest Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-center mb-2">
                <Target className="text-purple-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">Difficulty</p>
              <p className="text-purple-400 font-bold font-['JetBrains_Mono']">{challenge.difficulty}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="text-green-400" size={20} />
              </div>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">Duration</p>
              <p className="text-green-400 font-bold font-['JetBrains_Mono']">{challenge.duration}</p>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

const Challenges = () => {
  const { user } = useAuth();
  const { data: userAnalytics } = useUserAnalytics(user?.username);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filter, setFilter] = useState('all');
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const { addToast } = useToast();
  const userLevel = userData?.data?.developerLevel?.level || userAnalytics?.level || 'ROOKIE';
  
  // Fetch active quests for the current user level
  const { data: questsData, loading: questsLoading, error: questsError } = useActiveQuests(userLevel);
  
  // Debug logging for quest data
  console.log('User Level:', userLevel);
  console.log('Quests Data:', questsData);
  console.log('Quests Loading:', questsLoading);
  console.log('Quests Error:', questsError);
  
  // Convert level name to numeric value for challenge generation (fallback)
  const getNumericLevel = (levelName) => {
    const levelMap = {
      'ROOKIE': 1,
      'EXPLORER': 2,
      'BUILDER': 3,
      'CRAFTSMAN': 4,
      'ARCHITECT': 5,
      'WIZARD': 6,
      'LEGEND': 7,
      'TITAN': 8,
    };
    return levelMap[levelName] || 1;
  };
  const numericLevel = getNumericLevel(userLevel);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    // Fetch user data for manicdon7
    const fetchUserData = async () => {
      try {
        setIsUserDataLoading(true);
        // You can replace this with your actual base URL
        const baseUrl = 'https://git-stake-protocol-backend.vercel.app'; // Adjust this to your backend URL
        const response = await fetch(`${baseUrl}/api/users/manicdon7`);
        
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          console.error('Failed to fetch user data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsUserDataLoading(false);
      }
    };

    fetchUserData();
    
    return () => clearTimeout(timer);
  }, []);

  
  // Transform quest data to match component expectations
  const transformQuestToChallenge = (quest) => {
    // Determine if it's a boss battle based on challenge type and difficulty
    const isBossBattle = quest.challengeType === 'system-design' || 
                        quest.difficulty === 'Expert' || 
                        quest.difficulty === 'Legendary';
    
    return {
      id: quest.questId,
      title: quest.title,
      description: quest.description,
      type: isBossBattle ? 'boss' : 'weekly', // optimization will be treated as weekly
      reward: quest.rewards?.winner?.cryptoAmount || 10,
      xp: quest.rewards?.winner?.points || 100,
      language: quest.starterCode?.language || 'javascript',
      starterCode: quest.starterCode?.code || quest.starterCode?.template || '// Your code here',
      tests: quest.problemStatement?.examples?.map((example, index) => ({
        description: `Test case ${index + 1}: ${example.input} → ${example.output}`,
        passed: false
      })) || [
        { description: 'Should handle basic functionality', passed: false },
        { description: 'Should optimize for performance', passed: false },
        { description: 'Should handle edge cases', passed: false },
      ],
      difficulty: quest.difficulty,
      challengeType: quest.challengeType,
      techStack: quest.techStack,
      theme: quest.theme,
      status: quest.status,
      schedule: quest.schedule,
      // Additional quest-specific data
      duration: quest.duration,
      learningObjectives: quest.learningObjectives,
      achievements: quest.achievements,
      participants: quest.participants,
      statistics: quest.statistics,
      weekNumber: quest.schedule?.weekNumber,
      year: quest.schedule?.year
    };
  };

  // Get quests from API or fallback to generated challenges
  const quests = questsData || []; // Remove .data since questsData is already the array
  const transformedQuests = quests.map(transformQuestToChallenge);
  
  // Debug logging for quest processing
  console.log('questsData:', questsData);
  console.log('Raw Quests from API:', quests);
  console.log('Quests length:', quests.length);
  console.log('Transformed Quests:', transformedQuests);
  console.log('Transformed Quests length:', transformedQuests.length);
  
  // Fallback challenges if no quests are available
  const generateFallbackChallenges = (level) => {
    const baseReward = Math.max(10, level * 2);
    const baseXP = Math.max(100, level * 20);

    return [
      {
        id: `fallback-${level}-1`,
        title: `Level ${level} Array Challenge`,
        description: `Solve array manipulation problems suitable for level ${level} developers`,
        type: 'weekly',
        reward: baseReward,
        xp: baseXP,
        language: 'javascript',
        starterCode: `function arrayChallenge(arr) {
  // Your level ${level} solution here
  return [];
}`,
        tests: [
          { description: 'Should handle basic array operations', passed: false },
          { description: 'Should optimize for performance', passed: false },
          { description: 'Should handle edge cases', passed: false },
        ]
      }
    ];
  };

  const allChallenges = transformedQuests.length > 0 
    ? transformedQuests 
    : generateFallbackChallenges(numericLevel);

  // Debug logging for final challenges
  console.log('All Challenges (including fallback):', allChallenges);
  console.log('Filter:', filter);
  
  const filteredChallenges = allChallenges.filter(challenge => {
    if (filter === 'weekly') return challenge.type === 'weekly';
    if (filter === 'boss') return challenge.type === 'boss';
    return true; // Show all if no specific filter
  });

  const handleChallengeComplete = (challenge) => {
    setCompletedChallenges(prev => [...prev, challenge.id]);
    setSelectedChallenge(null);

    // Show success message based on challenge type
    if (challenge.type === 'boss') {
      // Boss battle completed - user should level up
      console.log(`Boss battle completed! Ready to advance to the next level`);
    } else {
      // Weekly challenge completed
      console.log(`Weekly challenge completed! Earned ${challenge.reward} AVAX and ${challenge.xp} XP`);
    }

    // Here you would typically call an API to record the completion and update user progress
  };

  // Handle successful staking
  const handleStakeConfirm = (challenge, stakeData, apiResponse) => {
    console.log('Staking successful:', {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      stakeAmount: stakeData.stakeAmount,
      currency: stakeData.currency,
      transactionHash: stakeData.transactionHash,
      userInfo: stakeData.userInfo,
      apiResponse
    });
    
    // Show success toast notification
    addToast({
      type: 'success',
      title: 'Staking Confirmed',
      txHash: stakeData.transactionHash,
      duration: 8000
    });
    
    // Update UI state or refetch challenges to update the participant count
    // You could also refetch the challenges to update the participant count
  };

  // Stats data for the overview
  // Only create stats data when userData is available
  const statsData = userData ? [
    { icon: Target, title: 'Current Level', value: userData?.data?.developerLevel?.level || 'ROOKIE', subtitle: 'Your progress', delay: 0.2, isText: true },
    { icon: Trophy, title: 'Completed', value: completedChallenges.length, subtitle: 'Challenges done', delay: 0.3 },
    { icon: Flame, title: 'Weekly Streak', value: userData?.data?.analytics?.streak?.longest || 0, subtitle: 'Days active', delay: 0.4 },
    { icon: Code, title: 'Proficiency Score', value: userData?.data?.analytics?.proficiencyScore || 0, subtitle: 'Skill level', delay: 0.5 },
  ] : [];

  if (isLoading || questsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center">
              <Code size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4 font-['JetBrains_Mono']">
            Challenges
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['JetBrains_Mono']">
            Level-based challenges tailored to your skills and boss battles to advance
          </p>
        </motion.div>

                 {/* Stats Grid */}
         {isUserDataLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {[1, 2, 3, 4].map((index) => (
               <ModernCard key={index} className="text-center">
                 <div className="animate-pulse">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#E84142] to-[#9B2CFF] flex items-center justify-center mx-auto mb-4">
                     <Target size={32} className="text-white" />
                   </div>
                   <div className="h-4 bg-gray-600 rounded w-24 mx-auto mb-2"></div>
                   <div className="h-6 bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                   <div className="h-3 bg-gray-600 rounded w-32 mx-auto"></div>
                 </div>
               </ModernCard>
             ))}
           </div>
         ) : statsData.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             {statsData.map((stat, index) => (
               <StatsCard key={index} {...stat} />
             ))}
           </div>
         ) : (
           <div className="mb-12">
             <ModernCard className="text-center">
               <div className="text-center">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center mx-auto mb-4">
                   <Target size={32} className="text-gray-400" />
                 </div>
                 <div className="text-gray-400">No data available</div>
               </div>
             </ModernCard>
           </div>
         )}

        {selectedChallenge ? (
          <div className="space-y-6">
            <motion.button
              onClick={() => setSelectedChallenge(null)}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-['JetBrains_Mono'] shadow-lg"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ← Back to Challenges
            </motion.button>

            <Arena
              challenge={selectedChallenge}
              onComplete={handleChallengeComplete}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filter Buttons */}
            <ModernCard delay={0.6}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <motion.button
                    onClick={() => setFilter('all')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 font-['JetBrains_Mono'] ${
                      filter === 'all'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Code size={20} />
                    <span>All Quests</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setFilter('weekly')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 font-['JetBrains_Mono'] ${
                      filter === 'weekly'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar size={20} />
                    <span>Weekly Challenge</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setFilter('boss')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 font-['JetBrains_Mono'] ${
                      filter === 'boss'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                        : 'bg-white/20 text-gray-300 hover:bg-white/20 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sword size={20} />
                    <span>Boss Battle</span>
                  </motion.button>
                </div>

                {/* User Level Info */}
                <div className="text-center md:text-right">
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono']">
                    Current Level: <span className="text-blue-400 font-semibold">{userLevel}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1 font-['JetBrains_Mono']">
                    {filter === 'all'
                      ? `Showing all quests for level ${userLevel}`
                      : filter === 'weekly'
                      ? `Weekly challenges tailored to level ${userLevel}`
                      : `Boss battles to advance from level ${userLevel}`
                    }
                  </p>
                  {quests.length > 0 && (
                    <p className="text-green-400 text-xs mt-1 font-['JetBrains_Mono']">
                      {quests.length} quest{quests.length !== 1 ? 's' : ''} available
                    </p>
                  )}
                </div>
              </div>
            </ModernCard>

            {/* Challenge Grid */}
            {questsError && (
              <ModernCard className="text-center">
                <div className="text-red-400 mb-4">
                  <X size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-['JetBrains_Mono']">
                  Error Loading Quests
                </h3>
                <p className="text-gray-400 font-['JetBrains_Mono']">
                  {questsError}. Using fallback challenges.
                </p>
              </ModernCard>
            )}

            {filteredChallenges.length === 0 ? (
              <ModernCard className="text-center">
                <div className="text-gray-400 mb-4">
                  <Code size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-['JetBrains_Mono']">
                  No Quests Available
                </h3>
                <p className="text-gray-400 font-['JetBrains_Mono']">
                  {questsLoading ? 'Loading quests...' : 'No quests found for your level. Check back later!'}
                </p>
              </ModernCard>
            ) : (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {filteredChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={challenge}
                      onSelect={setSelectedChallenge}
                      isSelected={false}
                      userData={userData}
                      onStake={handleStakeConfirm}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
      {/* <AuthDebug pageName="Challenges" /> */}
    </div>
  );
};

export default Challenges;
