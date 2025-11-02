import {
  baresAutocompleteService,
  direccionesAutocompleteService,
  getBaresFromPlaceIds,
  getCoordinatesFromPlaceId,
  getCoordinatesFromString,
} from "@/infra/googlemaps.service";
import { ApiResponse, ok } from "@/utils/ApiResponse";
import { quitarAcentos } from "@/utils/quitarAcentos";
import { ValidatedRequest } from "@/utils/types";
import { municipios, Province, Region, Town } from "futbol-in-core/constants";
import { BaresAutoCompleteQuery, CoordsFromStringQuery, CoordsQuery, SearchMunicipioQuery } from "futbol-in-core/schemas";

export const MapsController = {

  getBaresFromPlaceIds: async (req: ValidatedRequest<any, { placeIds: string[] }>) => {
    const ids = req.validatedQuery.placeIds.split(",");
    const data = await getBaresFromPlaceIds(ids);
    return ok(data, "Bares obtenidos");
  },

  coordinatesFromPlaceId: async (req: {
    validatedQuery: CoordsQuery;
  }): Promise<ApiResponse<{ lat: number; lng: number }>> => {
    const data = await getCoordinatesFromPlaceId(req.validatedQuery.placeId);
    return ok(data, "Coordenadas obtenidas");
  },

  baresAutocomplete: async (req: {
    validatedQuery: BaresAutoCompleteQuery;
  }) => {
    const data = await baresAutocompleteService(req.validatedQuery.input);
    return ok(data, "Bares obtenidos");
  },

  direccionesAutocomplete: async (req: {
    validatedQuery: BaresAutoCompleteQuery;
  }) => {
    const data = await direccionesAutocompleteService(req.validatedQuery.input);
    return ok(data, "Bares obtenidos");
  },

  coordinatesFromString: async (req: {
    validatedQuery: CoordsFromStringQuery;
  }): Promise<ApiResponse<{ lat: number; lng: number }>> => {
    const data = await getCoordinatesFromString(req.validatedQuery.string);
    return ok(data, "Coordenadas obtenidas");
  },

  searchMunicipio: async (req: {
    validatedQuery: SearchMunicipioQuery;
  }): Promise<
    ApiResponse<
      { label: string; subLabel: string; value: string; relevance: number }[]
    >
  > => {
    const q = req.validatedQuery.q.trim();
    if (!q) return ok([], "Sin resultados");

    const normalizedQuery = quitarAcentos(q).toLowerCase();
    const results: {
      label: string;
      subLabel: string;
      value: string;
      relevance: number;
    }[] = [];

    municipios.forEach((region: Region) => {
      region.provinces.forEach((province: Province) => {
        province.towns.forEach((town: Town) => {
          const normalizedTown = quitarAcentos(town.label).toLowerCase();

          if (normalizedTown.includes(normalizedQuery)) {
            // Ranking: coincidencias exactas > que empiezan igual > que contienen
            let relevance = 1;
            if (normalizedTown === normalizedQuery) relevance = 3;
            else if (normalizedTown.startsWith(normalizedQuery)) relevance = 2;

            results.push({
              label: town.label,
              subLabel: province.label,
              value: `${town.label}, ${province.label}`,
              relevance,
            });
          }
        });
      });
    });

    // Orden por relevancia y alfabético
    const sorted = results
      .sort(
        (a, b) => b.relevance - a.relevance || a.label.localeCompare(b.label)
      )
      .slice(0, 20);

    return ok(sorted, "Municipios encontrados");
  },
};
