import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Kategori from "App/Models/Kategori";
import KategoriValidator from "App/Validators/KategoriValidator";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

export default class KategorisController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayloadPost = await request.validate(KategoriValidator);

      const newCategory = await Kategori.create(validationPayloadPost);
      // console.log("adf", newCategory.nama);
      return response.ok({
        message: "Data kategori berhasil tersimpan",
        data: newCategory,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak dapat tersimpan",
        error: error.messages,
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const allDataCategories = await Kategori.query().preload("buku");
      // .all();

      return response.ok({
        message: `Data berhasil ditampilkan`,
        data: allDataCategories,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak berhasil ditampilkan",
        error: error.messages,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    try {
      const detailCategory = await Kategori.query()
        .where("id", idParam)
        .select("id", "nama")
        .preload("buku", (query) =>
          query.select("id", "judul", "ringkasan", "tahun_terbit", "halaman")
        )
        .firstOrFail();
      // .findByOrFail("id", idParam);

      return response.ok({
        message: `berhasil get data kategori by id, data dengan kategori id ${idParam}`,
        data: detailCategory,
      });
    } catch (error) {
      return response.notFound({
        message: `Detail category dengan id ${idParam} tidak ditemukan`,
        error: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let idParam = params.id;
    try {
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
        message: `category tidak berhasil di update`,
        error: error.message.includes("Row not found")
          ? error.message
          : error.messages.errors,
      });
    }
  }
  public async destroy({ response, params }: HttpContextContract) {
    let idParam = params.id;
    try {
      const dataKategori = await Kategori.findByOrFail("id", idParam);

      await dataKategori.delete();

      return response.ok({
        message: `Detail Category id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      return response.notFound({
        message: `buku id ${params.id} gagal dihapus / id ${idParam} buku tidak terdaftar`,
        error: error.message,
      });
    }
  }
}
