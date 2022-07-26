import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { GetBalanceError } from './GetBalanceError';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to get the balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'User get-balance',
      email: 'balance-test@user.com',
      password: 'balance-test'
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(balance).toHaveProperty('statement');
    expect(balance).toHaveProperty('balance');
  });

  it('should not be able to get the balance of the non-existing account', async () => {
    await expect(getBalanceUseCase.execute({
      user_id: 'non-existing-account-id'
    })).rejects.toBeInstanceOf(GetBalanceError);
  });
});
