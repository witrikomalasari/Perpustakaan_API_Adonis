import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AdminMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const adminAuth = auth.user?.role === "admin";
    console.log(auth.user?.role);

    if (adminAuth) {
      await next();
    } else {
      response.unauthorized({
        message: "anda tidak bisa mengakses",
      });
    }
  }
}
