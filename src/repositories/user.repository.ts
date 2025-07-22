import {User, IUserDocument} from '@/models/user.model'


export const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();
