import { Migration } from '@mikro-orm/migrations';

export class Migration20260222014948 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "playlist" alter column "description" type text using ("description"::text);`);

    this.addSql(`alter table "video" alter column "description" type text using ("description"::text);`);
    this.addSql(`alter table "video" alter column "description" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" alter column "description" type varchar(255) using ("description"::varchar(255));`);

    this.addSql(`alter table "video" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "video" alter column "description" set not null;`);
  }

}
