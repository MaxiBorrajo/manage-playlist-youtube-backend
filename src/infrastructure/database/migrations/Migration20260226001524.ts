import { Migration } from '@mikro-orm/migrations';

export class Migration20260226001524 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_google_id_unique";`);
    this.addSql(`alter table "user" drop column "google_id", drop column "google_access_token", drop column "google_refresh_token";`);

    this.addSql(`alter table "playlist" drop column "youtube_playlist_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" add column "google_id" varchar(255) not null, add column "google_access_token" varchar(255) not null, add column "google_refresh_token" varchar(255) not null;`);
    this.addSql(`alter table "user" add constraint "user_google_id_unique" unique ("google_id");`);

    this.addSql(`alter table "playlist" add column "youtube_playlist_id" varchar(255) null;`);
  }

}
