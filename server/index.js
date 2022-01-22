import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer((req, res) => {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  res.end('Hello World');
});

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: false,
  },
});

io.on('connection', (socket) => {
  console.log('new connection', socket.id);
  socket.on('join-room', (roomId, userId) => {
    //adiciona os usuarios na mesma sala
    console.log('joins room', roomId, userId);
    socket.join(roomId);
    io.to(roomId).emit('user-connected', userId);
    socket.on('disconnect', () => {
      console.log('user disconnected', roomId, userId);
      io.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const startServer = () => {
  const { address, port } = server.address();
  console.info(`Server running at http://${address}:${port}`);
};

server.listen(process.env.PORT || 3000, startServer);
