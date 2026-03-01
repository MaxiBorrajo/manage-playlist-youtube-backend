import { Migration } from '@mikro-orm/migrations';

export class Migration20260301150922 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "user_saved_playlists" cascade;`);

    this.addSql(`alter table "playlist" drop column "is_public";`);

    this.addSql(`alter table "video" add column "thumbnail" varchar(255) not null, add column "duration" varchar(255) not null, add column "source" varchar(255) not null, add column "channel" varchar(255) not null, add column "date" varchar(255) not null;`);
    this.addSql(`alter table "video" rename column "name" to "title";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user_saved_playlists" ("user_id" int4 not null, "playlist_id" int4 not null, constraint "user_saved_playlists_pkey" primary key ("user_id", "playlist_id"));`);

    this.addSql(`alter table "user_saved_playlists" add constraint "user_saved_playlists_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_saved_playlists" add constraint "user_saved_playlists_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "playlist" add column "is_public" bool not null default true;`);

    this.addSql(`alter table "video" drop column "thumbnail", drop column "duration", drop column "source", drop column "channel", drop column "date";`);

    this.addSql(`alter table "video" rename column "title" to "name";`);
  }

}
