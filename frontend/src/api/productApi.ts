import type { CreateProductPayload, ProductFilters, UpdateProductPayload } from "../types/product.types";
import { api } from "./authApi";

export const productApi = {
    getProducts : (filters?: ProductFilters) => {
        return api.get("/products", {
            params : filters,
        });
    },

    getProductById : (id : number) =>{
        return api.get(`/products/${id}`)
    },
    createProduct: (data: CreateProductPayload) => {
    return api.post("/products", data);
    },

    updateProduct: (id: number, data: UpdateProductPayload) => {
    return api.patch(`/products/${id}`, data);
    } ,
    deactivateProduct: (id: number) => {
    return api.delete(`/products/${id}`);
    },

    getLowStockProducts: () => {
    return api.get("/products/low-stock");
  },

}