/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.resource("users", "UsersController")
    .apiOnly()
    .middleware({
      store: ["auth", "verify", "user"], // user
      update: ["auth", "verify", "user"], // user
      destroy: ["auth", "verify", "user"], // user
    });

  Route.resource("kategoris", "KategorisController")
    .apiOnly()
    .middleware({
      store: ["auth", "verify", "admin"],
      update: ["auth", "verify", "admin"],
      destroy: ["auth", "verify", "admin"],
    });

  Route.resource("bukus", "BukusController")
    .apiOnly()
    .middleware({
      store: ["auth", "verify", "admin"],
      update: ["auth", "verify", "admin"],
      destroy: ["auth", "verify", "admin"],
    });

  // klo route.resource akses/middleware ({"*":['auth','admin']})
  // klo route.post/get/put/delete akses/middleware (['auth','admin'])

  Route.post("/profile", "AuthController.updateProfile").middleware([
    "auth",
    "verify",
    "user",
  ]);

  Route.post("/buku/:id/peminjaman", "PeminjamanController.store").middleware([
    "auth",
    "verify",
    "user",
  ]);

  Route.get("/peminjaman", "PeminjamanController.index").middleware([
    "auth",
    "verify",
    "user",
  ]);

  Route.get("/peminjaman/:id", "PeminjamanController.show").middleware([
    "auth",
    "verify",
    "user",
  ]);

  Route.post("/verifikasiOTP", "AuthController.otpConfirmation");
}).prefix("/api/v1");

Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login");
  Route.get("/me", "AuthController.me").middleware(["auth"]);
}).prefix("/api/v1/auth");
