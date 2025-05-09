import { motion } from 'motion/react'

export const Buttons = ({handleStart, handlePause, handleReset}) => {
  return (
    <div className='flex  flex-row flex-wrap justify-center gap-3 mb-4 mt-6'>
      <motion.button
        onClick={handleStart}
        initial={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.1, ease: 'linear' }}
        className='rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-green-800'
      >
        Iniciar
      </motion.button>
      <motion.button
        onClick={handlePause}
        initial={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.1, ease: 'linear' }}
        className='rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-blue-600'
      >
        Pausar
      </motion.button>
      <button
        onClick={handleReset}
        className='rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-red-800 cursor-not-allowed'
      >
        Reiniciar
      </button>
    </div>
  )
}
