import { Response } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayload = await request.validate(UserValidator);

      const newUser = await User.create(validationPayload);

      // const newUser = new User();
      // newUser.nama = request.input("nama");
      // newUser.email = request.input("email");
      // newUser.password = request.input("password");
      // newUser.role = request.input("user");

      console.log("coba", newUser.id);

      response.created({
        message: "created",
      });

      // const validationPayloadPost = await request.validate(CategoryValidator);

      // const newCategory = await Database.insertQuery() // 👈 gives an instance of insert query builder
      //   .table("kategoris")
      //   .insert(validationPayloadPost);

      // if (!newCategory) {
      //   return response.badRequest({
      //     message: "Data tidak dapat tersimpan",
      //   });
      // }

      // response.ok({
      //   message: "Data berhasil tersimpan",
      // });
    } catch (error) {
      response.badRequest({ error: error.message });
    }
  }

  public async index({ response }: HttpContextContract) {
    const allDataCategories = await Database.query() // 👈 gives an instance of select query builder
      .from("kategoris")
      .select("*");

    if (!allDataCategories) {
      return response.badRequest({
        message: "Data tidak berhasil ditampilkan",
      });
    }
    return response.ok({
      message: `Data berhasil ditampilkan`,
      data: allDataCategories,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    const detailCategory = await Database.from("kategoris")
      .where("id", idParam)
      .first();

    if (!detailCategory) {
      return response.badRequest({
        message: `Detail category id ${idParam} tidak berhasil ditampilkan`,
      });
    }
    return response.ok({
      message: `Detail Category id  ${idParam} berhasil ditampilkan`,
      data: detailCategory,
    });
  }

  public async update({ request, response, params }: HttpContextContract) {
    let idParam = params.id;

    const validationPayloadUpdate = await request.validate(CategoryValidator);

    const detailCategory = await Database.from("kategoris")
      .where("id", idParam)
      .first();

    const updateCategory = await Database.from("kategoris")
      .where("id", idParam)
      .update(validationPayloadUpdate); // 👈

    if (!detailCategory) {
      return response.notFound({
        message: `id ${idParam} category tidak ditemukan`,
      });
    }

    if (!updateCategory) {
      return response.badRequest({
        message: `category tidak berhasil update`,
      });
    }

    return response.ok({
      message: `update category id ${idParam} berhasil`,
      data: detailCategory,
    });
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const data = await Database.from("kategoris")
        .where("id", params.id)
        .delete();

      // if (!data) {
      //   return response.badRequest({
      //     message: `category id ${params.id} gagal dihapus`,
      //   });
      // }

      return response.ok({
        message: `Detail Category id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      response.badRequest({
        error: error.message,
      });
    }
  }
}
