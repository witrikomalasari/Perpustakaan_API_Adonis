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
      store: ["auth", "user"],
      update: ["auth", "user"],
      destroy: ["auth", "user"],
      index: ["auth", "admin", "user"],
      show: ["auth", "admin", "user"],
    });

  Route.resource("kategoris", "KategorisController")
    .apiOnly()
    .middleware({
      store: ["auth", "admin"],
      update: ["auth", "admin"],
      destroy: ["auth", "admin"],
      index: ["auth", "admin", "user"],
      show: ["auth", "admin", "user"],
    });

  Route.resource("bukus", "BukusController")
    .apiOnly()
    .middleware({
      store: ["auth", "admin"],
      update: ["auth", "admin"],
      destroy: ["auth", "admin"],
      index: ["auth", "admin", "user"],
      show: ["auth", "admin", "user"],
    });

  // klo route.resource akses/middleware ({"*":['auth','admin']})
  // klo route.post/get/put/delete akses/middleware (['auth','admin'])

  Route.post("/profile", "AuthController.updateProfile").middleware([
    "auth",
    "user",
  ]);

  Route.post("/buku/:id/peminjaman", "PeminjamanController.store").middleware([
    "auth",
    "user",
  ]);

  Route.get("/peminjaman", "PeminjamanController.index").middleware([
    "auth",
    "user",
  ]);

  Route.get("/peminjaman/:id", "PeminjamanController.show").middleware([
    "auth",
    "user",
  ]);
}).prefix("/api/v1");

Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login");
  Route.get("/me", "AuthController.me").middleware(["auth", "admin"]);
}).prefix("/api/v1/auth");
