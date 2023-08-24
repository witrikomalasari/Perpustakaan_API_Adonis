import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayload = await request.validate(UserValidator);

      await User.create(validationPayload);

      const newUser = new User();
      newUser.nama = request.input("nama");
      newUser.email = request.input("email");
      newUser.password = request.input("password");
      newUser.role = request.input("role");

      // console.log("coba", newUser.id);

      return response.created({
        message: "created",
        data: newUser,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data User tidak dapat tersimpan",
        error: error.message,
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const allDataUser = await User.all();

      return response.ok({
        message: `Data User berhasil ditampilkan`,
        data: allDataUser,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data User tidak berhasil ditampilkan",
        error: error.message,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;
    try {
      const detailUser = await User.findByOrFail("id", idParam);

      return response.ok({
        message: `Detail User id  ${idParam} berhasil ditampilkan`,
        data: detailUser,
      });
    } catch (error) {
      return response.badRequest({
        message: `Detail User id ${idParam} tidak berhasil ditampilkan`,
        error: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let idParam = params.id;
    try {
      const validationPayloadUpdate = await request.validate(UserValidator);

      const detailUser = await User.find(idParam);

      const updateUser = await User.findByOrFail("id", idParam);
      updateUser.nama = validationPayloadUpdate.nama;
      updateUser.email = validationPayloadUpdate.email;
      updateUser.password = validationPayloadUpdate.password;

      if (!detailUser) {
        return response.notFound({
          message: `id ${idParam} User tidak ditemukan`,
        });
      }

      return response.ok({
        message: `update User id ${idParam} berhasil`,
        data: detailUser,
      });
    } catch (error) {
      return response.badRequest({
        message: `User tidak berhasil update`,
        error: error.message,
      });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      let idParam = params.id;
      const dataUser = await User.findByOrFail("id", idParam);

      await dataUser.delete();

      return response.ok({
        message: `Detail User id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      return response.badRequest({
        message: `User id ${params.id} gagal dihapus`,
        error: error.message,
      });
    }
  }
}
