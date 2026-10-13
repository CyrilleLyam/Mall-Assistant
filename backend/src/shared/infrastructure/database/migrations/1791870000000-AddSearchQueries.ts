import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchQueries1791870000000 implements MigrationInterface {
    name = 'AddSearchQueries1791870000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "search_queries" ("id" uuid NOT NULL, "term" character varying(100) NOT NULL, "result_count" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2945172d2d9a9f6b2339dd036e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c786151d2b03672db84174f066" ON "search_queries"  ("term") `);
        await queryRunner.query(`CREATE INDEX "IDX_4981129d48833f45cc3e70f06b" ON "search_queries"  ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4981129d48833f45cc3e70f06b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c786151d2b03672db84174f066"`);
        await queryRunner.query(`DROP TABLE "search_queries"`);
    }

}
