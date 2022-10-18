import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Statement } from '../../entities/Statement';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const splittedPath = request.originalUrl.split('/');
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    let statement: Statement;

    if (String(type) === 'deposit' || String(type) === 'withdraw') {
      statement = await createStatement.execute({
        user_id: sender_id,
        type,
        amount,
        description
      });
    } else {
      statement = await createStatement.execute({
        user_id,
        type: 'transfer' as OperationType,
        amount,
        description,
        sender_id
      });
    }

    return response.status(201).json(statement);
  }
}
