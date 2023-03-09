import { getModelForClass, prop } from "npm:@typegoose/typegoose@9.13.x";
import mongoose from "npm:mongoose@~6.7.2";

export class User {
  @prop({ required: true })
  wxOpenId!: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  token!: string;

  @prop({ default: false })
  status!: boolean; //是否认证

  @prop()
  avatar?: string;

  @prop()
  sex?: number;

  @prop()
  seniority?: number; //工龄

  @prop()
  phone?: string;

  @prop()
  area?: string; //地区

  @prop()
  location?: string; //详细地址

  @prop()
  IDNumber?: string; //身份证号

  @prop({ type: () => [String] })
  IDPics?: mongoose.Types.Array<string>; //身份证照片

  @prop({ type: () => [String] })
  stars?: mongoose.Types.Array<string>; //rid
}

export const UserModel = getModelForClass(User);
