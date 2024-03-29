import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    sender_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      sender_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne({
      where: [
        {
          id: statement_id,
          user_id
        },
        {
          id: statement_id,
          sender_id: user_id
        }
      ],
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: [{ user_id }, { sender_id: user_id }]
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + parseFloat(`${operation.amount}`);
      } else if(operation.type === 'transfer') {
        return operation.sender_id === user_id
          ? acc - parseFloat(`${operation.amount}`)
          : acc + parseFloat(`${operation.amount}`);
      } else {
        return acc - parseFloat(`${operation.amount}`);
      }
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
