import { Migration } from '@mikro-orm/migrations';

export class Migration20260311001758 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "message" add column "metadata" json null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "message" drop column "metadata";`);
  }

}
