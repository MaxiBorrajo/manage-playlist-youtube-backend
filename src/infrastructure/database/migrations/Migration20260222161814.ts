import { Migration } from '@mikro-orm/migrations';

export class Migration20260222161814 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "google_access_token" varchar(255) not null, add column "google_refresh_token" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "google_access_token", drop column "google_refresh_token";`);
  }

}
