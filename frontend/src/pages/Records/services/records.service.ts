import axios from "axios";
import type { Record } from "../types/record";

const api = axios.create({
    baseURL: "https://workly-ilqb.onrender.com/api",
});

export const recordsService = {
    async getAll(): Promise<Record[]> {
        const response = await api.get("/records");
        return response.data;
    },

    async create(
        record: Omit<Record, "id" | "createdAt" | "updatedAt">
    ) {
        const response = await api.post("/records", record);
        return response.data;
    },

    async update(id: string, record: Record) {
        const response = await api.put(`/records/${id}`, record);
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/records/${id}`);
    },

    async toggleFavorite(id: string) {
        const response = await api.patch(`/records/${id}/favorite`);
        return response.data;
    },
};