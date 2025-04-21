const { Server } = require('socket.io');
const io = new Server(8000, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('join-user', name => {
        users[socket.id] = { name, id: socket.id };
        io.emit('user-joined', users);
    });

    socket.on('offer', ({ from, to, offer }) => {
        // console.log('Received offer on server:', offer);
        if (users[to]) socket.to(to).emit('offer', { from, to, offer });
    });

    socket.on('answer', ({ from, to, answer }) => {
        // console.log('Received answer on server:', answer);
        if (users[to]) socket.to(to).emit('answer', { from, to, answer });
    });

    socket.on('icecandidate', ({ candidate, to }) => {
        // console.log('Forwarding ICE candidate:', candidate);
        socket.to(to).emit('icecandidate', { candidate, from: socket.id });
    });

    socket.on('end-call', ({ from, to }) => {
        // console.log('Call ended on server');
        socket.to(to).emit('call-ended', { from });
    });

    socket.on('remote-busy', ({ from, to }) => {
        socket.to(to).emit('remote-busy', { from });
    });

    socket.on('leave-user', () => {
        delete users[socket.id];
        io.emit('user-left', users);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('user-left', users);
    });
})