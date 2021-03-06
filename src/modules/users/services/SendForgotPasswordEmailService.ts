// import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest{
    email:string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private usersToken: IUsersTokenRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.')
    }

    const { token } = await this.usersToken.generate(user.id);

    await this.mailProvider.sendMail(email, `Pedido de recuperação de senha recebido: ${token}`)
  }
}

export default SendForgotPasswordEmailService;
