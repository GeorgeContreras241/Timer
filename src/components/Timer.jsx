
import { useState, useEffect, useRef } from "react";


const Timer = () => {
    const timerRef = useRef(Date.now());
    const timerRef1 = useRef(null);
    const [time, setTime] = useState({ seconds: 0, minutes: 0, hours: 0, days: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [input, setInput] = useState({ name: "", description: "", days: 0, hours: 0, minutes: 0 });
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
    const tasksRef = useRef(tasks);

    useEffect(() => {
        if (!isRunning) return;

        const startTime = localStorage.getItem('timerStart') ? Number(localStorage.getItem('timerStart')) : Date.now();
        timerRef.current = startTime;
        localStorage.setItem('timerStart', startTime);

        const updateTimer = () => {
            const elapsed = Math.floor((Date.now() - timerRef.current) / 1000);
            const days = Math.floor(elapsed / 86400);
            const hours = Math.floor((elapsed % 86400) / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = elapsed % 60;
            setTime({ seconds, minutes, hours, days });
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStart = () => {
        if (!isRunning) {
            timerRef.current = Date.now() - (time.days * 86400000 + time.hours * 3600000 + time.minutes * 60000 + time.seconds * 1000);
            localStorage.setItem('timerStart', timerRef.current);
        }
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
        localStorage.removeItem('timerStart');
        const newTasks = tasks.map(item =>
            item.id === timerRef1.current?.id
                ? { ...item, seconds: time.seconds, minutes: time.minutes, hours: time.hours, days: time.days }
                : item
        )
        setTasks(newTasks);

    };
    const handleReset = () => {
        setIsRunning(false);
        setTime({ seconds: 0, minutes: 0, hours: 0, days: 0 });
        localStorage.removeItem('timerStart');
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, id: Date.now(), [name]: value }));
    };
    const handleNext = (id, days, hours, minutes) => {
        setTime({ seconds: 0, minutes, hours, days });
        timerRef1.current = { id, days, hours, minutes, seconds: 0 };
    };
    const handleDelete = (id) => {
        const newTask = tasks.filter(task => task.id !== id)
        setTasks(newTask);
        localStorage.setItem('tasks', JSON.stringify(newTask));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.name.trim()) return;
        setTasks([...tasks, input]);
        setInput({ name: "", description: "", days: 0, hours: 0, minutes: 0 });
    };
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

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


    return (
        <div className="flex flex-col">
            <h1 className="text-[1.8rem] text-center font-bold text-red-400">Temporizador de Tareas</h1>
            <span className="flex flex-col text-center text-[2rem]">
                {time.days}d : {time.hours}h : {time.minutes}m : {time.seconds}s
            </span>
            <div className="flex  flex-row flex-wrap justify-center gap-3 mb-4 mt-6">
                <button onClick={handleStart}
                    className="rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-green-800">
                    Iniciar
                </button>
                <button onClick={handlePause}
                    className="rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-blue-600">
                    Pausar
                </button>
                <button onClick={handleReset}
                    className="rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-red-800 cursor-not-allowed">
                    Reiniciar
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4 min-w-[200px] mx-auto max-w-120 bg-neutral-800 rounded-lg p-4">
                <h3 className="text-center text-lg font-bold">Agregar Acción</h3>
                <label htmlFor="name" className="text-neutral-400">Nombre</label>
                <input name="name" type="text" value={input.name} onInput={handleChange} required
                    className="bg-neutral-900 rounded-lg p-1 px-6 w-full outline-none focus:ring-2 focus:ring-red-400" />
                <label htmlFor="description" className="text-neutral-400">Descripción</label>
                <input type="text" name="description" value={input.description} onInput={handleChange}
                    className="bg-neutral-900 rounded-lg p-1 px-6 max-w-[600px]  w-full  outline-none focus:ring-2 focus:ring-red-400" />
                <div className="flex flex-row flex-wrap gap-2 justify-around">
                    <label htmlFor="days" className="text-neutral-400">Días : <span> </span>
                        <input name="days" type="number" value={input.days} onInput={handleChange} min={0}
                            className="text-center bg-neutral-900 rounded-lg p-1 w-[4rem] outline-none focus:ring-2 focus:ring-red-400" />
                    </label>

                    <label htmlFor="hours" className="text-neutral-400">Horas : <span> </span>
                        <input name="hours" type="number" value={input.hours} onInput={handleChange} min={0} max={24}
                            className="text-center bg-neutral-900 rounded-lg p-1 w-[4rem] outline-none focus:ring-2 focus:ring-red-400" />
                    </label>

                    <label htmlFor="minutes" className="text-neutral-400">Minutos : <span> </span>
                        <input name="minutes" type="number" value={input.minutes} onInput={handleChange} max={60} min={0}
                            className="text-center bg-neutral-900 rounded-lg p-1 w-[4rem] outline-none focus:ring-2 focus:ring-red-400" />
                    </label>

                </div>
                <button type="submit"
                    className="bg-red-700 rounded-lg py-2 text-white hover:bg-red-800">
                    Agregar
                </button>
            </form>
            <section className="max-w-[600px] w-full mx-auto mt-4">
                <h2 className="text-center text-2xl font-bold">Tareas</h2>
                <ul className="flex flex-col gap-3 mt-4">
                    {tasks && tasks.length > 0 ? tasks.map(item => (
                        <li key={item.id} className="flex flex-row max-w-[600px] items-center justify-between gap-4 p-2 px-6 rounded-lg">
                            <div>
                                <p className="text-lg font-bold">{item.name}</p>
                                <p className="text-sm text-neutral-400">{item.description}</p>
                                <span className="text-[1rem] font-bold">
                                    {item.days ? `${item.days}d :` : ""} {item.hours}h : {item.minutes}m
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleDelete(item.id)}
                                    className="bg-blue-700 w-22 py-1 rounded hover:bg-blue-800">
                                    Eliminar
                                </button>
                                <button onClick={() => handleNext(item.id, item.days, item.hours, item.minutes, item.seco)}
                                    className="bg-blue-700 w-22 py-1 rounded hover:bg-blue-800">
                                    Utilizar
                                </button>
                            </div>
                        </li>
                    )) : <p className=" text-center text-sm text-neutral-400">No tienes tareas</p>}
                </ul>
            </section>
        </div>
    );
};

export default Timer;
