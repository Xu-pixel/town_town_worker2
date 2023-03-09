// 信息表
import {
  getModelForClass,
  ModelOptions,
  prop,
  ReturnModelType,
} from "npm:@typegoose/typegoose@9.13.x";
import type { Ref } from "npm:@typegoose/typegoose@9.13.x";
import { User } from "./User.ts";
import { Order } from "./Order.ts";

@ModelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @prop({ required: true, ref: () => User })
  receiver: Ref<User>; //收信息的人

  @prop()
  content!: string;

  @prop({ required: true })
  title!: string;

  @prop({ default: false })
  isView!: boolean;

  @prop({ required: true, ref: () => Order })
  order: Ref<Order>; //与信息有关的订单

  @prop({ required: true })
  type!: 0 | 1 | 2;

  static async getMessagesByUser(
    this: ReturnModelType<typeof Message>,
    user: string,
  ) {
    const messages = await MessageModel.find({ receiver: user }).exec();
    if (!messages) return [];
    return messages;
  }

  static async getMessagesByOrder(
    this: ReturnModelType<typeof Message>,
    Order: string,
  ) {
    const messages = await MessageModel.find({ Order }).exec();
    if (!messages) return [];
    return messages;
  }
}

export const MessageModel = getModelForClass(Message);
