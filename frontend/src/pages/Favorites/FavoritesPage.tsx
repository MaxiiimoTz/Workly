import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    Star,
    FileText,
    KeyRound,
    ChevronRight,
    ArrowUpRight,
} from "lucide-react";

import axios from "axios";

const api = axios.create({
    baseURL: "https://workly-ilqb.onrender.com/api",
});

// =====================================================
// TIPOS
// =====================================================

interface RecordItem {
    id: string;
    title: string;
    description: string;
    type: string;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CredentialItem {
    id: string;
    name: string;
    system: string;
    environment: string;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
}

type FavoriteItem =
    | {
          kind: "record";
          data: RecordItem;
      }
    | {
          kind: "credential";
          data: CredentialItem;
      };

// =====================================================
// COMPONENTE
// =====================================================

const FavoritesPage = () => {
    const [favorites, setFavorites] =
        useState<FavoriteItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    // =====================================================
    // CARGAR FAVORITOS
    // =====================================================

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                setLoading(true);

                const [
                    recordsResponse,
                    credentialsResponse,
                ] = await Promise.all([
                    api.get("/records"),
                    api.get("/credentials"),
                ]);

                // =================================================
                // REGISTROS FAVORITOS
                // =================================================

                const records: FavoriteItem[] =
                    recordsResponse.data
                        .filter(
                            (record: RecordItem) =>
                                record.favorite
                        )
                        .map(
                            (record: RecordItem) => ({
                                kind: "record" as const,
                                data: record,
                            })
                        );

                // =================================================
                // CREDENCIALES FAVORITAS
                // =================================================

                const credentials: FavoriteItem[] =
                    credentialsResponse.data
                        .filter(
                            (
                                credential: CredentialItem
                            ) =>
                                credential.favorite
                        )
                        .map(
                            (
                                credential: CredentialItem
                            ) => ({
                                kind:
                                    "credential" as const,
                                data: credential,
                            })
                        );

                // =================================================
                // COMBINAR
                // =================================================

                const combined: FavoriteItem[] = [
                    ...records,
                    ...credentials,
                ].sort(
                    (a, b) =>
                        new Date(
                            b.data.updatedAt ||
                                b.data.createdAt
                        ).getTime() -
                        new Date(
                            a.data.updatedAt ||
                                a.data.createdAt
                        ).getTime()
                );

                setFavorites(combined);
            } catch (error) {
                console.error(
                    "Error cargando favoritos:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    const formatDate = (
        date?: string
    ) => {
        if (!date) return "";

        const parsed =
            new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "";
        }

        return parsed.toLocaleDateString(
            "es-PE",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-full rounded-[28px] bg-[#edf2f9] p-1">

            <div className="mx-auto max-w-[1700px] space-y-7">

                {/* =================================================
                    ENCABEZADO
                ================================================== */}

                <section>

                    <div className="flex items-center gap-2">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff5dc]">

                            <Star
                                size={19}
                                className="fill-[#efb01c] text-[#efb01c]"
                            />

                        </div>

                        <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71809d]">
                                Workspace
                            </p>

                            <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#15233e]">
                                Favoritos
                            </h1>

                        </div>

                    </div>

                    <p className="mt-3 text-sm text-[#637492]">
                        Todos tus registros y credenciales destacados.
                    </p>

                </section>

                {/* =================================================
                    CONTENIDO
                ================================================== */}

                <section className="overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-[0_3px_12px_rgba(31,50,84,0.05)]">

                    <div className="flex items-center justify-between border-b border-[#e8edf4] px-6 py-5">

                        <div>

                            <h2 className="text-base font-bold text-[#172642]">
                                Elementos favoritos
                            </h2>

                            <p className="mt-1 text-xs text-[#8a98b2]">
                                Registros y credenciales que has destacado.
                            </p>

                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-[#fff7e5] px-3 py-1.5">

                            <Star
                                size={13}
                                className="fill-[#efb01c] text-[#efb01c]"
                            />

                            <span className="text-xs font-bold text-[#a77b12]">
                                {loading
                                    ? "—"
                                    : favorites.length}
                            </span>

                        </div>

                    </div>

                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {loading ? (

                        <div className="divide-y divide-[#edf0f5] px-6">

                            {[1, 2, 3].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4 py-5"
                                    >

                                        <div className="h-11 w-11 animate-pulse rounded-xl bg-[#edf1f6]" />

                                        <div className="flex-1">

                                            <div className="h-4 w-64 animate-pulse rounded bg-[#edf1f6]" />

                                            <div className="mt-2 h-3 w-40 animate-pulse rounded bg-[#f3f5f8]" />

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    ) : favorites.length === 0 ? (

                        /* =================================================
                            SIN FAVORITOS
                        ================================================== */

                        <div className="px-6 py-20 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff7e5]">

                                <Star
                                    size={25}
                                    className="text-[#d4a52a]"
                                />

                            </div>

                            <h3 className="mt-5 text-sm font-bold text-[#33415c]">
                                No tienes favoritos todavía
                            </h3>

                            <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#8a98b2]">
                                Marca registros o credenciales con la estrella
                                para encontrarlos rápidamente aquí.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                            LISTA
                        ================================================== */

                        <div className="divide-y divide-[#edf0f5] px-6">

                            {favorites.map(
                                (item) => {

                                    const isRecord =
                                        item.kind ===
                                        "record";

                                    const title =
                                        isRecord
                                            ? item.data
                                                  .title
                                            : item.data
                                                  .name;

                                    const subtitle =
                                        isRecord
                                            ? item.data
                                                  .description ||
                                              "Sin descripción"
                                            : `${
                                                  item
                                                      .data
                                                      .system ||
                                                  "Sin sistema"
                                              }${
                                                  item
                                                      .data
                                                      .environment
                                                      ? ` • ${item.data.environment}`
                                                      : ""
                                              }`;

                                    const label =
                                        isRecord
                                            ? item.data
                                                  .type ||
                                              "Registro"
                                            : "Credencial";

                                    const href =
                                        isRecord
                                            ? "/records"
                                            : "/credentials";

                                    return (
                                        <Link
                                            key={`${item.kind}-${item.data.id}`}
                                            to={href}
                                            className="group flex items-center justify-between gap-4 py-5 transition"
                                        >

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                        isRecord
                                                            ? "bg-[#e9eaff]"
                                                            : "bg-[#e8efff]"
                                                    }`}
                                                >

                                                    {isRecord ? (
                                                        <FileText
                                                            size={
                                                                18
                                                            }
                                                            className="text-[#5956e9]"
                                                        />
                                                    ) : (
                                                        <KeyRound
                                                            size={
                                                                18
                                                            }
                                                            className="text-[#5571d4]"
                                                        />
                                                    )}

                                                </div>

                                                <div className="min-w-0">

                                                    <div className="flex items-center gap-2">

                                                        <h3 className="truncate text-sm font-bold text-[#263653]">
                                                            {
                                                                title
                                                            }
                                                        </h3>

                                                    </div>

                                                    <p className="mt-1 truncate text-xs text-[#8a98b2]">
                                                        {
                                                            subtitle
                                                        }
                                                    </p>

                                                    <div className="mt-1.5 flex items-center gap-2">

                                                        <span
                                                            className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                                                                isRecord
                                                                    ? "bg-[#e9eaff] text-[#5956e9]"
                                                                    : "bg-[#e8efff] text-[#5571d4]"
                                                            }`}
                                                        >
                                                            {
                                                                label
                                                            }
                                                        </span>

                                                        <span className="text-[10px] text-[#a0acbd]">
                                                            {formatDate(
                                                                item
                                                                    .data
                                                                    .updatedAt ||
                                                                    item
                                                                        .data
                                                                        .createdAt
                                                            )}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="flex shrink-0 items-center gap-3">

                                                <Star
                                                    size={
                                                        16
                                                    }
                                                    className="fill-[#efb01c] text-[#efb01c]"
                                                />

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[#a3afc0] transition group-hover:bg-[#eef1f6] group-hover:text-[#5b57e7]">

                                                    <ArrowUpRight
                                                        size={
                                                            15
                                                        }
                                                    />

                                                </div>

                                                <ChevronRight
                                                    size={
                                                        15
                                                    }
                                                    className="text-[#c0c8d4] transition group-hover:translate-x-0.5 group-hover:text-[#5b57e7]"
                                                />

                                            </div>

                                        </Link>
                                    );
                                }
                            )}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
};

export default FavoritesPage;