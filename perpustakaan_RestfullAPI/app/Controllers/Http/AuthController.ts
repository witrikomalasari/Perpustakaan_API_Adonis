import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const newRegisterUser = schema.create({
        nama: schema.string([rules.unique({ table: "users", column: "nama" })]),
        email: schema.string([
          rules.email(),
          rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string(),

        role: schema.enum(["user", "admin"] as const),
      });

      const validationPayload = await request.validate({
        schema: newRegisterUser,
      });

      await User.create(validationPayload);

      return response.ok({
        message: `register berhasil`,
      });
    } catch (error) {
      return response.unauthorized({
        message: `register tidak berhasil`,
        error: error.message,
      });
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const newLoginUser = schema.create({
      email: schema.string([rules.email()]),
      password: schema.string(),
    });

    await request.validate({
      schema: newLoginUser,
    });

    const email = request.input("email");
    const password = request.input("password");

    try {
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
        error: error.message,
      });
    }
  }
  public async me({ auth, response }: HttpContextContract) {
    const user = auth.user;

    return response.ok({ message: user });
  }
}
