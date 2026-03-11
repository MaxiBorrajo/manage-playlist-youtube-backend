import { Migration } from '@mikro-orm/migrations';

export class Migration20260311012927 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "video" add constraint "video_url_unique" unique ("url");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "video" drop constraint "video_url_unique";`);
  }

}
