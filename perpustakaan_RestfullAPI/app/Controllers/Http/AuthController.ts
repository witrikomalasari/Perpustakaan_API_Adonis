import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

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

      await User.create(validationPayload);

      return response.ok({
        message: `register berhasil`,
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

      return response.ok({
        message: "login berhasil",
        token,
      });
    } catch (error) {
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
}
