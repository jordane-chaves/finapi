import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show User Profile', () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be possible to display the user's profile", async () => {
    const user = await createUserUseCase.execute({
      name: 'Test user',
      email: 'user@test.com',
      password: 'user-test',
    });

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toHaveProperty('id');
  });

  it('should not be possible to display the profile of a non-existing user', async () => {
    await expect(showUserProfileUseCase.execute('non-existing-user-id'))
      .rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
