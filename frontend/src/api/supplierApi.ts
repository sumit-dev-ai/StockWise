import type { CreateSupplierPayload, UpdateSupplierPayload } from "../types/supplier.types";
import { api } from "./authApi";

export const SupplierApi={
    getAll : ()=>api.get("/suppliers"),
    create : (data : CreateSupplierPayload)=> api.post("/suppliers",data),
    getSuppliersById : (id:number)=> api.get(`/suppliers/${id}`),
    update: (id: number, data: UpdateSupplierPayload) =>
    api.patch(`/suppliers/${id}`, data),
    deactivate: (id: number) => api.patch(`/suppliers/${id}/deactivate`),
}