import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;
let createUserService: CreateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);
    createUserService = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able to update the profile', async () => {
    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
    });

    expect(updatedUser.name).toBe('Jhon Trê');
    expect(updatedUser.email).toBe('jhontre@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    const user = await createUserService.execute({
      name: 'Test',
      email: 'test@example.com',
      password: '123123',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhondoe@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password whitout old password', async () => {
    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password whit wrong old password', async () => {
    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
      old_password: 'wrong-old-password',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });
});
