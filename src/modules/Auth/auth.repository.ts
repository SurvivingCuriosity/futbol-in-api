import { UserDoc, UserModel } from "@/modules/User/user.model";
import { UserStatus } from "futbol-in-core/enum";
import { Types } from "mongoose";

const findByEmail = (email: string) =>
  UserModel.findOne({ email }).lean<UserDoc | null>();

const findByUsername = (username: string) =>
  UserModel.findOne({ name: username }).lean<UserDoc | null>(); // ajusta si usas campo separado "username"

const findByEmailWithSensitive = (email: string) =>
  UserModel.findOne({ email }).exec(); // no .lean para poder modificar y guardar si quisieras

const findByIdWithSensitive = (id: string) =>
  UserModel.findById(new Types.ObjectId(id)).exec();

const setVerificationCode = async (
  userId: Types.ObjectId,
  codeHash: string,
  expires: Date
) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        verificationCode: codeHash,
        verificationCodeExpires: expires,
        status: "MUST_CONFIRM_EMAIL",
      },
    }
  );
};

const markEmailVerified = async (userId: Types.ObjectId) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        status: UserStatus.DONE,
      },
      $unset: {
        verificationCode: "",
        verificationCodeExpires: "",
      },
    }
  );
};

const setUsernameAndDone = async (userId: Types.ObjectId, username: string) => {
  await UserModel.updateOne(
    { _id: userId },
    { $set: { name: username, status: UserStatus.DONE } }
  );
};

const create = (data: Partial<UserDoc>) => UserModel.create(data);

export const AuthRepository = {
  findByEmail,
  findByUsername,
  findByEmailWithSensitive,
  setVerificationCode,
  markEmailVerified,
  findByIdWithSensitive,
  create,
  setUsernameAndDone,
};
