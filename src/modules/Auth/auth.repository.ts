import { IUserDocument, User } from "../User/user.model";

const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();

export const AuthRepository = {
  findByEmail,
};