import { User, IUserDocument } from "@/modules/User/user.model";
import { Types } from "mongoose";

const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();

const findByUsername = (username: string) =>
  User.findOne({ name: username }).lean<IUserDocument | null>(); // ajusta si usas campo separado "username"

const findByEmailWithSensitive = (email: string) =>
  User.findOne({ email }).exec(); // no .lean para poder modificar y guardar si quisieras

const findByIdWithSensitive = (id:string) => User.findById(new Types.ObjectId(id)).exec();

const setVerificationCode = async (userId: Types.ObjectId, codeHash: string, expires: Date) => {
  await User.updateOne(
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
  await User.updateOne(
    { _id: userId },
    {
      $set: {
        status: "DONE",
      },
      $unset: {
        verificationCode: "",
        verificationCodeExpires: "",
      },
    }
  );
};

const setUsernameAndDone = async (userId:Types.ObjectId, username:string)=>{
  await User.updateOne({ _id:userId }, { $set:{ name: username, status:"DONE" } });
};

const create = (data: Partial<IUserDocument>) => User.create(data);

export const AuthRepository = {
  findByEmail,
  findByUsername,
  findByEmailWithSensitive,
  setVerificationCode,
  markEmailVerified,
  findByIdWithSensitive,
  create,
  setUsernameAndDone
};
