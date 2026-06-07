import type { CreateStorePayload, UpdateStorePayload } from "../types/store.types";
import { api } from "./authApi";


export const storeApi = {
  getMyStore: () => api.get("/store/me"),
  createStore: (data: CreateStorePayload) => api.post("/store", data),
  updateMyStore: (data: UpdateStorePayload) => api.patch("/store/me", data),
};