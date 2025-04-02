import { useState, useEffect, useRef } from "preact/hooks";

const Timer = () => {
    const timerRef = useRef(null);
    const [time, setTime] = useState({ seconds: 0, minutes: 0, hours: 0, days: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [input, setInput] = useState({ name: "", description: "", days: 0, hours: 0, minutes: 0 });
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTime((prevTime) => {
                let { seconds, minutes, hours, days } = prevTime;
                seconds += 1;

                if (seconds === 60) {
                    seconds = 0;
                    minutes += 1;
                }
                if (minutes === 60) {
                    minutes = 0;
                    hours += 1;
                }
                if (hours === 24) {
                    hours = 0;
                    days += 1;
                }

                return { seconds, minutes, hours, days };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleNext = (id, days, hours, minutes) => {
        setTime({ seconds: 0, minutes, hours, days });
        timerRef.current = { id, days, hours, minutes, seconds: 0 };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, id: Date.now(), [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.name.trim()) return;
        setTasks([...tasks, input]);
        setInput({ name: "", description: "", days: 0, hours: 0, minutes: 0 });
    };

    const handleDelete = (id) => {
        const newTask = tasks.filter(task => task.id !== id)
        setTasks(newTask);
        localStorage.setItem('tasks', JSON.stringify(newTask));
    };

    const handlePause = () => {
        setTasks(tasks.map(task =>
            task.id === timerRef.current?.id
                ? { ...task, ...time }
                : task
        ));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        setIsRunning(false);
    };

    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks, isRunning]);
    

    return (
        <div className="flex flex-col">
            <h1 className="text-[1.8rem] text-center font-bold text-red-400">Temporizador de Tareas</h1>
            <span className="flex flex-col text-center text-[2rem]">
                {time.days}d : {time.hours}h : {time.minutes}m : {time.seconds}s
            </span>
            <div className="flex  flex-row flex-wrap justify-center gap-3 mb-4 mt-6">
                <button onClick={() => setIsRunning(true)}
                    className="rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-green-800">
                    Iniciar
                </button>
                <button onClick={handlePause}
                    className="rounded-lg px-6 py-1 bg-neutral-800 text-neutral-200 transition hover:bg-blue-600">
                    Pausar
                </button>
                <button onClick={() => { setIsRunning(false); localStorage.setItem('tasks', JSON.stringify(tasks)); setTime({ seconds: 0, minutes: 0, hours: 0, days: 0 });  }} disabled
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
                    {tasks.map(item => (
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
                                <button onClick={() => handleNext(item.id, item.days, item.hours, item.minutes)}
                                    className="bg-blue-700 w-22 py-1 rounded hover:bg-blue-800">
                                    Utilizar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Timer;
