import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create Statement', () => {
  beforeEach(() => {
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

  it('should be able to make a withdraw', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Withdraw',
      email: 'user-withdraw@test.com',
      password: 'withdraw-test',
    });

    await createStatementUseCase.execute({
      amount: 100,
      description: 'Deposit a value',
      type: 'deposit',
      user_id: user.id as string
    } as ICreateStatementDTO);

    const statement = await createStatementUseCase.execute({
      amount: 50,
      description: 'Deposit a value',
      type: 'withdraw',
      user_id: user.id as string
    } as ICreateStatementDTO);

    expect(statement).toHaveProperty('id');
    expect(statement.user_id).toEqual(user.id);
    expect(statement.amount).toEqual(50);
  });

  it('should not be able to make a deposit to a non-existing account', async () => {
    await expect(createStatementUseCase.execute({
      amount: 500,
      description: 'Deposit a value',
      type: 'deposit',
      user_id: 'non-existing-deposit-id'
    } as ICreateStatementDTO))
      .rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to make a withdraw to a non-existing account', async () => {
    await expect(createStatementUseCase.execute({
      amount: 300,
      description: 'Withdraw a value',
      type: 'withdraw',
      user_id: 'non-existing-withdraw-id'
    } as ICreateStatementDTO))
      .rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to make a withdrawal for insufficient funds', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user-insufficient-founds@test.com',
      password: 'insufficient-test',
    });

    await createStatementUseCase.execute({
      amount: 200,
      description: 'Deposit a value',
      type: 'deposit',
      user_id: user.id as string
    } as ICreateStatementDTO);

    await expect(createStatementUseCase.execute({
      amount: 600,
      description: 'Try withdraw insufficient value',
      type: 'withdraw',
      user_id: user.id as string
    } as ICreateStatementDTO))
      .rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it('should be able to make a transfer', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'Sender User',
      email: 'sender-user-transfer@test.com',
      password: 'transfer-test',
    });

    const receiverUser = await createUserUseCase.execute({
      name: 'Receiver User',
      email: 'receiver-user-transfer@test.com',
      password: 'transfer-test-receiver',
    });

    await createStatementUseCase.execute({
      amount: 100,
      description: 'Deposit a value',
      type: 'deposit',
      user_id: senderUser.id,
    } as ICreateStatementDTO);

    const statement = await createStatementUseCase.execute({
      amount: 50,
      description: 'Transfer a value',
      type: 'transfer',
      user_id: receiverUser.id,
      sender_id: senderUser.id
    } as ICreateStatementDTO);

    expect(statement).toHaveProperty('id');
    expect(statement).toHaveProperty('sender_id');
  });

  it('should not be able to make a transfer with insufficient funds', async () => {
    const senderUser = await createUserUseCase.execute({
      name: 'Sender User Transfer',
      email: 'sender-user-insufficient-founds@test-insufficient-funds.com',
      password: 'insufficient-test-transfer',
    });

    const receiverUser = await createUserUseCase.execute({
      name: 'Receiver User Transfer',
      email: 'receiver-user-transfer@test-insufficient-funds.com',
      password: 'any-password',
    });

    await createStatementUseCase.execute({
      amount: 200,
      description: 'Deposit a value',
      type: 'deposit',
      user_id: senderUser.id
    } as ICreateStatementDTO);

    await expect(createStatementUseCase.execute({
      amount: 600,
      description: 'Try transfer insufficient value',
      type: 'transfer',
      user_id: receiverUser.id,
      sender_id: senderUser.id
    } as ICreateStatementDTO))
      .rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
