import { Migration } from '@mikro-orm/migrations';

export class Migration20260221205937 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "username" varchar(255) not null, "email" varchar(255) not null);`);

    this.addSql(`create table "playlist" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "name" varchar(255) not null, "description" varchar(255) not null, "user_id" int not null);`);

    this.addSql(`create table "video" ("id" serial primary key, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) null, "name" varchar(255) not null, "description" varchar(255) not null, "url" varchar(255) not null, "playlist_id" int not null);`);

    this.addSql(`alter table "playlist" add constraint "playlist_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "video" add constraint "video_playlist_id_foreign" foreign key ("playlist_id") references "playlist" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" drop constraint "playlist_user_id_foreign";`);

    this.addSql(`alter table "video" drop constraint "video_playlist_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "playlist" cascade;`);

    this.addSql(`drop table if exists "video" cascade;`);
  }

}
