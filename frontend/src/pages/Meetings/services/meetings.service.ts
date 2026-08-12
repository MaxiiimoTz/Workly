import axios from "axios";

export type Meeting = {
    id: string;
    title: string;
    notes: string;
    date: string;
    status: "Pendiente" | "Realizada" | "Cancelada";
    createdAt: string;
    updatedAt: string;
};

const api = axios.create({
    baseURL: "https://workly-ilqb.onrender.com/api",
});

export const meetingsService = {

    async getAll(): Promise<Meeting[]> {
        const response = await api.get("/meetings");
        return response.data;
    },

    async create(
        meeting: Omit<
            Meeting,
            "id" | "createdAt" | "updatedAt"
        >
    ) {
        const response = await api.post(
            "/meetings",
            meeting
        );

        return response.data;
    },

    async update(
        id: string,
        meeting: Meeting
    ) {
        const response = await api.put(
            `/meetings/${id}`,
            meeting
        );

        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/meetings/${id}`);
    },
};