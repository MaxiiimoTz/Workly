import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    KeyRound,
    Star,
    ArrowUpRight,
    Clock3,
    ChevronRight,
    CircleDot,
} from "lucide-react";
import axios from "axios";

const api = axios.create({
    baseURL: ""https://workly-ilqb.onrender.com/api"",
});

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

const DashboardPage = () => {
    const [recordsCount, setRecordsCount] = useState(0);
    const [credentialsCount, setCredentialsCount] = useState(0);
    const [favoritesCount, setFavoritesCount] = useState(0);

    const [recentRecords, setRecentRecords] =
        useState<RecordItem[]>([]);

    const [recentCredentials, setRecentCredentials] =
        useState<CredentialItem[]>([]);

    const [loading, setLoading] = useState(true);

    // =========================================================
    // FECHA
    // =========================================================

    const today = new Date();

    const formattedDate = today.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });

    const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() +
        formattedDate.slice(1);

    // =========================================================
    // CARGAR DASHBOARD
    // =========================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [
                    records,
                    credentials,
                    recordFavorites,
                    credentialFavorites,
                    recent,
                    recentCredentialData,
                ] = await Promise.all([
                    api.get("/records/count"),
                    api.get("/credentials/count"),
                    api.get("/records/favorites/count"),
                    api.get("/credentials/favorites/count"),
                    api.get("/records"),
                    api.get("/credentials"),
                ]);

                setRecordsCount(records.data);
                setCredentialsCount(credentials.data);

                const totalFavorites =
                    recordFavorites.data +
                    credentialFavorites.data;

                setFavoritesCount(totalFavorites);

                setRecentRecords(
                    recent.data.slice(0, 5)
                );

                setRecentCredentials(
                    recentCredentialData.data.slice(0, 5)
                );
            } catch (error) {
                console.error(
                    "Error cargando el dashboard:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // =========================================================
    // TIEMPO RELATIVO
    // =========================================================

    const getRelativeTime = (date?: string) => {
        if (!date) {
            return "Sin actividad";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "Sin actividad";
        }

        const difference =
            Date.now() - parsed.getTime();

        if (difference < 0) {
            return "Actualizado recientemente";
        }

        const seconds = Math.floor(
            difference / 1000
        );

        if (seconds < 60) {
            return "Hace unos segundos";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        if (minutes < 60) {
            return `Hace ${minutes} ${
                minutes === 1
                    ? "minuto"
                    : "minutos"
            }`;
        }

        const hours = Math.floor(
            minutes / 60
        );

        if (hours < 24) {
            return `Hace ${hours} ${
                hours === 1
                    ? "hora"
                    : "horas"
            }`;
        }

        const days = Math.floor(
            hours / 24
        );

        if (days < 30) {
            return `Hace ${days} ${
                days === 1
                    ? "día"
                    : "días"
            }`;
        }

        const months = Math.floor(
            days / 30
        );

        if (months < 12) {
            return `Hace ${months} ${
                months === 1
                    ? "mes"
                    : "meses"
            }`;
        }

        const years = Math.floor(
            months / 12
        );

        return `Hace ${years} ${
            years === 1
                ? "año"
                : "años"
        }`;
    };

    // =========================================================
    // PORCENTAJES VISUALES
    // =========================================================

    const recordsProgress = Math.min(
        recordsCount * 5 + 8,
        100
    );

    const credentialsProgress = Math.min(
        credentialsCount * 8 + 8,
        100
    );

    const favoritesProgress = Math.min(
        favoritesCount * 12 + 8,
        100
    );

    // =========================================================
    // TIPO DE REGISTRO
    // =========================================================

    const getRecordTypeStyle = (
        type: string
    ) => {
        switch (type) {
            case "Credencial":
                return {
                    container:
                        "bg-[#e9efff] text-[#4f69c8]",
                    icon: KeyRound,
                };

            case "Pendiente":
                return {
                    container:
                        "bg-[#fff0f1] text-[#d65d6b]",
                    icon: CircleDot,
                };

            case "Idea":
                return {
                    container:
                        "bg-[#f0edff] text-[#6b5be8]",
                    icon: CircleDot,
                };

            case "Link":
                return {
                    container:
                        "bg-[#e7f7f1] text-[#0c9c70]",
                    icon: ArrowUpRight,
                };

            default:
                return {
                    container:
                        "bg-[#e9eaff] text-[#5956e9]",
                    icon: FileText,
                };
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-full rounded-[28px] bg-[#edf2f9] p-1 sm:p-2">

            <div className="mx-auto max-w-[1700px] space-y-5 sm:space-y-6 lg:space-y-7">

                {/* =================================================
                    ENCABEZADO
                ================================================== */}

                <section className="px-1 pt-1">

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#71809d] sm:text-[10px] sm:tracking-[0.2em]">
                        {capitalizedDate}
                    </p>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                        <div className="min-w-0">

                            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.035em] text-[#15233e] sm:text-[32px] lg:text-[34px]">
                                ¡Buenos días, Máximo! 👋
                            </h1>

                            <p className="mt-1.5 text-xs text-[#637492] sm:text-sm">
                                Todo lo que necesitas, en un solo lugar.
                            </p>

                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#dce4ef] bg-white px-3.5 py-2 shadow-[0_2px_8px_rgba(31,50,84,0.04)] sm:px-4 sm:py-2.5">

                            <div className="h-2 w-2 rounded-full bg-[#0db77d] shadow-sm shadow-[#0db77d]/40" />

                            <span className="text-[11px] font-semibold text-[#60708e] sm:text-xs">
                                Workspace activo
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ESTADÍSTICAS
                ================================================== */}

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {/* REGISTROS */}

                    <div className="rounded-2xl border border-[#dce4ef] bg-white p-4 shadow-[0_3px_12px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,50,84,0.08)] sm:p-5">

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9eaff] sm:h-11 sm:w-11">

                                <FileText
                                    size={19}
                                    className="text-[#5956e9]"
                                />

                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a98b2] sm:text-[10px]">
                                Total
                            </span>

                        </div>

                        <div className="mt-4 flex items-end justify-between sm:mt-5">

                            <div>

                                <p className="text-[28px] font-bold tracking-tight text-[#15233e] sm:text-[30px]">
                                    {loading
                                        ? "—"
                                        : recordsCount}
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-[#637492] sm:text-sm">
                                    Registros
                                </p>

                            </div>

                            <span className="mb-1 text-[11px] font-semibold text-[#71809d] sm:text-xs">
                                Guardados
                            </span>

                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf0f5] sm:mt-5">

                            <div
                                className="h-full rounded-full bg-[#625ff1] transition-all duration-700"
                                style={{
                                    width: `${recordsProgress}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* CREDENCIALES */}

                    <div className="rounded-2xl border border-[#dce4ef] bg-white p-4 shadow-[0_3px_12px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,50,84,0.08)] sm:p-5">

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8efff] sm:h-11 sm:w-11">

                                <KeyRound
                                    size={19}
                                    className="text-[#5571d4]"
                                />

                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a98b2] sm:text-[10px]">
                                Total
                            </span>

                        </div>

                        <div className="mt-4 flex items-end justify-between sm:mt-5">

                            <div>

                                <p className="text-[28px] font-bold tracking-tight text-[#15233e] sm:text-[30px]">
                                    {loading
                                        ? "—"
                                        : credentialsCount}
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-[#637492] sm:text-sm">
                                    Credenciales
                                </p>

                            </div>

                            <span className="mb-1 text-[11px] font-semibold text-[#71809d] sm:text-xs">
                                Protegidas
                            </span>

                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf0f5] sm:mt-5">

                            <div
                                className="h-full rounded-full bg-[#5571d4] transition-all duration-700"
                                style={{
                                    width: `${credentialsProgress}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* FAVORITOS */}

                    <Link
                        to="/favorites"
                        className="group rounded-2xl border border-[#dce4ef] bg-white p-4 shadow-[0_3px_12px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,50,84,0.08)] sm:p-5"
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff5dc] sm:h-11 sm:w-11">

                                <Star
                                    size={19}
                                    className="fill-[#f1b019] text-[#f1b019]"
                                />

                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a98b2] sm:text-[10px]">
                                Guardados
                            </span>

                        </div>

                        <div className="mt-4 flex items-end justify-between sm:mt-5">

                            <div>

                                <p className="text-[28px] font-bold tracking-tight text-[#15233e] sm:text-[30px]">
                                    {loading
                                        ? "—"
                                        : favoritesCount}
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-[#637492] sm:text-sm">
                                    Favoritos
                                </p>

                            </div>

                            <span className="mb-1 text-[11px] font-semibold text-[#8a98b2] sm:text-xs">
                                Destacados
                            </span>

                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f3f0e8] sm:mt-5">

                            <div
                                className="h-full rounded-full bg-[#efb01c] transition-all duration-700"
                                style={{
                                    width: `${favoritesProgress}%`,
                                }}
                            />

                        </div>

                    </Link>

                </section>


                {/* =================================================
                    CONTENIDO
                ================================================== */}

                <section className="grid grid-cols-1 gap-5 lg:gap-6 xl:grid-cols-[1.55fr_1fr]">

                    {/* =================================================
                        REGISTROS RECIENTES
                    ================================================== */}

                    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-[0_3px_12px_rgba(31,50,84,0.05)]">

                        <div className="flex flex-col gap-3 border-b border-[#e8edf4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">

                            <div className="min-w-0">

                                <div className="flex items-center gap-2">

                                    <div className="h-2 w-2 shrink-0 rounded-full bg-[#5956e9]" />

                                    <h2 className="text-sm font-bold text-[#172642] sm:text-base">
                                        Registros recientes
                                    </h2>

                                </div>

                                <p className="mt-1 text-[11px] text-[#8a98b2] sm:text-xs">
                                    Tus últimos registros guardados o modificados.
                                </p>

                            </div>

                            <Link
                                to="/records"
                                className="flex w-fit items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#5b57e7] transition hover:bg-[#f2f1ff] sm:text-xs"
                            >
                                Ver todos
                                <ChevronRight size={14} />
                            </Link>

                        </div>


                        <div className="px-3 sm:px-6">

                            {loading ? (

                                <div className="divide-y divide-[#edf0f5]">

                                    {[1, 2, 3, 4, 5].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 py-4 sm:gap-4 sm:py-5"
                                            >

                                                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#edf1f6]" />

                                                <div className="min-w-0 flex-1">

                                                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#edf1f6]" />

                                                    <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-[#f3f5f8]" />

                                                </div>

                                                <div className="hidden h-6 w-16 shrink-0 animate-pulse rounded-full bg-[#edf1f6] sm:block" />

                                            </div>
                                        )
                                    )}

                                </div>

                            ) : recentRecords.length === 0 ? (

                                <div className="py-12 text-center sm:py-16">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf2f8]">

                                        <FileText
                                            size={23}
                                            className="text-[#9ba8bb]"
                                        />

                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-[#65738d]">
                                        Todavía no tienes registros.
                                    </p>

                                    <p className="mx-auto mt-1 max-w-xs text-xs text-[#9aa7bb]">
                                        Crea uno para comenzar a organizar tu Workspace.
                                    </p>

                                    <Link
                                        to="/records"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5547e8] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#5547e8]/20 transition hover:bg-[#493bd4]"
                                    >
                                        Crear registro
                                        <ArrowUpRight size={14} />
                                    </Link>

                                </div>

                            ) : (

                                <div className="divide-y divide-[#edf0f5]">

                                    {recentRecords.map(
                                        (record) => {

                                            const style =
                                                getRecordTypeStyle(
                                                    record.type
                                                );

                                            const Icon =
                                                style.icon;

                                            return (

                                                <div
                                                    key={record.id}
                                                    className="group flex items-center justify-between gap-3 py-4 sm:gap-4 sm:py-5"
                                                >

                                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.container}`}
                                                        >
                                                            <Icon size={16} />
                                                        </div>


                                                        <div className="min-w-0">

                                                            <h3 className="truncate text-xs font-bold text-[#263653] sm:text-sm">
                                                                {record.title}
                                                            </h3>

                                                            <p className="mt-1 truncate text-[10px] text-[#8a98b2] sm:text-xs">
                                                                {record.description ||
                                                                    "Sin descripción"}
                                                            </p>

                                                            <div className="mt-1.5 flex items-center gap-1.5 text-[9px] font-medium text-[#9aa7bb] sm:text-[10px]">

                                                                <Clock3
                                                                    size={10}
                                                                />

                                                                <span>
                                                                    {getRelativeTime(
                                                                        record.updatedAt ||
                                                                        record.createdAt
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                                                        <span
                                                            className={`hidden rounded-lg px-2.5 py-1.5 text-[10px] font-bold sm:inline-flex ${style.container}`}
                                                        >
                                                            {record.type}
                                                        </span>

                                                        {record.favorite && (
                                                            <Star
                                                                size={13}
                                                                className="fill-[#efb01c] text-[#efb01c] sm:size-[14px]"
                                                            />
                                                        )}

                                                        <Link
                                                            to="/records"
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#a3afc0] transition hover:bg-[#eef1f6] hover:text-[#5b57e7] sm:opacity-0 sm:group-hover:opacity-100"
                                                        >
                                                            <ArrowUpRight
                                                                size={14}
                                                            />
                                                        </Link>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        COLUMNA DERECHA
                    ================================================== */}

                    <div className="min-w-0 space-y-5 sm:space-y-6">

                        {/* RESUMEN */}

                        <div className="rounded-2xl border border-[#dce4ef] bg-white shadow-[0_3px_12px_rgba(31,50,84,0.05)]">

                            <div className="flex items-center justify-between border-b border-[#e8edf4] px-4 py-4 sm:px-6 sm:py-5">

                                <div>

                                    <h2 className="text-sm font-bold text-[#172642] sm:text-base">
                                        Resumen
                                    </h2>

                                    <p className="mt-1 text-[11px] text-[#8a98b2] sm:text-xs">
                                        Estado actual de tu Workspace.
                                    </p>

                                </div>

                                <Clock3
                                    size={17}
                                    className="text-[#9aa7bb]"
                                />

                            </div>


                            <div className="space-y-1 p-3 sm:p-4">

                                {/* REGISTROS */}

                                <Link
                                    to="/records"
                                    className="group flex items-center justify-between rounded-xl px-2.5 py-3 transition hover:bg-[#f5f7fa] sm:px-3 sm:py-4"
                                >

                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff] sm:h-10 sm:w-10">

                                            <FileText
                                                size={16}
                                                className="text-[#5956e9]"
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs font-bold text-[#33415c] sm:text-sm">
                                                Registros
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] text-[#8a98b2] sm:text-[11px]">
                                                Información almacenada
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex shrink-0 items-center gap-2">

                                        <span className="text-xs font-bold text-[#33415c] sm:text-sm">
                                            {recordsCount}
                                        </span>

                                        <ChevronRight
                                            size={14}
                                            className="text-[#c0c8d4] transition group-hover:translate-x-0.5 group-hover:text-[#5956e9]"
                                        />

                                    </div>

                                </Link>


                                {/* CREDENCIALES */}

                                <Link
                                    to="/credentials"
                                    className="group flex items-center justify-between rounded-xl px-2.5 py-3 transition hover:bg-[#f5f7fa] sm:px-3 sm:py-4"
                                >

                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8efff] sm:h-10 sm:w-10">

                                            <KeyRound
                                                size={16}
                                                className="text-[#5571d4]"
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs font-bold text-[#33415c] sm:text-sm">
                                                Credenciales
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] text-[#8a98b2] sm:text-[11px]">
                                                Accesos almacenados
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex shrink-0 items-center gap-2">

                                        <span className="text-xs font-bold text-[#33415c] sm:text-sm">
                                            {credentialsCount}
                                        </span>

                                        <ChevronRight
                                            size={14}
                                            className="text-[#c0c8d4] transition group-hover:translate-x-0.5 group-hover:text-[#5571d4]"
                                        />

                                    </div>

                                </Link>


                                {/* FAVORITOS */}

                                <Link
                                    to="/favorites"
                                    className="group flex items-center justify-between rounded-xl px-2.5 py-3 transition hover:bg-[#f5f7fa] sm:px-3 sm:py-4"
                                >

                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff5dc] sm:h-10 sm:w-10">

                                            <Star
                                                size={16}
                                                className="fill-[#f1b019] text-[#f1b019]"
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-xs font-bold text-[#33415c] sm:text-sm">
                                                Favoritos
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] text-[#8a98b2] sm:text-[11px]">
                                                Elementos destacados
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex shrink-0 items-center gap-2">

                                        <span className="text-xs font-bold text-[#33415c] sm:text-sm">
                                            {loading
                                                ? "—"
                                                : favoritesCount}
                                        </span>

                                        <ChevronRight
                                            size={14}
                                            className="text-[#c39b35] transition group-hover:translate-x-0.5"
                                        />

                                    </div>

                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                            CREDENCIALES RECIENTES
                        ================================================== */}

                        <div className="overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-[0_3px_12px_rgba(31,50,84,0.05)]">

                            <div className="flex items-center justify-between border-b border-[#e8edf4] px-4 py-4 sm:px-6 sm:py-5">

                                <div>

                                    <h2 className="text-sm font-bold text-[#172642] sm:text-base">
                                        Credenciales recientes
                                    </h2>

                                    <p className="mt-1 text-[10px] text-[#8a98b2] sm:text-xs">
                                        Últimos accesos agregados.
                                    </p>

                                </div>

                                <KeyRound
                                    size={16}
                                    className="text-[#8c98ab]"
                                />

                            </div>


                            <div className="p-3 sm:p-4">

                                {recentCredentials.length === 0 ? (

                                    <div className="px-3 py-7 text-center sm:py-8">

                                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2f7]">

                                            <KeyRound
                                                size={18}
                                                className="text-[#9ba8bb]"
                                            />

                                        </div>

                                        <p className="mt-3 text-xs font-semibold text-[#65738d]">
                                            No hay credenciales recientes.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-1">

                                        {recentCredentials
                                            .slice(0, 4)
                                            .map(
                                                (
                                                    credential
                                                ) => (

                                                    <Link
                                                        key={
                                                            credential.id
                                                        }
                                                        to="/credentials"
                                                        className="group flex items-center gap-3 rounded-xl px-2.5 py-3 transition hover:bg-[#f5f7fa] sm:px-3"
                                                    >

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8efff]">

                                                            <KeyRound
                                                                size={15}
                                                                className="text-[#5571d4]"
                                                            />

                                                        </div>


                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-[11px] font-bold text-[#33415c] sm:text-xs">
                                                                {
                                                                    credential.name
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 truncate text-[9px] text-[#8a98b2] sm:text-[10px]">

                                                                {
                                                                    credential.system ||
                                                                    "Sin sistema"
                                                                }

                                                                {credential.environment &&
                                                                    ` • ${credential.environment}`}

                                                            </p>

                                                        </div>


                                                        {credential.favorite && (
                                                            <Star
                                                                size={12}
                                                                className="shrink-0 fill-[#efb01c] text-[#efb01c]"
                                                            />
                                                        )}


                                                        <ChevronRight
                                                            size={14}
                                                            className="shrink-0 text-[#c0c8d4] transition group-hover:translate-x-0.5 group-hover:text-[#5571d4]"
                                                        />

                                                    </Link>

                                                )
                                            )}

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ACCESO RÁPIDO
                        ================================================== */}

                        <div className="overflow-hidden rounded-2xl border border-[#d9d8ff] bg-gradient-to-br from-[#f0efff] via-white to-white p-5 sm:p-6">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5547e8] shadow-md shadow-[#5547e8]/20 sm:h-11 sm:w-11">

                                <KeyRound
                                    size={17}
                                    className="text-white sm:size-[18px]"
                                />

                            </div>

                            <h3 className="mt-4 text-sm font-bold text-[#172642] sm:mt-5 sm:text-base">
                                Mantén tus accesos organizados
                            </h3>

                            <p className="mt-2 text-[11px] leading-5 text-[#71809d] sm:text-xs">
                                Guarda servidores, usuarios, contraseñas,
                                URLs y demás información importante en un
                                solo lugar.
                            </p>

                            <Link
                                to="/credentials"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-[11px] font-bold text-[#5b57e7] transition hover:text-[#433fd0] sm:mt-5 sm:text-xs"
                            >
                                Ver credenciales
                                <ArrowUpRight size={14} />
                            </Link>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="flex items-center justify-center gap-3 pb-2">

                    <div className="h-px w-6 bg-[#d7dee9] sm:w-8" />

                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#a3afc0] sm:text-[10px] sm:tracking-[0.18em]">
                        Workly Workspace
                    </p>

                    <div className="h-px w-6 bg-[#d7dee9] sm:w-8" />

                </div>

            </div>

        </div>
    );
};

export default DashboardPage;