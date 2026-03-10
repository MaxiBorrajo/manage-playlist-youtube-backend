import { Migration } from '@mikro-orm/migrations';

export class Migration20260310015936 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "video" alter column "embedding" type vector(1024) using ("embedding"::vector(1024));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "video" alter column "embedding" type vector(1536) using ("embedding"::vector(1536));`);
  }

}
