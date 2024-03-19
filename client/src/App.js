import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });

    socket.on('updateData', (tasks) => {
      updateData(tasks);
    });

    socket.on('addTask', (task) => {
      addTask(task);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateData = (tasksData) => {
    setTasks(tasksData);
  };

  const removeTask = (taskId, emitToServer) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));

    if (emitToServer) {
      socket.emit('removeTask', taskId);
    }
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
    setTaskName('');
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!taskName) {
      alert('Type what you have to do...');
    } else {
      const task = { name: taskName, id: uuidv4() };
      addTask(task);
      socket.emit('addTask', task);
    }
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => (
            <li key={task.id} className='task'>
              {task.name}
              <button
                className='btn btn--red'
                onClick={() => removeTask(task.id, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id='add-task-form' onSubmit={(e) => submitForm(e)}>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            placeholder='Type your description'
            id='task-name'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
