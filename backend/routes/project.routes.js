import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleWare from '../middleware/auth.middleware.js';

const router = Router();


router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)

router.get('/all',
    authMiddleWare.authUser,
    projectController.getAllProject
)

router.put('/add-user',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)

router.put('/add-user-by-email',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    projectController.addUserToProjectByEmail
)

router.get('/get-project/:projectId',
    authMiddleWare.authUser,
    projectController.getProjectById
)

router.put('/update-file-tree',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)

router.get('/messages/:projectId',
    authMiddleWare.authUser,
    projectController.getProjectMessages
);

router.post('/messages',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('message').isString().withMessage('Message is required'),
    projectController.addMessage
);


export default router;