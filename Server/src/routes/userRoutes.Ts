import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/reset-password', userController.resetUserPassword);

router.get('/', userController.getAllUsers);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);



export default router;