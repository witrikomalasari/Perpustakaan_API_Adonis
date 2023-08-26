import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Peminjaman from "App/Models/Peminjaman";
import PeminjamanValidator from "App/Validators/PeminjamanValidator";

export default class PeminjamenController {
  public async store({ auth, params, request, response }: HttpContextContract) {
    let idParam = params.id;
    const userDetail = auth.user?.id;

    // const tanggalPeminjaman = new Date().toISOString();

    const batasWaktu = 30;

    try {
      const validationPayloadPost = await request.validate(PeminjamanValidator);

      let newTanggalPinjamISO =
        validationPayloadPost.tanggal_pinjam?.toISODate();

      let newTanggalPinjam = newTanggalPinjamISO?.replace(/T.*$/, "");

      let newTanggalKembaliISO =
        validationPayloadPost.tanggal_kembali?.toISODate();

      let newTanggalKembali = newTanggalKembaliISO?.replace(/T.*$/, "");

      // if()

      await Peminjaman.create({
        user_id: userDetail,
        buku_id: idParam,
        tanggal_pinjam: request.input("tanggal_pinjam", newTanggalPinjam),
        tanggal_kembali: request.input("tanggal_kembali", newTanggalKembali),
      });

      // console.log(validationPayloadPost);

      return response.ok({
        message: "berhasil melakukan peminjaman",
      });
    } catch (error) {
      return response.badRequest({
        message: "gagal melakukan peminjaman",
        error: error.messages,
      });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const allDataPeminjaman = await Peminjaman.query()
        .preload("user")
        .preload("buku");

      return response.ok({
        message: `Data Peminjaman berhasil ditampilkan`,
        data: allDataPeminjaman,
      });
    } catch (error) {
      return response.badRequest({
        message: "Data Peminjaman tidak berhasil ditampilkan",
        error: error.messages.errors,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    let idParam = params.id;

    try {
      const detailPeminjaman = await Peminjaman.query()
        .where("id", idParam)
        .select("id", "buku_id", "tanggal_pinjam", "tanggal_kembali", "user_id")
        .preload("users", (query) => {
          query.select("id", "nama", "email");
        })
        .firstOrFail();

      return response.ok({
        message: `berhasil get data peminjaman by id`,
        data: detailPeminjaman,
      });
    } catch (error) {
      return response.badRequest({
        message: `gagal get dataDetail Peminjaman by id ${idParam}`,
        error: error.message,
      });
    }
  }
}
