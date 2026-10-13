import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1791865528129 implements MigrationInterface {
    name = 'Init1791865528129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL, "name_en" character varying(100) NOT NULL, "name_km" character varying(100) NOT NULL, CONSTRAINT "UQ_c861ed65e9f01d9d535f6bba14d" UNIQUE ("name_en"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL, "name_en" character varying(255) NOT NULL, "name_km" character varying(255) NOT NULL, "description_en" text NOT NULL DEFAULT '', "description_km" text NOT NULL DEFAULT '', "floor" integer NOT NULL, "open_time" character varying(5) NOT NULL, "close_time" character varying(5) NOT NULL, "category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d67887865dbf5cb91cca633aa" ON "tenants"  ("floor") `);
        await queryRunner.query(`CREATE INDEX "IDX_1112b7c3862b17e07359fd606a" ON "tenants"  ("category_id") `);
        await queryRunner.query(`CREATE TABLE "search_logs" ("id" uuid NOT NULL, "tenant_id" uuid NOT NULL, "query" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a7de6b052b1a608961dc46e843d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_085779bcc950bf939e1a31b5d4" ON "search_logs"  ("tenant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b77f81d2f9c7e3268e96c7a828" ON "search_logs"  ("created_at") `);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL, "title_en" character varying(255) NOT NULL, "title_km" character varying(255) NOT NULL, "description_en" text NOT NULL DEFAULT '', "description_km" text NOT NULL DEFAULT '', "start_date" date NOT NULL, "end_date" date NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ce5225c17497c5adddc1819c69" ON "events"  ("start_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_e13c67b079be558c1484ed3d48" ON "events"  ("end_date") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(32) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "FK_1112b7c3862b17e07359fd606a4" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "search_logs" ADD CONSTRAINT "FK_085779bcc950bf939e1a31b5d47" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "search_logs" DROP CONSTRAINT "FK_085779bcc950bf939e1a31b5d47"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "FK_1112b7c3862b17e07359fd606a4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e13c67b079be558c1484ed3d48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce5225c17497c5adddc1819c69"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b77f81d2f9c7e3268e96c7a828"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_085779bcc950bf939e1a31b5d4"`);
        await queryRunner.query(`DROP TABLE "search_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1112b7c3862b17e07359fd606a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d67887865dbf5cb91cca633aa"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
