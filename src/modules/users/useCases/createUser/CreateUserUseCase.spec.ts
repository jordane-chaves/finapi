import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test User',
      email: 'test-user@test.com',
      password: 'test-user-1234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create an already existing user', async () => {
    const user = {
      name: 'Test User Existing',
      email: 'existing-user@test.com',
      password: '1234test',
    };

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user))
      .rejects.toBeInstanceOf(CreateUserError);
  });
});
