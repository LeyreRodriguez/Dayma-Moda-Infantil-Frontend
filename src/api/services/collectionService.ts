import { get } from "../httpClient";
import type { Collection, FeaturedCollection } from "../../types/collection";

export const collectionService = {
  getAll: () => {
    return get<Array<Collection>>(`/collections`);
  },
  getFeaturedCollection: () => {
    return get<FeaturedCollection>(`/collections/featured`);
  },

  getCollectionByProduct: ( productCode: string) => {
    return get<Collection>(`/collections/${productCode}`);
  },

};
