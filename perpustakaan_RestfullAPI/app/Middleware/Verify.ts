import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Verify {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const isVerified = auth.user?.isVerified;
    console.log("ver", isVerified);

    if (isVerified) {
      await next();
    } else {
      response.unauthorized({
        message: "anda tidak bs mengakses",
      });
    }
  }
}
