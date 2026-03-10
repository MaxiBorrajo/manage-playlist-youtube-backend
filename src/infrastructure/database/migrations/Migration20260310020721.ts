import { Migration } from '@mikro-orm/migrations';

export class Migration20260310020721 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "video" alter column "embedding" type vector(768) using ("embedding"::vector(768));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "video" alter column "embedding" type vector(1024) using ("embedding"::vector(1024));`);
  }

}
