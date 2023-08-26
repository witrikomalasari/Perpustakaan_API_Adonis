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
    judul: schema.string.optional([
      rules.minLength(2),
      rules.trim(),
      rules.unique({ table: "bukus", column: "judul" }),
    ]),
    ringkasan: schema.string.optional([rules.minLength(2), rules.trim()]),
    tahun_terbit: schema.string.optional([rules.maxLength(4), rules.trim()]),
    halaman: schema.number.optional([rules.trim()]),
    kategori_id: schema.number.optional([
      rules.trim(),
      rules.exists({
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
    "judul.unique": "{{field}} unik, tidak boleh sama",
    kategori_id:
      "kategori id harus disesuaikan dan sudah ada di list tabel kategori",
  };
}
