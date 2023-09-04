import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // alter table menambahkan kolom baru / menghapus kolom /modifikasi kolom
      table.boolean("isVerified").defaultTo(false);
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      //dropColumn tuk menghapus column
      table.dropColumn("isVerified");
    });
  }
}
