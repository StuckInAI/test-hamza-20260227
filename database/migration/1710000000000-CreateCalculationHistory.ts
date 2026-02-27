import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCalculationHistory1710000000000 implements MigrationInterface {
  name = 'CreateCalculationHistory1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \"calculation_history\" (\"id\" integer PRIMARY KEY AUTOINCREMENT NOT NULL, \"calculation\" varchar NOT NULL, \"result\" varchar NOT NULL, \"category\" varchar NOT NULL DEFAULT 'Food & Drink', \"createdAt\" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \"calculation_history\"`);
  }
}