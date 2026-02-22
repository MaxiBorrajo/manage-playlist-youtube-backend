import { Migration } from '@mikro-orm/migrations';

export class Migration20260222182855 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "playlist" add column "is_public" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" drop column "is_public";`);
  }

}
