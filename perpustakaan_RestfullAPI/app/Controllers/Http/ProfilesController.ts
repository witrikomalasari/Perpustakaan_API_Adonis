import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Profile from "App/Models/Profile";
import ProfileValidator from "App/Validators/ProfileValidator";

export default class ProfilesController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayloadPost = await request.validate(ProfileValidator);

      const newProfile = await Profile.create(validationPayloadPost);
      // console.log(validationPayloadPost);

      return response.ok({
        message: "Data profile berhasil tersimpan",
        data: newProfile,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data profile tidak dapat tersimpan",
        error: error.message,
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const DataProfile = await Profile.all();

      return response.ok({
        message: `Data profile berhasil ditampilkan`,
        data: DataProfile,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data profile tidak berhasil ditampilkan",
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    try {
      const detailProfile = await Profile.findByOrFail("id", idParam);

      return response.ok({
        message: `Detail Profile id  ${idParam} berhasil ditampilkan`,
        data: detailProfile,
      });
    } catch (error) {
      return response.badRequest({
        message: `Detail Profile id ${idParam} tidak berhasil ditampilkan`,
        error: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      let idParam = params.id;

      const validationPayloadUpdate = await request.validate(ProfileValidator);

      const updateProfile = await Profile.findByOrFail("id", idParam);
      updateProfile.bio = validationPayloadUpdate.bio;
      updateProfile.alamat = validationPayloadUpdate.alamat;
      updateProfile.user_id = validationPayloadUpdate.user_id;

      console.log(updateProfile);

      // await updateProfile?.save();

      return response.ok({
        message: `update Profile id ${idParam} berhasil`,
        data: updateProfile,
      });
    } catch (error) {
      return response.badRequest({
        message: `Profile tidak berhasil update`,
        error: error.message,
      });
    }
  }
  public async destroy({ response, params }: HttpContextContract) {
    try {
      let idParam = params.id;
      const dataProfile = await Profile.findByOrFail("id", idParam);

      await dataProfile.delete();

      return response.ok({
        message: `Detail Profile id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      response.badRequest({
        message: `Profile id ${params.id} gagal dihapus`,
        error: error.message,
      });
    }
  }
}
