import { Router } from 'express';
import SessionService from '@modules/users/services/SessionService';
import { container } from 'tsyringe';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const sessionService = container.resolve(SessionService);

  const { user, token } = await sessionService.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
