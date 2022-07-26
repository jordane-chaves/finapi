import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRespository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show User Profile', () => {
  beforeAll(() => {
    inMemoryUsersRespository = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRespository
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRespository);
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
});
