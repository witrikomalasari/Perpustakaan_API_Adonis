import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "bukus";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("judul", 255).unique().notNullable();
      table.string("ringkasan", 255).notNullable();
      table.string("tahun_terbit", 45).notNullable();
      table.integer("halaman").notNullable();
      table
        .integer("kategori_id")
        .unsigned()
        .references("kategoris.id")
        .notNullable()
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
