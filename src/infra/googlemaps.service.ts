const BASE = 'https://maps.googleapis.com/maps/api';
const API_KEY = process.env.MAPS_API_KEY!;
if (!API_KEY) throw new Error('Falta MAPS_API_KEY');

export async function gmapsGet<T>(path: string, qs: Record<string, string>) {
  const url =
    BASE + path +
    '?' +
    new URLSearchParams({ ...qs, key: API_KEY, components: 'country:es' });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = (await res.json()) as { status: string } & T;

  if (json.status !== 'OK')
    throw new Error(`Google Maps error: ${json.status}`);

  return json as T;
}

export const getCoordinatesFromPlaceId = async (placeId: string) => {
  type GRes = { result: { geometry: { location: { lat: number; lng: number } } } };
  const data = await gmapsGet<GRes>('/place/details/json', {
    place_id: placeId,
    fields: 'geometry',
  });
  return data.result.geometry.location;
};
