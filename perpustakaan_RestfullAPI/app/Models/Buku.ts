import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Kategori from "./Kategori";
import User from "./User";
import Peminjaman from "./Peminjaman";

export default class Buku extends BaseModel {
  public static table = "bukus";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public judul: string;

  @column()
  public ringkasan: string;

  @column()
  public tahun_terbit: string;

  @column()
  public halaman: number;

  @column()
  public kategori_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Kategori, {
    foreignKey: "kategori_id",
  })
  public kategori: BelongsTo<typeof Kategori>;

  @manyToMany(() => User, {
    localKey: "id",
    pivotForeignKey: "buku_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "user_id",
    pivotTable: "peminjaman",
  })
  public peminjaman: ManyToMany<typeof User>;

  @hasMany(() => Peminjaman, {
    foreignKey: "buku_id",
  })
  public pinjam: HasMany<typeof Peminjaman>;
}
