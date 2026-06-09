import { api } from "./authApi";

export const masterCategoryApi = {
    getAll : ()=>  api.get("/master-categories/"),
}