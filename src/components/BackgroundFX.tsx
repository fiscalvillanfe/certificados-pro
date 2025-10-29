'use client';
import { motion } from 'framer-motion';

export default function BackgroundFX() {
  // mantenho em z-0
  const common = 'absolute rounded-full blur-3xl opacity-25 pointer-events-none';

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* gradiente suave */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_10%_10%,rgba(76,124,255,0.12),transparent_60%),radial-gradient(40%_30%_at_90%_0%,rgba(39,73,198,0.10),transparent_60%)]" />

      {/* bolha 1 */}
      <motion.div
        className={`${common} w-[40vw] h-[40vw] bg-[#4C7CFF]`}
        style={{ left: '-10%', top: '-10%' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* bolha 2 */}
      <motion.div
        className={`${common} w-[35vw] h-[35vw] bg-[#2749C6]`}
        style={{ right: '-12%', top: '-8%' }}
        animate={{ x: [0, -25, 15, 0], y: [0, 15, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* bolha 3 */}
      <motion.div
        className={`${common} w-[50vw] h-[50vw] bg-[#203CA0]`}
        style={{ left: '20%', bottom: '-20%' }}
        animate={{ x: [0, 20, -15, 0], y: [0, -10, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,0,0,0)_40%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}
