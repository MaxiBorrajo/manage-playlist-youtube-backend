import { Migration } from '@mikro-orm/migrations';

export class Migration20260310215033 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "video" drop constraint "video_video_id_unique";`);
    this.addSql(`alter table "video" drop column "video_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "video" add column "video_id" varchar(255) null;`);
    this.addSql(`alter table "video" add constraint "video_video_id_unique" unique ("video_id");`);
  }

}
