import { Migration } from '@mikro-orm/migrations';

export class Migration20260224023952 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "playlist" add column "thumbnail" varchar(255) null, add column "youtube_playlist_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" drop column "thumbnail", drop column "youtube_playlist_id";`);
  }

}
