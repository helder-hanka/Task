import { Application } from "express";
import admin from "./admin";

const api = "/api/";

const routes = (app: Application): void => {
  app.use(`${api}admin`, admin);
};

export default routes;
