import {
  getModelForClass,
  ModelOptions,
  prop,
  ReturnModelType,
} from "npm:@typegoose/typegoose@9.13.x";
import { User } from "./User.ts";
import type { Ref } from "npm:@typegoose/typegoose@9.13.x";
import { Order } from "./Order.ts";

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Apply {
  @prop({ required: true, ref: () => User })
  worker!: Ref<User>;

  @prop({ required: true, ref: () => Order })
  order!: Ref<Order>;

  @prop({ default: "待审核", required: true })
  status!: "待审核" | "已通过" | "已拒绝"; //是否通过雇主同意

  @prop({ default: false, required: true })
  finished!: boolean; //是否完成

  static async getAppliesByUser(
    this: ReturnModelType<typeof Apply>,
    user: string,
  ) {
    const applies = await ApplyModel.find({ worker: user }).populate("order")
      .exec();
    if (!applies) return [];
    return applies;
  }

  static async getAppliesByOrder(
    this: ReturnModelType<typeof Apply>,
    order: string,
  ) {
    const applies = await ApplyModel.find({ order }).populate(
      "worker",
      "name status avatar phone area location",
    ).exec();
    if (!applies) return [];
    return applies;
  }
}

export const ApplyModel = getModelForClass(Apply);
