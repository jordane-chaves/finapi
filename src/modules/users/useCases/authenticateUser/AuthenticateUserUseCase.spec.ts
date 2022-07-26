import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to authenticate user', async () => {
    const email = 'test@test.com';
    const password = 'test';

    await createUserUseCase.execute({
      name: 'Test Auth',
      email,
      password,
    });

    const authUserResponse = await authenticateUserUseCase.execute({
      email,
      password,
    });

    expect(authUserResponse).toHaveProperty('token');
  });

  it('should not be possible to authenticate a non-existent user', async () => {
    await expect(authenticateUserUseCase.execute({
      email: 'non-existent-user@test.com',
      password: 'test-password',
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
