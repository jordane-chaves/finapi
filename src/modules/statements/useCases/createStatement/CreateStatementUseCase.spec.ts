import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create Statement', () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to make a deposit', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user-deposit@test.com',
      password: 'deposit-test',
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: 'Deposit a value',
      type: 'deposit',
      user_id: user.id as string
    } as ICreateStatementDTO);

    expect(statement).toHaveProperty('id');
    expect(statement.user_id).toEqual(user.id);
    expect(statement.amount).toEqual(100);
  });
});
