import { Migration } from '@mikro-orm/migrations';

export class Migration20260306005434 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tag" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "name" varchar(255) not null, "author_id" int not null);`);

    this.addSql(`create table "chat" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "name" varchar(255) not null, "user_id" int not null);`);

    this.addSql(`create table "message" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "content" varchar(255) not null, "role" text check ("role" in ('user', 'assistant', 'system')) not null, "chat_id" int not null);`);

    this.addSql(`create table "playlist_item" ("playlist_id" int not null, "video_id" int not null, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "position" int not null, "notes" text null, constraint "playlist_item_pkey" primary key ("playlist_id", "video_id"));`);

    this.addSql(`alter table "tag" add constraint "tag_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "chat" add constraint "chat_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "message" add constraint "message_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "playlist_item" add constraint "playlist_item_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "playlist_item" add constraint "playlist_item_video_id_foreign" foreign key ("video_id") references "video" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "playlist_videos" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "message" drop constraint "message_chat_id_foreign";`);

    this.addSql(`create table "playlist_videos" ("playlist_id" int not null, "video_id" int not null, constraint "playlist_videos_pkey" primary key ("playlist_id", "video_id"));`);

    this.addSql(`alter table "playlist_videos" add constraint "playlist_videos_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "playlist_videos" add constraint "playlist_videos_video_id_foreign" foreign key ("video_id") references "video" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "tag" cascade;`);

    this.addSql(`drop table if exists "chat" cascade;`);

    this.addSql(`drop table if exists "message" cascade;`);

    this.addSql(`drop table if exists "playlist_item" cascade;`);
  }

}
