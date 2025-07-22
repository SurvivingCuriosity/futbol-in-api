import {User, IUserDocument} from '@/models/user.model'

export const findAll = () => User.find().lean<IUserDocument[]>();
  
export const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();
