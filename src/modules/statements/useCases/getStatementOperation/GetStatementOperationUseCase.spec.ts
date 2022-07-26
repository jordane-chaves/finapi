import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('should be able to get a statement operation', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Statement',
      email: 'user@statement.com',
      password: 'statement-test'
    });

    const statement = await createStatementUseCase.execute({
      amount: 150,
      description: 'Deposit a new value',
      type: 'deposit',
      user_id: user.id as string,
    } as ICreateStatementDTO);

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty('id');
    expect(statementOperation.id).toEqual(statement.id);
    expect(statementOperation.user_id).toEqual(user.id);
  });
});
