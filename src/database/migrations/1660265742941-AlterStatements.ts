import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatements1660265742941 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('statements', new TableColumn({
        name: 'sender_id',
        type: 'uuid',
        isNullable: true,
      }));

      await queryRunner.createForeignKey('statements', new TableForeignKey({
        name: 'FKStatementSenderUser',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['sender_id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('statements', 'FKStatementSenderUser');
      await queryRunner.dropColumn('statements', 'sender_id');
    }

}
