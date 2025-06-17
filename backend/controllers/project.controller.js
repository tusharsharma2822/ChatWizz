import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';
import Message from '../models/message.model.js';


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }



}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })
        // --- Real-time dashboard update ---
        const io = req.app.get('io');
        if (io) {
            [...users, loggedInUser._id].forEach(userId => {
                io.to(`dashboard-${userId}`).emit('project-list-updated');
            });
        }
        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const addUserToProjectByEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, email } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(404).json({ error: 'Logged in user not found' });
        }
        const userToAdd = await userModel.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ error: 'User with this email not found' });
        }
        const project = await projectService.addUsersToProject({
            projectId,
            users: [userToAdd._id],
            userId: loggedInUser._id
        });
        return res.status(200).json({ project });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const getProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;
        const messages = await Message.find({ projectId }).populate('sender', 'email');
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addMessage = async (req, res) => {
    try {
        console.log('addMessage req.user:', req.user);
        console.log('addMessage req.body:', req.body);
        const { projectId, message } = req.body;
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized: user not found in token' });
        }
        if (!projectId || !message) {
            return res.status(400).json({ error: 'projectId and message are required' });
        }
        const sender = req.user._id;
        const newMessage = await Message.create({ projectId, sender, message });
        await newMessage.populate('sender', 'email');
        res.status(201).json({ message: newMessage });
    } catch (err) {
        console.log('addMessage error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.status(200).json({ user: req.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};