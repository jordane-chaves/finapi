import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { GetStatementOperationError } from './GetStatementOperationError';
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

  it('should be able to get a transfer statement operation', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'Sender User Test',
      email: 'sender-user@test.com',
      password: 'any-password',
    });

    const receiverUser = await createUserUseCase.execute({
      name: 'Receiver User Test',
      email: 'receiver-user@test.com',
      password: 'any-password',
    });

    await createStatementUseCase.execute({
      amount: 100,
      description: 'Deposit a new value',
      type: 'deposit',
      user_id: senderUser.id,
    } as ICreateStatementDTO);

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: 'Transfer a value',
      type: 'transfer',
      user_id: receiverUser.id,
      sender_id: senderUser.id,
    } as ICreateStatementDTO);

    await expect(getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: senderUser.id as string,
    })).resolves.toEqual(statement);
  });

  it('should not be possible to get an operation from a non-existing account', async () => {
    await expect(getStatementOperationUseCase.execute({
      statement_id: 'statement-id',
      user_id: 'id-non-existing-account',
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be possible to get an non-existing operation', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Statement',
      email: 'user@operation-non-existing.com',
      password: 'non-existing-operation-test'
    });

    await expect(getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: 'id-non-existing-statement',
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
