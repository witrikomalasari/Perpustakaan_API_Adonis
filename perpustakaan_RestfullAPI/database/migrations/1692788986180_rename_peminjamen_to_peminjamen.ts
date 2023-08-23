import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "rename_peminjamen_to_peminjamen";

  public async up() {
    this.schema.renameTable("peminjamen", "peminjaman");
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
