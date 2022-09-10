import { Request, Response } from "express";
import FashionCloudService from "./service";
import joi from "joi"

export default class FashionCloud {
  private fashionCouldService = new FashionCloudService();
  public create = async (req: Request, res: Response) => {
    try {
      const schema = joi.object({
        key: joi.string().required()
      })
      const options = {
        errors: {
          wrap: {
            label: ''
          }
        }
      };
      const validate = schema.validate(req.body, options)
      if (validate.error) throw {
        status: 400,
        message: validate.error.details[0].message
      }
      let fashionCloudCreate: any = await this.fashionCouldService.create(
        req.body
      );
      if (!fashionCloudCreate.success) {
        throw fashionCloudCreate;
      }
      res.status(201).send(fashionCloudCreate);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Service Error" });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      let payload = {
        key: req.params.id
      };
      let fashionCloudUpdate: any = await this.fashionCouldService.update(
        payload
      );
      if (!fashionCloudUpdate.success) throw fashionCloudUpdate;
      return res.status(200).send(fashionCloudUpdate);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Service Error" });
    }
  };

  public removeKey = async (req: Request, res: Response) => {
    try {
      const key = req.params.id;
      let fashionCloudDeleteKey: any = await this.fashionCouldService.deleteKey(
        key
      );
      if (!fashionCloudDeleteKey.success) throw fashionCloudDeleteKey;
      return res.status(200).send(fashionCloudDeleteKey);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Service Error" });
    }
  };

  public removeAllKey = async (req: Request, res: Response) => {
    try {
      const key = req.params.id;
      let fashionCloudDeleteAllKey: any = await this.fashionCouldService.deleteAllKeys();
      if (!fashionCloudDeleteAllKey.success) throw fashionCloudDeleteAllKey;
      return res.status(200).send(fashionCloudDeleteAllKey);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Service Error" });
    }
  };

  public getkey = async (req: Request, res: Response) => {
    try {
      const key = req.params.id;
      let fashionCloudGetKey: any = await this.fashionCouldService.getKey(key);
      if (!fashionCloudGetKey.success) throw fashionCloudGetKey;
      return res.status(200).send(fashionCloudGetKey);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Service Error" });
    }
  };

  public getAllkeys = async (req: Request, res: Response) => {
    try {
      let fashionCloudAllKeys: any = await this.fashionCouldService.getAllKeys();
      if (!fashionCloudAllKeys.success) throw fashionCloudAllKeys;
      return res.status(200).send(fashionCloudAllKeys);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Service Error" });
    }
  };

}
