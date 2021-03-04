import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
// import AppError from '@shared/errors/AppError';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeUsersTokenRepository from '@modules/users/repositories/fakes/FakeUsersTokenRepository';

let fakeUserRepository: FakeUserRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let resetPasswordService: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUsersTokenRepository = new FakeUsersTokenRepository();
    resetPasswordService = new ResetPasswordService(fakeUserRepository, fakeUsersTokenRepository)
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUsersTokenRepository.generate(user.id);

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
  });
});
