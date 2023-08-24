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
  Route.resource("users", "UsersController").apiOnly();
  Route.resource("kategoris", "KategorisController").apiOnly();
  Route.resource("profiles", "ProfilesController").apiOnly();
  Route.resource("bukus", "BukusController").apiOnly();
  Route.resource("peminjaman", "PeminjamanController").apiOnly();
}).prefix("/api/v1");

Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login");
  Route.get("/me", "AuthController.me").middleware("auth");
}).prefix("/api/v1/auth");
