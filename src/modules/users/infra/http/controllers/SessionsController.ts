import { Request, Response } from 'express';
import SessionService from '@modules/users/services/SessionService';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const sessionService = container.resolve(SessionService);

    const { user, token } = await sessionService.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
