import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Routes from "./modules/routes";
import pino from "pino";

dotenv.config();

class App {
  public app: express.Application;
  public routes = new Routes();
  constructor() {
    this.app = express();
    this.config();
    this.database();
  }
  config() {
    this.app.use(express.json());
    this.routes.initialize(this.app);
  }
  database() {
    const mongoDB = process.env.mongooseURI || "mongodb://localhost:27017/test"
    mongoose
      .connect(
        mongoDB
      )
      .then(() => {
        pino().info("MongoDB Connection Established");
      })
      .catch((error) => {
        pino().error(`MongoDB Connection problem due to ${error}`);
      });
  }
}

export default new App().app;
