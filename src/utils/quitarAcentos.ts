export function quitarAcentos(str: string): string {
  return str.normalize("NFD").replace(/\p{M}/gu, "");
}
