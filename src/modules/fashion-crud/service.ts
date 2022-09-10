import { cacheModel } from "./model";
import pino from "pino"
type CreateCache = {
  key: String;
  value: String;
};

type updateCache = {
  key: String
}

type TTLCache = {
  ttl: Number;
};

type Combine = CreateCache & TTLCache;

export default class FashionCloudService {
  public create = async (payload: Combine) => {
    try {
      await this.deleteOldestOne()
      payload.ttl = this.setTTL()
      payload.value = this.randomString()
      const saveCache = payload;
      const createCache = await cacheModel.create(saveCache);
      return {
        success: true,
        message: "Successfully saved",
        data: createCache
      };
    } catch (error) {
      return error;
    }
  };

  public update = async (payload: updateCache) => {
    try {
      await this.deleteOldestOne()
      let updateKey = await cacheModel.findOneAndUpdate(
        { key: payload.key },
        { value: this.randomString(), ttl: this.setTTL() },
        { upsert: true, new: true }
      );
      return { success: true, data: updateKey };
    } catch (error) {
      return error;
    }
  };

  public deleteKey = async (payload: String) => {
    try {
      let keyDelete = await cacheModel.deleteOne({ key: payload });
      if (keyDelete.deletedCount <= 0) {
        throw {
          status: 404,
          message: "Key not found"
        }
      }
      return { success: true, message: "Successfully deleted the key" };
    } catch (error) {
      return error;
    }
  };

  public deleteAllKeys = async () => {
    try {
      await cacheModel.deleteMany();
      return { success: true };
    } catch (error) {
      return error;
    }
  };

  public getKey = async (payload: String) => {
    try {
      const findKey = await cacheModel.findOne({ key: payload }).select("ttl")
      if (findKey) {
        // key is found, but checking for if the TTL is not expired
        if (new Date(findKey.ttl).getTime() >= new Date().getTime()) {
          pino().info(`Cache hit`)
          const updatedKeyTTL = await cacheModel.findOneAndUpdate({ key: payload }, { ttl: this.setTTL() })
          return { success: true, data: updatedKeyTTL }
          // If TTL is expired this will update that particular record with new random string and with new TTL
        } else {
          pino().info(`Cache miss`)
          const updatedKeyTTL = await this.update({ key: payload })
          return { success: true, data: updatedKeyTTL }
        }
      }
      // This will create that key
      if (!findKey) {
        pino().info(`Cache miss`)
        const createKey: any = await this.update({ key: payload })
        if (!createKey.success) throw createKey
        return { success: false, message: "Successfully new key added" }
      }
    } catch (error) {
      return error
    }
  };

  public getAllKeys = async () => {
    try {
      const getAllKeys = await cacheModel.find()
      if (getAllKeys.length > 0) {
        await cacheModel.updateMany({}, { $set: { ttl: this.setTTL() } })
      }
      return {
        success: true,
        list: getAllKeys
      }
    } catch (error) {
      return error
    }
  };

  public randomString() {
    return Math.random().toString(36).substring(2, 7);
  };

  /**
   * 
   * @returns the TTL with 5 mins over the current time. 
   */
  public setTTL() {
    let dateObj = new Date()
    const updateTTL = dateObj.setMinutes(dateObj.getMinutes() + 5)
    return updateTTL
  };

  /*
    Deleting the oldest one, because it would be the oldest one and not be used recently. 
  */
  public deleteOldestOne = async () => {
    const count = await cacheModel.count()
    if (count >= 5) {
      const oldestOne = await cacheModel.findOne().sort({ createdAt: 1 })
      await cacheModel.deleteOne({ _id: oldestOne?.id })
    }
  }
}
