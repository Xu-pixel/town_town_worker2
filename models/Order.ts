import { getModelForClass, prop } from "npm:@typegoose/typegoose@9.13.x";
import { User } from "./User.ts";
import type { Ref } from "npm:@typegoose/typegoose@9.13.x";

export class Order {
  @prop()
  title!: string; //需求标题

  @prop()
  requirements!: string; //事项描述

  @prop({ default: 1 })
  headCount!: number;

  @prop()
  preparations?: string;

  @prop()
  preparationsPrice!: number;

  @prop()
  startTime!: number;

  @prop()
  workTime!: number;

  @prop()
  location!: string; //地址

  @prop()
  area!: string; //地区

  @prop()
  price?: number; //小费

  @prop()
  phone!: string;

  @prop({ type: () => [String] })
  imgs?: string[];

  @prop({ required: true, ref: () => User })
  owner!: Ref<User>;

  @prop({ default: "待确认", required: true })
  status!: "待确认" | "进行中" | "已完成" | "已取消";
}

export const OrderModel = getModelForClass(Order);
