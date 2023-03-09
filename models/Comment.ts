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
export class Comment {
  @prop({ required: true, ref: () => User })
  author!: Ref<User>;

  @prop({ required: true, ref: () => User })
  receiver!: Ref<User>;

  @prop()
  content?: string;

  @prop({ required: true })
  rate!: 0 | 1 | 2; // 0是差评 2是好评

  @prop({ required: true, ref: () => Order })
  order!: Ref<Order>;

  static async getCommentsByReceiver(
    this: ReturnModelType<typeof Comment>,
    receiver: string,
  ) {
    const commentsBox = await CommentModel.find({ receiver }).exec();
    if (!commentsBox) return [];
    return commentsBox;
  }

  static async getMessagesByOrder(
    this: ReturnModelType<typeof Comment>,
    Order: string,
  ) {
    const comments = await CommentModel.find({ Order }).exec();
    if (!comments) return [];
    return comments;
  }
}

export const CommentModel = getModelForClass(Comment);
