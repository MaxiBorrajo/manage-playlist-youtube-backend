import { Migration } from '@mikro-orm/migrations';

export class Migration20260309211747 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`CREATE EXTENSION IF NOT EXISTS vector;`);
    this.addSql(
      `alter table "video" add column "language" varchar(255) not null, add column "country" varchar(255) not null, add column "embedding" vector(1536) not null;`,
    );
    this.addSql(`alter table "video" rename column "date" to "published_at";`);
    this.addSql(
      `create index "video_published_at_index" on "video" ("published_at");`,
    );
    this.addSql(`create index "video_language_index" on "video" ("language");`);
    this.addSql(`create index "video_country_index" on "video" ("country");`);
    this.addSql(
      `CREATE INDEX ON video USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "video_published_at_index";`);
    this.addSql(`drop index "video_language_index";`);
    this.addSql(`drop index "video_country_index";`);
    this.addSql(
      `alter table "video" drop column "language", drop column "country", drop column "embedding";`,
    );

    this.addSql(`alter table "video" rename column "published_at" to "date";`);
  }
}
