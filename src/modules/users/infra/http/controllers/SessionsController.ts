import { Request, Response } from 'express';
import SessionService from '@modules/users/services/SessionService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const sessionService = container.resolve(SessionService);

    const { user, token } = await sessionService.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
