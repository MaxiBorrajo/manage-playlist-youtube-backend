import { Migration } from '@mikro-orm/migrations';

export class Migration20260317012447 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "chat" alter column "searchable_name" type tsvector using ("searchable_name"::tsvector);`);
    this.addSql(`alter table "chat" alter column "searchable_name" drop not null;`);

    this.addSql(`alter table "message" alter column "searchable_content" type tsvector using ("searchable_content"::tsvector);`);
    this.addSql(`alter table "message" alter column "searchable_content" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "chat" alter column "searchable_name" type tsvector using ("searchable_name"::tsvector);`);
    this.addSql(`alter table "chat" alter column "searchable_name" set not null;`);

    this.addSql(`alter table "message" alter column "searchable_content" type tsvector using ("searchable_content"::tsvector);`);
    this.addSql(`alter table "message" alter column "searchable_content" set not null;`);
  }

}
