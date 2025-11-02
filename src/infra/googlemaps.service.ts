import { Bar } from "futbol-in-core/types";

const BASE = "https://maps.googleapis.com/maps/api";
const API_KEY = process.env.MAPS_API_KEY!;
if (!API_KEY) throw new Error("Falta MAPS_API_KEY");

export async function gmapsGet<T>(path: string, qs: Record<string, string>) {
  const url =
    BASE +
    path +
    "?" +
    new URLSearchParams({ ...qs, key: API_KEY, components: "country:es" });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as { status: string } & T;
  if (json.status !== "OK")
    throw new Error(`Google Maps error: ${json.status}`);

  return json as T;
}

export const getCoordinatesFromPlaceId = async (placeId: string) => {
  type GRes = {
    result: { geometry: { location: { lat: number; lng: number } } };
  };
  const data = await gmapsGet<GRes>("/place/details/json", {
    place_id: placeId,
    fields: "geometry",
  });
  return data.result.geometry.location;
};

export const baresAutocompleteService = async (input: string) => {
  const data = await gmapsGet("/place/autocomplete/json", {
    input: input,
    types: "establishment",
  });
  return data;
};

export const direccionesAutocompleteService = async (input: string) => {
  const data = await gmapsGet("/place/autocomplete/json", {
    input: input,
    types: "address",
  });
  return data;
};

export const getCoordinatesFromString = async (string: string) => {
  type GRes = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
  };
  const data = await gmapsGet<GRes>("/geocode/json", {
    address: string,
    fields: "geometry",
  });
  return data.results[0].geometry.location;
};

export const getBaresFromPlaceIds = async (placeIds: string[]) => {
  type GRes = {
    result: {
      place_id: string;
      name: string;
      formatted_address?: string;
      geometry?: { location: { lat: number; lng: number } };
      types?: string[];
      photos?: { photo_reference: string }[];
      current_opening_hours?: { open_now?: boolean };
      rating?: number;
      user_ratings_total?: number;
      formatted_phone_number?: string;
      international_phone_number?: string;
      website?: string;
      url?: string;
    };
  };

  const bares = await Promise.all(
    placeIds.map(async (id) => {
      try {
        const data = await gmapsGet<GRes>("/place/details/json", {
          place_id: id,
        });
        const r = data.result;
        return mapToBar(r);
      } catch (err) {
        console.error(`❌ Error al obtener details de ${id}`, err);
        return null;
      }
    })
  );

  // Filtramos los que fallaron
  return bares.filter((b) => b !== null);
};

export const buildPhotoUrl = (photoReference: string, maxWidth = 400) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${API_KEY}`;
};

export const mapToBar = (p: any): Bar => ({
  placeId: p.place_id,
  nombre: p.name,
  direccion: p.formatted_address,
  lat: p.geometry?.location.lat ?? null,
  lng: p.geometry?.location.lng ?? null,
  abiertoAhora: p.current_opening_hours?.open_now ?? null,
  fotoUrl: p.photos?.[0]
    ? buildPhotoUrl(p.photos[0].photo_reference as string)
    : "",
  puntuacion: p.rating ?? null,
  numResenas: p.user_ratings_total ?? null,
  telefono: p.formatted_phone_number ?? null,
  web: p.website ?? null,
  mapsUrl: p.url ?? null,
});
