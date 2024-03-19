const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const app = express();

app.use(cors());

const tasks = [];

const server = app.listen(8000, () => {
  console.log('Server running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const taskIndex = tasks.findIndex((elem) => elem.id === taskId);
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', taskId);
  });
});
