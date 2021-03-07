import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepositories from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest{
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}
@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepositories,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id, name, email, old_password, password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Email already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('You need to inform the old password to set a new password.');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(user.password, old_password);

      if (!checkOldPassword) {
        throw new AppError('Old password this not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
