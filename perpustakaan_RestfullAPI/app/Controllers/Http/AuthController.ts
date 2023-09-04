import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const newRegisterUser = schema.create({
      nama: schema.string([rules.unique({ table: "users", column: "nama" })]),
      email: schema.string([
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string(),

      role: schema.enum(["user", "admin"] as const),
    });

    const messageValidator: CustomMessages = {
      required: "inputan {{field}} harus diisi tidak boleh kosong",
      "nama.unique": "{{field}} unik, tidak boleh sama",
      "email.unique": "{{field}} unik, tidak boleh sama",
      "email.email": "format email contoh: johnDoe@gmail.com",
    };

    try {
      const validationPayload = await request.validate({
        schema: newRegisterUser,
        messages: messageValidator,
      });

      const newUser = await User.create(validationPayload);

      const otpCode = Math.floor(100000 + Math.random() * 900000);

      await Database.table("otp_codes").insert({
        otp_code: otpCode,
        user_id: newUser.id,
      });

      await Mail.send((message) => {
        message
          .from("dede.witri@gmail.com")
          .to(validationPayload.email)
          .subject("Welcome Onboard!")
          .htmlView("emails/otp", { otpCode, newUser });
      });

      return response.ok({
        message: `register berhasil, please verify your OTP CODE`,
      });
    } catch (error) {
      return response.unauthorized({
        message: `register tidak berhasil`,
        error: error.messages.errors,
      });
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const newLoginUser = schema.create({
      email: schema.string([rules.email()]),
      password: schema.string(),
    });

    const messageValidator: CustomMessages = {
      required: "inputan {{field}} harus diisi tidak boleh kosong",
      "email.email": "format email contoh: johnDoe@gmail.com",
    };

    try {
      await request.validate({
        schema: newLoginUser,
        messages: messageValidator,
      });

      const email = request.input("email");
      const password = request.input("password");

      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "7 days",
      });

      // console.log("tok", token.token);
      let user = await User.findBy("email", email);

      // console.log("coba", user?.tokens);
      // tuk menyimpan token di tabel users agar mudah dilihat kembali di database jika ingin login lg
      if (token.token) {
        user!.tokens = token.token;
        await user?.save();
      }

      return response.ok({
        message: "login berhasil",
        token,
      });
    } catch (error) {
      if (error.guard) {
        return response.badRequest({
          message: "login error",
          error: error.message,
        });
      }

      return response.unauthorized({
        message: `invalid login`,
        error: error.message.includes("User not found")
          ? error.responseText
          : error.messages.errors,
      });
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    const user = auth.user;
    console.log("user", auth.user);
    return response.ok({ message: user });
  }

  public async updateProfile({ auth, request, response }: HttpContextContract) {
    const userData = auth.user;

    try {
      const profileValidation = schema.create({
        bio: schema.string(),
        alamat: schema.string(),
      });

      await request.validate({ schema: profileValidation });

      const alamatUser = request.input("alamat");
      const bioUser = request.input("bio");

      const dataProfile = {
        alamat: alamatUser,
        bio: bioUser,
      };

      await userData?.related("profile").updateOrCreate({}, dataProfile);

      return response.created({
        message: "profile berhasil diupdate",
      });
    } catch (error) {
      return response.unauthorized({
        message: "profile gagal diupdate",
        error: error.messages.errors,
      });
    }
  }

  // pengecekan otp ke database
  public async otpConfirmation({ request, response }: HttpContextContract) {
    let otp_code = request.input("otp_code");
    let email = request.input("email");

    // pengecekan ke Database
    let user = await User.findBy("email", email);

    let otpCheckToDB = await Database.query()
      .from("otp_codes")
      .where("otp_code", otp_code)
      .first();

    // console.log("otp", otpCheckToDB);

    if (user?.id === otpCheckToDB?.user_id) {
      user!.isVerified = true;
      await user?.save();

      return response.ok({
        message: "berhasil konfirmasi OTP",
      });
    } else {
      return response.badRequest({
        message: "gagal verifikasi OTP",
      });
    }
  }
}
