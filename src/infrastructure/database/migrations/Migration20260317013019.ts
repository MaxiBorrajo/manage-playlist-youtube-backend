import { Migration } from '@mikro-orm/migrations';

export class Migration20260317013019 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "chat_current_selection" ("chat_id" int not null, "video_id" int not null, constraint "chat_current_selection_pkey" primary key ("chat_id", "video_id"));`);

    this.addSql(`alter table "chat_current_selection" add constraint "chat_current_selection_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "chat_current_selection" add constraint "chat_current_selection_video_id_foreign" foreign key ("video_id") references "video" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "video" drop constraint "video_chat_id_foreign";`);

    this.addSql(`alter table "video" drop column "chat_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "chat_current_selection" cascade;`);

    this.addSql(`alter table "video" add column "chat_id" int not null;`);
    this.addSql(`alter table "video" add constraint "video_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade on delete cascade;`);
  }

}
