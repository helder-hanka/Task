import { Application } from "express";
import admin from "./auths/admin";
import dashboard from "./admin/dashboard";

const api: string = "/api/task/";

const routes = (app: Application): void => {
  app.use(`${api}admin`, admin);
  app.use(`${api}admin/dashboard`, dashboard);
};

export default routes;
