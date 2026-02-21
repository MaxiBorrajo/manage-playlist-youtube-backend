import { Migration } from '@mikro-orm/migrations';

export class Migration20260221213843 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_saved_playlists" ("user_id" int not null, "playlist_id" int not null, constraint "user_saved_playlists_pkey" primary key ("user_id", "playlist_id"));`);

    this.addSql(`create table "playlist_videos" ("playlist_id" int not null, "video_id" int not null, constraint "playlist_videos_pkey" primary key ("playlist_id", "video_id"));`);

    this.addSql(`alter table "user_saved_playlists" add constraint "user_saved_playlists_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_saved_playlists" add constraint "user_saved_playlists_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "playlist_videos" add constraint "playlist_videos_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "playlist_videos" add constraint "playlist_videos_video_id_foreign" foreign key ("video_id") references "video" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "playlist" drop constraint "playlist_user_id_foreign";`);

    this.addSql(`alter table "video" drop constraint "video_playlist_id_foreign";`);

    this.addSql(`alter table "playlist" rename column "user_id" to "author_id";`);
    this.addSql(`alter table "playlist" add constraint "playlist_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "video" drop column "playlist_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_saved_playlists" cascade;`);

    this.addSql(`drop table if exists "playlist_videos" cascade;`);

    this.addSql(`alter table "playlist" drop constraint "playlist_author_id_foreign";`);

    this.addSql(`alter table "playlist" rename column "author_id" to "user_id";`);
    this.addSql(`alter table "playlist" add constraint "playlist_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "video" add column "playlist_id" int not null;`);
    this.addSql(`alter table "video" add constraint "video_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade;`);
  }

}
