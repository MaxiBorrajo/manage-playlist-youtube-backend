import { Migration } from '@mikro-orm/migrations';

export class Migration20260317012144 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "chat" add column "searchable_name" tsvector not null;`);
    this.addSql(`create index "chat_name_index" on "chat" ("name");`);
    this.addSql(`create index "chat_searchable_name_index" on "public"."chat" using gin("searchable_name");`);

    this.addSql(`alter table "playlist" add column "chat_id" int not null;`);
    this.addSql(`alter table "playlist" add constraint "playlist_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "message" add column "searchable_content" tsvector not null;`);
    this.addSql(`alter table "message" alter column "content" type varchar(255) using ("content"::varchar(255));`);
    this.addSql(`create index "message_content_index" on "message" ("content");`);
    this.addSql(`create index "message_searchable_content_index" on "public"."message" using gin("searchable_content");`);

    this.addSql(`alter table "video" add column "chat_id" int not null;`);
    this.addSql(`alter table "video" add constraint "video_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "playlist" drop constraint "playlist_chat_id_foreign";`);

    this.addSql(`alter table "video" drop constraint "video_chat_id_foreign";`);

    this.addSql(`alter table "playlist" drop column "chat_id";`);

    this.addSql(`drop index "chat_name_index";`);
    this.addSql(`drop index "chat_searchable_name_index";`);
    this.addSql(`alter table "chat" drop column "searchable_name";`);

    this.addSql(`drop index "message_content_index";`);
    this.addSql(`drop index "message_searchable_content_index";`);
    this.addSql(`alter table "message" drop column "searchable_content";`);

    this.addSql(`alter table "message" alter column "content" type text using ("content"::text);`);

    this.addSql(`alter table "video" drop column "chat_id";`);
  }

}
