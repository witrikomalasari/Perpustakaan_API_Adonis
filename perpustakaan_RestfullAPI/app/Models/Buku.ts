import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

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
  public kategor_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
