import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Buku from "App/Models/Buku";
import BukuValidator from "App/Validators/BukuValidator";

export default class BukusController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayloadPost = await request.validate(BukuValidator);

      const newBuku = await Buku.create(validationPayloadPost);
      // console.log(validationPayloadPost);

      return response.ok({
        message: "Data Buku berhasil tersimpan",
        data: newBuku,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak dapat tersimpan",
        error: error.message,
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const allDataBuku = await Buku.all();

      return response.ok({
        message: `Data berhasil ditampilkan`,
        data: allDataBuku,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak berhasil ditampilkan",
        error: error.message,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    try {
      const detailBuku = await Buku.findByOrFail("id", idParam);

      return response.ok({
        message: `Detail buku id  ${idParam} berhasil ditampilkan`,
        data: detailBuku,
      });
    } catch (error) {
      return response.badRequest({
        message: `Detail buku id ${idParam} tidak berhasil ditampilkan`,
        error: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      let idParam = params.id;

      const validationPayloadUpdate = await request.validate(BukuValidator);

      const updateBuku = await Buku.findByOrFail("id", idParam);
      updateBuku.judul = validationPayloadUpdate.judul;
      updateBuku.ringkasan = validationPayloadUpdate.ringkasan;
      updateBuku.tahun_terbit = validationPayloadUpdate.tahun_terbit;
      updateBuku.halaman = validationPayloadUpdate.halaman;
      updateBuku.kategori_id = validationPayloadUpdate.kategori_id;

      // await updateBuku?.save();

      return response.ok({
        message: `update buku id ${idParam} berhasil`,
        data: updateBuku,
      });
    } catch (error) {
      return response.badRequest({
        message: `buku tidak berhasil update`,
        error: error.message,
      });
    }
  }
  public async destroy({ response, params }: HttpContextContract) {
    try {
      let idParam = params.id;
      const dataBuku = await Buku.findByOrFail("id", idParam);

      await dataBuku.delete();

      return response.ok({
        message: `Detail buku id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      return response.badRequest({
        message: `buku id ${params.id} gagal dihapus`,
        error: error.message,
      });
    }
  }
}
