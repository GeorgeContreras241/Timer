import { motion } from 'motion/react'

export const List = ({ item, handleDelete, handleNext }) => {
  return (
    <motion.li
      key={item.id}
      layoutId={item.id}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
      exit={{
        x: 40,
        opacity: 0,
        transition: { duration: .5, ease: 'easeInOut' }
      }}
      className='flex flex-row max-w-[600px] items-center justify-between gap-4 p-2 px-6 rounded-lg h-22'
    >
      <div>
        <p className='text-lg font-bold'>{item.name}</p>
        <p className='text-sm text-neutral-400'>{item.description}</p>
        <span className='text-[1rem] font-bold'>
          {item.days ? `${item.days}d :` : ''} {item.hours}h : {item.minutes}m
        </span>
      </div>
      <div className='flex flex-col gap-2'>
        <button
          onClick={() => handleDelete(item.id)}
          className='bg-blue-700 w-22 py-1 rounded hover:bg-blue-800'
        >
          Eliminar
        </button>
        <button
          onClick={() =>
            handleNext(item.id, item.days, item.hours, item.minutes, item.seco)
          }
          className='bg-blue-700 w-22 py-1 rounded hover:bg-blue-800'
        >
          Utilizar
        </button>
      </div>
    </motion.li>
  )
}
