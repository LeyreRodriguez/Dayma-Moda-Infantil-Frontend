import { get } from "../httpClient";
import type { Material } from "../../types/material";

export const materialService = {
  getAll: () => {
    return get<Array<Material>>(`/materials`);
  },
};
