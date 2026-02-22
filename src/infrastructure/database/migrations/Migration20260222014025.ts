import { Migration } from '@mikro-orm/migrations';

export class Migration20260222014025 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "playlist" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "playlist" alter column "description" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "playlist" alter column "description" set not null;`);
  }

}
