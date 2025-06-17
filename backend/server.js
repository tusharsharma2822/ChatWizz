import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }


        socket.project = await projectModel.findById(projectId);


        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

})


io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()


    console.log('a user connected');



    socket.join(socket.roomId);


    // Listen for project-updated and broadcast to room
    socket.on('project-updated', (data) => {
        io.to(socket.roomId).emit('project-updated', data);
    });

    // Listen for project-message and broadcast to room
    socket.on('project-message', (data) => {
        io.to(socket.roomId).emit('project-message', data);
    });

    socket.on('join-dashboard', (userId) => {
        socket.join(`dashboard-${userId}`);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId)
    });
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// In your addUserToProject controller, after updating the project:
// Notify all added users and the current use
io = req.app.get('io');
[...users, loggedInUser._id].forEach(userId => {
    io.to(`dashboard-${userId}`).emit('project-list-updated');
});