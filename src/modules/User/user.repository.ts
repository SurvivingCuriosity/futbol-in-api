import { IUserDocument, User } from "./user.model";

const findAll = () => User.find().lean<IUserDocument[]>();

const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();

const findById = (id: string) =>
  User.findById(id).exec() as Promise<IUserDocument | null>;

export const UserRepository = {
  findAll,
  findByEmail,
  findById,
};
