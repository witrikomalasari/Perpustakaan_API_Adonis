import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Profile extends BaseModel {
  public static table = "profiles";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public bio: string;

  @column()
  public alamat: string;

  @column()
  public user_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
