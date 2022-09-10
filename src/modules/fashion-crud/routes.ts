import { Application, Router } from "express";
import FashionCloud from "./controller";

export default class FashionCloudRoutes {
  public routes(app: Application) {
    let router = Router();
    app.use("/cache", router);

    let fashionCloudController = new FashionCloud();

    router.get("/", fashionCloudController.getAllkeys);
    router.post("/", fashionCloudController.create);
    router.delete("/", fashionCloudController.removeAllKey);

    router.get("/:id", fashionCloudController.getkey);
    router.put("/:id", fashionCloudController.update);
    router.delete("/:id", fashionCloudController.removeKey);
  }
}
