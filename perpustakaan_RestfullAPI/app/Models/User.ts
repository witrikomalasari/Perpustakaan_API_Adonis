import { DateTime } from "luxon";
import {
  BaseModel,
  beforeSave,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";

import Profile from "./Profile";
import Buku from "./Buku";
import Peminjaman from "./Peminjaman";

export default class User extends BaseModel {
  public static table = "users";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public nama: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public role: string;

  @column({ columnName: "isVerified" })
  public isVerified: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @hasOne(() => Profile, {
    foreignKey: "user_id",
  })
  public profile: HasOne<typeof Profile>;

  @manyToMany(() => Buku, {
    localKey: "id",
    pivotForeignKey: "buku_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "buku_id",
    pivotTable: "peminjaman",
  })
  public peminjaman: ManyToMany<typeof Buku>;

  @hasMany(() => Peminjaman, {
    foreignKey: "user_id",
  })
  public users: HasMany<typeof Peminjaman>;
}
