import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "peminjamen";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE")
        .notNullable();

      table
        .integer("buku_id")
        .unsigned()
        .references("bukus.id")
        .onDelete("CASCADE")
        .notNullable();

      table.date("tanggal_pinjam").notNullable();
      table.date("tanggal_kembali").notNullable();
      table.timestamps(true, true);

      table.unique(["user_id", "buku_id"]);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
