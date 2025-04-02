import { useState, useEffect, useRef } from "preact/hooks";

const Timer = () => {
    const timerRef = useRef(null);
    const [time, setTime] = useState({ seconds: 0, minutes: 0, hours: 0, days: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [input, setInput] = useState({ name: "", description: "", days: 0, hours: 0, minutes: 0 });
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);

    useEffect(() => {
        if (!isRunning) return;

        timerRef.current = setInterval(() => {
            setTime(({ seconds, minutes, hours, days }) => {
                seconds++;
                if (seconds === 60) { seconds = 0; minutes++; }
                if (minutes === 60) { minutes = 0; hours++; }
                if (hours === 24) { hours = 0; days++; }
                return { seconds, minutes, hours, days };
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const handleNext = (id, days, hours, minutes) => {
        setTime({ seconds: 0, minutes, hours, days });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.name.trim()) return;
        const newTasks = [...tasks, { ...input, id: Date.now() }];
        setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setInput({ name: "", description: "", days: 0, hours: 0, minutes: 0 });
    };

    const handleDelete = (id) => {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const handlePause = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
    };

    const handleReset = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setTime({ seconds: 0, minutes: 0, hours: 0, days: 0 });
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-[1.8rem] text-center font-bold text-red-400">Temporizador de Tareas</h1>
            <span className="flex flex-col text-center text-[2rem]">
                {time.days}d : {time.hours}h : {time.minutes}m : {time.seconds}s
            </span>
            <div className="flex flex-row flex-wrap justify-center gap-3 mb-4 mt-6">
                <button onClick={() => setIsRunning(true)} className="rounded-lg px-6 py-1 bg-green-700 text-white">Iniciar</button>
                <button onClick={handlePause} className="rounded-lg px-6 py-1 bg-blue-700 text-white">Pausar</button>
                <button onClick={handleReset} className="rounded-lg px-6 py-1 bg-red-700 text-white">Reiniciar</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
                <input name="name" type="text" value={input.name} onInput={handleChange} placeholder="Nombre" required className="p-2 border rounded" />
                <input name="description" type="text" value={input.description} onInput={handleChange} placeholder="Descripción" className="p-2 border rounded" />
                <button type="submit" className="p-2 bg-red-500 text-white rounded">Agregar</button>
            </form>
            <ul className="mt-4">
                {tasks.map(item => (
                    <li key={item.id} className="p-2 border rounded flex justify-between">
                        <div>
                            <p className="font-bold">{item.name}</p>
                            <p>{item.description}</p>
                        </div>
                        <div>
                            <button onClick={() => handleDelete(item.id)} className="p-1 bg-blue-500 text-white rounded">Eliminar</button>
                            <button onClick={() => handleNext(item.id, item.days, item.hours, item.minutes)} className="p-1 bg-green-500 text-white rounded">Utilizar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Timer;