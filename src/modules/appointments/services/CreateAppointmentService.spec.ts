import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  })
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 10, 12).getTime());

    const appointment = await createAppointment.execute({
      date: new Date(2021, 4, 10, 13),
      provider_id: '123123123',
      user_id: 'user',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
      user_id: 'user',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
      user_id: 'user',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 10, 12).getTime());

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 10, 11),
      provider_id: '123123123',
      user_id: 'user',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 10, 12).getTime());

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 10, 13),
      provider_id: 'user',
      user_id: 'user',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2021, 4, 10, 12).getTime());

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 11, 7),
      provider_id: 'user',
      user_id: 'user-id',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 11, 18),
      provider_id: 'user',
      user_id: 'user-id',
    })).rejects.toBeInstanceOf(AppError);
  });
});
