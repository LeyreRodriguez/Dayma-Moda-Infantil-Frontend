import { get } from "../httpClient";
import type { Category } from "../../types/category";

export const categoryService = {
  getAll: () => {
    return get<Array<Category>>(`/category`);
  },
};
