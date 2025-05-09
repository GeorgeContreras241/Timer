import { motion} from 'motion/react'

export const Title = ({ time }) => {
  return (
    <>
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        className='text-[1.8rem] text-center font-bold text-red-400'
      >
        Temporizador de Tareas
      </motion.h1>
      <span className='flex flex-col text-center text-[2rem]'>
        {time.days}d : {time.hours}h : {time.minutes}m : {time.seconds}s
      </span>
    </>
  )
}
