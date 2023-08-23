import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BukuValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    judul: schema.string.nullableAndOptional([
      rules.minLength(4),
      rules.trim(),
      rules.unique({ table: "bukus", column: "judul" }),
    ]),
    ringkasan: schema.string([rules.trim(), rules.minLength(4)]),
    tahun_terbit: schema.string([rules.trim(), rules.maxLength(4)]),
    halaman: schema.number([rules.trim()]),
    kategori_id: schema.number([
      rules.trim,
      rules.unique({
        table: "kategoris",
        column: "id",
      }),
    ]),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    required: "inputan {{field}} harus diisi tidak boleh kosong",
  };
}
