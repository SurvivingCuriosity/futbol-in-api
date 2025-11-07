import { EditarUserBody } from "futbol-in-core/schemas";
import { UserDoc, UserModel } from "./user.model";
import { UserStatus } from "futbol-in-core/enum";

const findAll = () => UserModel.find().lean<UserDoc[]>();

const findByEmail = (email: string) =>
  UserModel.findOne({ email }).lean<UserDoc | null>();

const findByUsername = (username: string) =>
  UserModel.findOne({ name: username }).lean<UserDoc | null>();

const findById = (id: string) =>
  UserModel.findById(id).exec() as Promise<UserDoc | null>;

const create = (data: Partial<UserDoc>) => UserModel.create(data);

const projection = {
  id: 1,
  name: 1,
  email: 1,
  imagen: 1,
  status: 1,
  role: 1,
  provider: 1,
  createdAt: 1,
  nombre: 1,
  posicion: 1,
  ciudad: 1,
} as const;

// Helper: filtra undefined (no pisa con undefined)
function buildSet(data: Record<string, unknown>) {
  const $set: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) $set[k] = v; // permite null para limpiar
  }
  return $set;
}

const updateEditableById = async (id: string, input: EditarUserBody) => {
  const $set = buildSet({
    name: input.name,
    nombre: input.nombre,
    posicion: input.posicion,
    ciudad: input.ciudad,
    updatedAt: new Date(),
  });

  return UserModel.findByIdAndUpdate(
    id,
    { $set },
    { new: true, runValidators: true, projection }
  ).lean<UserDoc | null>();
};

const updateEmail = async (id: string, nuevoEmail: string, code: string) => {
  return UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        email: nuevoEmail,
        status: UserStatus.MUST_CONFIRM_EMAIL,
        emailVerificationCode: code,
        emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    },
    { new: true }
  ).lean<UserDoc | null>();
};

const updateImage = async (userId: string, path: string | null) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { imagen: path },
    { new: true }
  );
};

const count = async () => {
  const count = await UserModel.countDocuments();
  return count;
};

const deleteById = async (id: string) => {
  return UserModel.findByIdAndDelete(id);
};

export const UserRepository = {
  findAll,
  findByEmail,
  findById,
  updateEditableById,
  create,
  findByUsername,
  updateEmail,
  updateImage,
  count,
  deleteById
};
