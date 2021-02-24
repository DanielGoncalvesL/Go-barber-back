import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../service/CreateUserService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../service/UpdateUserAvatarService';


const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {

    const {name, email, password} = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password
    });

    const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        };


    return response.json(userWithoutPassword);

});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
    });

    return response.json(user);
});

export default usersRouter;