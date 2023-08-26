import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UserMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const userAuth = auth.user?.role === "user";
    console.log("u", auth.user?.role);

    if (userAuth) {
      await next();
    } else {
      response.unauthorized({
        message: "anda tidak bisa mengakses",
      });
    }
  }
}
