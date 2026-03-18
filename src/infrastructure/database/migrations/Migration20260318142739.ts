import { Migration } from '@mikro-orm/migrations';

export class Migration20260318142739 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "message" add constraint "message_content_role_unique" unique ("content", "role");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "message" drop constraint "message_content_role_unique";`);
  }

}
