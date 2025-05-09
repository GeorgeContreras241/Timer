import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { List } from './List'
import { Form } from './Form'
import { Buttons } from './Buttons'
import { Title } from './Title'

const Timer = () => {
  const timerRef = useRef(Date.now())
  const timerRef1 = useRef(null)
  const [time, setTime] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0
  })
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState({
    name: '',
    description: '',
    days: 0,
    hours: 0,
    minutes: 0
  })
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem('tasks')) || []
  )
  const tasksRef = useRef(tasks)

  useEffect(() => {
    if (!isRunning) return

    const startTime = localStorage.getItem('timerStart')
      ? Number(localStorage.getItem('timerStart'))
      : Date.now()
    timerRef.current = startTime
    localStorage.setItem('timerStart', startTime)

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - timerRef.current) / 1000)
      const days = Math.floor(elapsed / 86400)
      const hours = Math.floor((elapsed % 86400) / 3600)
      const minutes = Math.floor((elapsed % 3600) / 60)
      const seconds = elapsed % 60
      setTime({ seconds, minutes, hours, days })
    }

    const interval = setInterval(updateTimer, 1000)
    updateTimer()

    return () => clearInterval(interval)
  }, [isRunning])

  const handleStart = () => {
    if (!isRunning) {
      timerRef.current =
        Date.now() -
        (time.days * 86400000 +
          time.hours * 3600000 +
          time.minutes * 60000 +
          time.seconds * 1000)
      localStorage.setItem('timerStart', timerRef.current)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
    localStorage.removeItem('timerStart')
    const newTasks = tasks.map(item =>
      item.id === timerRef1.current?.id
        ? {
            ...item,
            seconds: time.seconds,
            minutes: time.minutes,
            hours: time.hours,
            days: time.days
          }
        : item
    )
    setTasks(newTasks)
  }
  const handleReset = () => {
    setIsRunning(false)
    setTime({ seconds: 0, minutes: 0, hours: 0, days: 0 })
    localStorage.removeItem('timerStart')
  }
  const handleChange = e => {
    const { name, value } = e.target
    setInput(prev => ({ ...prev, id: Date.now(), [name]: value }))
  }
  const handleNext = (id, days, hours, minutes) => {
    setTime({ seconds: 0, minutes, hours, days })
    timerRef1.current = { id, days, hours, minutes, seconds: 0 }
  }
  const handleDelete = id => {
    const newTask = tasks.filter(task => task.id !== id)
    setTasks(newTask)
    localStorage.setItem('tasks', JSON.stringify(newTask))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!input.name.trim()) return
    setTasks([...tasks, input])
    setInput({ name: '', description: '', days: 0, hours: 0, minutes: 0 })
  }
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className='flex flex-col'>
      <Title time={time} />
      <Buttons
        handleStart={handleStart}
        handlePause={handlePause}
        handleReset={handleReset}
      />
      <Form
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        input={input}
      />
      ;
      <section className='max-w-[600px] w-full mx-auto mt-4'>
        <h2 className='text-center text-2xl font-bold'>Tareas</h2>
        <AnimatePresence mode='popLayout'>

          <motion.ul
            className='flex flex-col gap-3 mt-4'
            layout
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
          >
            {tasks && tasks.length > 0 ? (
              tasks.map(item => (
                <List
                  key={item.id}
                  item={item}
                  handleDelete={handleDelete}
                  handleNext={handleNext}
                />
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='text-center text-sm text-neutral-400'
              >
                No tienes tareas
              </motion.p>
            )}
          </motion.ul>
        </AnimatePresence>
      </section>
    </div>
  )
}

export default Timer

/**
     * 
     * useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    useEffect(() => {
        if (!isRunning || !timerRef1.current?.id) return;

        const interval = setInterval(() => {
            const updatedTasks = tasksRef.current.map(item =>
                item.id === timerRef1.current.id
                    ? { ...item, seconds: time.seconds, minutes: time.minutes, hours: time.hours, days: time.days }
                    : item
            );
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }, 120000); // cada 2 minutos

        return () => clearInterval(interval);
    }, [isRunning, time, tasks]);
     */
