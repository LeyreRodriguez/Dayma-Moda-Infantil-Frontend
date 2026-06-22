import { get } from "../httpClient";
import type { Size } from "../../types/size";

export const sizeService = {
  getAll: () => {
    return get<Array<Size>>(`/sizes`);
  },
};
