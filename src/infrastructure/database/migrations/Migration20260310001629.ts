import { Migration } from '@mikro-orm/migrations';

export class Migration20260310001629 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "video" add column "video_id" varchar(255) null;`);
    this.addSql(`alter table "video" alter column "thumbnail" type varchar(255) using ("thumbnail"::varchar(255));`);
    this.addSql(`alter table "video" alter column "thumbnail" drop not null;`);
    this.addSql(`alter table "video" alter column "duration" type varchar(255) using ("duration"::varchar(255));`);
    this.addSql(`alter table "video" alter column "duration" drop not null;`);
    this.addSql(`alter table "video" alter column "source" type varchar(255) using ("source"::varchar(255));`);
    this.addSql(`alter table "video" alter column "source" drop not null;`);
    this.addSql(`alter table "video" alter column "channel" type varchar(255) using ("channel"::varchar(255));`);
    this.addSql(`alter table "video" alter column "channel" drop not null;`);
    this.addSql(`alter table "video" alter column "published_at" type varchar(255) using ("published_at"::varchar(255));`);
    this.addSql(`alter table "video" alter column "published_at" drop not null;`);
    this.addSql(`alter table "video" add constraint "video_video_id_unique" unique ("video_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "video" drop constraint "video_video_id_unique";`);
    this.addSql(`alter table "video" drop column "video_id";`);

    this.addSql(`alter table "video" alter column "thumbnail" type varchar(255) using ("thumbnail"::varchar(255));`);
    this.addSql(`alter table "video" alter column "thumbnail" set not null;`);
    this.addSql(`alter table "video" alter column "duration" type varchar(255) using ("duration"::varchar(255));`);
    this.addSql(`alter table "video" alter column "duration" set not null;`);
    this.addSql(`alter table "video" alter column "source" type varchar(255) using ("source"::varchar(255));`);
    this.addSql(`alter table "video" alter column "source" set not null;`);
    this.addSql(`alter table "video" alter column "channel" type varchar(255) using ("channel"::varchar(255));`);
    this.addSql(`alter table "video" alter column "channel" set not null;`);
    this.addSql(`alter table "video" alter column "published_at" type varchar(255) using ("published_at"::varchar(255));`);
    this.addSql(`alter table "video" alter column "published_at" set not null;`);
  }

}
