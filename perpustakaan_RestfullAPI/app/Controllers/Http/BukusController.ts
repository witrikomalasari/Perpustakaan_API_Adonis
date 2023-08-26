import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Buku from "App/Models/Buku";
import Kategori from "App/Models/Kategori";
import BukuValidator from "App/Validators/BukuValidator";

export default class BukusController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const validationPayloadPost = await request.validate(BukuValidator);

      // console.log("aear", validationPayloadPost);
      const newBuku = await Buku.create(validationPayloadPost);
      // console.log(newBuku.judul);
      // console.log("aear", validationPayloadPost.judul);

      return response.ok({
        message: "Data Buku berhasil tersimpan",
        data: newBuku,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak dapat tersimpan",
        error: error.sqlMessage || error.messages.errors,
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const allDataBuku = await Buku.query()
        .preload("kategori")
        .preload("peminjaman");

      // .all();

      return response.ok({
        message: `Data berhasil ditampilkan`,
        data: allDataBuku,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data tidak berhasil ditampilkan",
        error,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    try {
      const detailBuku = await Buku.query()
        .where("id", idParam)
        .select(
          "id",
          "judul",
          "ringkasan",
          "tahun_terbit",
          "halaman",
          "kategori_id"
        )
        .preload("kategori", (query) => {
          query.select("nama");
        })

        .preload("pinjam", (query) => {
          query.select(
            "id",
            "buku_id",
            "tanggal_pinjam",
            "tanggal_kembali",
            " user_id"
          );
        })
        .firstOrFail();
      // .findByOrFail("id", idParam);

      return response.ok({
        message: `berhasil get data peminjaman`,
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
    let idParam = params.id;

    type IvalidationPayload = {
      save: () => {};

      judul?: string;
      ringkasan?: string;
      tahun_terbit?: string;
      halaman?: number;
      kategori_id?: number;
    };

    try {
      const validationPayloadUpdate = await request.validate(BukuValidator);

      const updateBuku: IvalidationPayload = await Buku.findByOrFail(
        "id",
        idParam
      );

      updateBuku.judul = validationPayloadUpdate.judul;
      updateBuku.ringkasan = validationPayloadUpdate.ringkasan;
      updateBuku.tahun_terbit = validationPayloadUpdate.tahun_terbit;
      updateBuku.halaman = validationPayloadUpdate.halaman;
      updateBuku.kategori_id = validationPayloadUpdate.kategori_id;

      // const updateBuku = await Buku.query()
      //   .where("id", idParam)
      //   .update(validationPayloadUpdate);

      await updateBuku?.save();

      return response.ok({
        message: `update buku id ${idParam} berhasil`,
      });
    } catch (error) {
      return response.badRequest({
        message: `buku tidak berhasil di update`,
        error: error.message.includes("Row not found")
          ? error.message
          : error.messages.errors,
      });
    }
  }
  public async destroy({ response, params }: HttpContextContract) {
    let idParam = params.id;
    try {
      const dataBuku = await Buku.findByOrFail("id", idParam);

      await dataBuku.delete();

      return response.ok({
        message: `Detail buku id  ${params.id} berhasil dihapus`,
      });
    } catch (error) {
      return response.badRequest({
        message: `buku id ${params.id} gagal dihapus / id ${idParam} buku tidak terdaftar`,
        error: error.message,
      });
    }
  }
}
