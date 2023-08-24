import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Kategori from "App/Models/Kategori";
import KategoriValidator from "App/Validators/KategoriValidator";

export default class KategorisController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayloadPost = await request.validate(KategoriValidator);

      const newCategory = await Kategori.create(validationPayloadPost);
      // console.log(validationPayloadPost);
      if (!newCategory) {
        return response.badRequest({
          message: "Data tidak dapat tersimpan",
        });
      }

      return response.ok({
        message: "Data kategori berhasil tersimpan",
      });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const allDataCategories = await Kategori.all();

      return response.ok({
        message: `Data berhasil ditampilkan`,
        data: allDataCategories,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak berhasil ditampilkan",
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    try {
      const detailCategory = await Kategori.findByOrFail("id", idParam);

      return response.ok({
        message: `Detail Category id  ${idParam} berhasil ditampilkan`,
        data: detailCategory,
      });
    } catch (error) {
      return response.badRequest({
        message: `Detail category id ${idParam} tidak berhasil ditampilkan`,
        error: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      let idParam = params.id;

      const validationPayloadUpdate = await request.validate(KategoriValidator);

      const updateCategory = await Kategori.findByOrFail("id", idParam);
      updateCategory.nama = validationPayloadUpdate.nama;

      await updateCategory?.save();

      return response.ok({
        message: `update category id ${idParam} berhasil`,
        data: updateCategory,
      });
    } catch (error) {
      return response.badRequest({
        message: `category tidak berhasil update`,
        error: error.message,
      });
    }
  }
  public async destroy({ response, params }: HttpContextContract) {
    try {
      let idParam = params.id;
      const dataKategori = await Kategori.findByOrFail("id", idParam);

      await dataKategori.delete();

      return response.ok({
        message: `Detail Category id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      response.badRequest({
        message: `category id ${params.id} gagal dihapus`,
        error: error.message,
      });
    }
  }
}
