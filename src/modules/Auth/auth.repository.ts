import { IUserDocument, User } from "@/models/user.model";

const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();

export const AuthRepository = {
  findByEmail,
};