import { Migration } from '@mikro-orm/migrations';

export class Migration20260222160103 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "picture" varchar(255) null, add column "google_id" varchar(255) not null;`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`alter table "user" add constraint "user_google_id_unique" unique ("google_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);
    this.addSql(`alter table "user" drop constraint "user_google_id_unique";`);
    this.addSql(`alter table "user" drop column "picture", drop column "google_id";`);
  }

}
