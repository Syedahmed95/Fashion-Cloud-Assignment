import { Application } from "express";
import FashionCloudRoutes from "./fashion-crud/routes";

export default class Routes {
  public initialize(app: Application) {
    let fashionCloudRoutes = new FashionCloudRoutes();
    fashionCloudRoutes.routes(app);
  }
}
