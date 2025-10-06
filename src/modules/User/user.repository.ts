import { IUserDocument, User } from "./user.model";

const findAll = () => User.find().lean<IUserDocument[]>();

const findByEmail = (email: string) =>
  User.findOne({ email }).lean<IUserDocument | null>();

const findById = (id: string) =>
  User.findById(id).exec() as Promise<IUserDocument | null>;

const create = (data: Partial<IUserDocument>) => User.create(data);

type Editable = Pick<
  IUserDocument,
  "nombre" | "telefono" | "posicion" | "ciudad" | "ciudadActual" | "imagen"
>;

const projection = {
  id: 1,
  idOperador: 1,
  name: 1,
  email: 1,
  imagen: 1,
  status: 1,
  role: 1,
  provider: 1,
  createdAt: 1,
  stats: 1,
  equipos: 1,
  nombre: 1,
  telefono: 1,
  posicion: 1,
  ciudad: 1,
  ciudadActual: 1,
} as const;

// Helper: filtra undefined (no pisa con undefined)
function buildSet(data: Record<string, unknown>) {
  const $set: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) $set[k] = v; // permite null para limpiar
  }
  return $set;
}

const updateEditableById = async (id: string, input: Partial<Editable>) => {
  const $set = buildSet({
    nombre: input.nombre,
    telefono: input.telefono,
    posicion: input.posicion,
    ciudad: input.ciudad,
    ciudadActual: input.ciudadActual,
    imagen: input.imagen,
    updatedAt: new Date(),
  });

  return User.findByIdAndUpdate(
    id,
    { $set },
    { new: true, runValidators: true, projection }
  ).lean<IUserDocument | null>();
};

export const UserRepository = {
  findAll,
  findByEmail,
  findById,
  updateEditableById,
  create
};
