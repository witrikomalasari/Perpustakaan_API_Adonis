import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Buku from "./Buku";

export default class Peminjaman extends BaseModel {
  public static table = "peminjaman";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @column()
  public buku_id: number;

  @column()
  public tanggal_pinjam: Date;

  @column()
  public tanggal_kembali: Date;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Buku, {
    foreignKey: "buku_id",
  })
  public buku: BelongsTo<typeof Buku>;

  @belongsTo(() => User, {
    foreignKey: "user_id",
  })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Buku, {
    foreignKey: "buku_id",
  })
  public pinjam: BelongsTo<typeof Buku>;

  @belongsTo(() => User, {
    foreignKey: "user_id",
  })
  public users: BelongsTo<typeof User>;
}
