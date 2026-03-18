import { Migration } from '@mikro-orm/migrations';

export class Migration20260318010946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "playlist" alter column "chat_id" type int using ("chat_id"::int);`);
    this.addSql(`alter table "playlist" alter column "chat_id" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" alter column "chat_id" type int using ("chat_id"::int);`);
    this.addSql(`alter table "playlist" alter column "chat_id" set not null;`);
  }

}
