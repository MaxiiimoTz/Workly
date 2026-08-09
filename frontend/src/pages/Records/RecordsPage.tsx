import { useEffect, useState } from "react";
import {
    Pencil,
    Plus,
    Trash2,
    Star,
    Search,
    FileText,
    X,
    Eye,
    AlertTriangle,
    CircleCheck,
    CircleDot,
    Clock3,
    RotateCcw,
    Archive,
} from "lucide-react";

import { recordsService } from "./services/records.service";
import type { Record } from "./types/record";

import Toast from "../../components/Toast";
import type { ToastType } from "../../components/Toast";

type RecordStatus =
    | "Pendiente"
    | "En progreso"
    | "Completado"
    | "Por revisar"
    | "Archivado";

type RecordWithStatus = Record & {
    status?: RecordStatus;
};

const STATUS_OPTIONS: RecordStatus[] = [
    "Pendiente",
    "En progreso",
    "Completado",
    "Por revisar",
    "Archivado",
];

const RecordsPage = () => {
    const [records, setRecords] = useState<RecordWithStatus[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Nota");
    const [status, setStatus] =
        useState<RecordStatus>("Pendiente");

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [showForm, setShowForm] = useState(false);

    const [selectedRecord, setSelectedRecord] =
        useState<RecordWithStatus | null>(null);

    const [recordToDelete, setRecordToDelete] =
        useState<RecordWithStatus | null>(null);

    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
    } | null>(null);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("Todos");
    const [filterFavorite, setFilterFavorite] =
        useState("Todos");
    const [filterStatus, setFilterStatus] =
        useState("Todos");

    // =========================================================
    // TOAST
    // =========================================================

    const showToast = (
        message: string,
        type: ToastType = "success"
    ) => {
        setToast({
            message,
            type,
        });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // =========================================================
    // CARGAR REGISTROS
    // =========================================================

    const loadRecords = async () => {
        const data = await recordsService.getAll();

        setRecords(
            data.map((record) => ({
                ...record,
                status:
                    (record as RecordWithStatus).status ??
                    "Pendiente",
            }))
        );
    };

    useEffect(() => {
        loadRecords().finally(() => setLoading(false));
    }, []);

    // =========================================================
    // CREAR
    // =========================================================

    const openCreate = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setType("Nota");
        setStatus("Pendiente");
        setShowForm(true);
    };

    // =========================================================
    // EDITAR
    // =========================================================

    const openEdit = (record: RecordWithStatus) => {
        setEditingId(record.id);
        setTitle(record.title);
        setDescription(record.description);
        setType(record.type);
        setStatus(record.status ?? "Pendiente");
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setTitle("");
        setDescription("");
        setType("Nota");
        setStatus("Pendiente");
    };

    // =========================================================
    // VER
    // =========================================================

    const openView = (record: RecordWithStatus) => {
        setSelectedRecord(record);
    };

    const closeView = () => {
        setSelectedRecord(null);
    };

    // =========================================================
    // FECHAS
    // =========================================================

    const formatDateTime = (date?: string | Date) => {
        if (!date) {
            return "Sin fecha";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Sin fecha";
        }

        return parsedDate.toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRelativeTime = (date?: string | Date) => {
        if (!date) {
            return "Sin fecha";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Sin fecha";
        }

        const difference = Date.now() - parsedDate.getTime();

        if (difference < 0) {
            return "Actualizado recientemente";
        }

        const seconds = Math.floor(difference / 1000);

        if (seconds < 60) {
            return "Actualizado hace unos segundos";
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `Actualizado hace ${minutes} ${
                minutes === 1 ? "minuto" : "minutos"
            }`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `Actualizado hace ${hours} ${
                hours === 1 ? "hora" : "horas"
            }`;
        }

        const days = Math.floor(hours / 24);

        if (days < 30) {
            return `Actualizado hace ${days} ${
                days === 1 ? "día" : "días"
            }`;
        }

        const months = Math.floor(days / 30);

        if (months < 12) {
            return `Actualizado hace ${months} ${
                months === 1 ? "mes" : "meses"
            }`;
        }

        const years = Math.floor(months / 12);

        return `Actualizado hace ${years} ${
            years === 1 ? "año" : "años"
        }`;
    };

    // =========================================================
    // GUARDAR
    // =========================================================

    const saveRecord = async () => {
        if (!title.trim()) return;

        try {
            if (editingId) {
                const record = records.find(
                    (r) => r.id === editingId
                );

                if (record) {
                    await recordsService.update(editingId, {
                        ...record,
                        title: title.trim(),
                        description: description.trim(),
                        type,
                        status,
                    } as any);
                }

                closeForm();

                await loadRecords();

                showToast(
                    "Registro actualizado correctamente."
                );
            } else {
                await recordsService.create({
                    title: title.trim(),
                    description: description.trim(),
                    type,
                    favorite: false,
                    status,
                } as any);

                closeForm();

                await loadRecords();

                showToast(
                    "Registro guardado correctamente."
                );
            }
        } catch (error) {
            console.error(
                "Error guardando registro:",
                error
            );

            showToast(
                "No se pudo guardar el registro.",
                "error"
            );
        }
    };

    // =========================================================
    // ABRIR CONFIRMACIÓN ELIMINAR
    // =========================================================

    const askDeleteRecord = (
        record: RecordWithStatus
    ) => {
        setRecordToDelete(record);
    };

    const cancelDelete = () => {
        setRecordToDelete(null);
    };

    // =========================================================
    // ELIMINAR
    // =========================================================

    const deleteRecord = async () => {
        if (!recordToDelete) return;

        try {
            await recordsService.delete(
                recordToDelete.id
            );

            await loadRecords();

            if (
                selectedRecord?.id ===
                recordToDelete.id
            ) {
                closeView();
            }

            setRecordToDelete(null);

            showToast(
                "Registro eliminado correctamente."
            );
        } catch (error) {
            console.error(
                "Error eliminando registro:",
                error
            );

            showToast(
                "No se pudo eliminar el registro.",
                "error"
            );
        }
    };

    // =========================================================
    // FAVORITO
    // =========================================================

    const toggleFavorite = async (id: string) => {
        try {
            const currentRecord = records.find(
                (record) => record.id === id
            );

            await recordsService.toggleFavorite(id);

            await loadRecords();

            if (selectedRecord?.id === id) {
                const updated =
                    await recordsService.getAll();

                const record = updated.find(
                    (r) => r.id === id
                );

                if (record) {
                    setSelectedRecord({
                        ...record,
                        status:
                            (record as RecordWithStatus)
                                .status ??
                            selectedRecord.status ??
                            "Pendiente",
                    });
                }
            }

            showToast(
                currentRecord?.favorite
                    ? "Registro quitado de favoritos."
                    : "Registro agregado a favoritos."
            );
        } catch (error) {
            console.error(
                "Error actualizando favorito:",
                error
            );

            showToast(
                "No se pudo actualizar el favorito.",
                "error"
            );
        }
    };

    // =========================================================
    // FILTROS
    // =========================================================

    const clearFilters = () => {
        setSearch("");
        setFilterType("Todos");
        setFilterFavorite("Todos");
        setFilterStatus("Todos");
    };

    const filteredRecords = records.filter((record) => {
        const text =
            `${record.title} ${record.description} ${record.type} ${
                record.status ?? ""
            }`.toLowerCase();

        const matchesSearch = text.includes(
            search.toLowerCase()
        );

        const matchesType =
            filterType === "Todos" ||
            record.type === filterType;

        const matchesFavorite =
            filterFavorite === "Todos" ||
            (filterFavorite === "Favoritos" &&
                record.favorite);

        const matchesStatus =
            filterStatus === "Todos" ||
            record.status === filterStatus;

        return (
            matchesSearch &&
            matchesType &&
            matchesFavorite &&
            matchesStatus
        );
    });

    const countByType = (typeName: string) => {
        return records.filter(
            (record) => record.type === typeName
        ).length;
    };

    const countByStatus = (
        statusName: RecordStatus
    ) => {
        return records.filter(
            (record) =>
                (record.status ?? "Pendiente") ===
                statusName
        ).length;
    };

    // =========================================================
    // ESTILOS TIPO
    // =========================================================

    const getTypeStyles = (recordType: string) => {
        switch (recordType) {
            case "Credencial":
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-100",
                    text: "text-blue-700",
                    iconBg: "bg-blue-100",
                    icon: "text-blue-600",
                    dot: "bg-blue-500",
                };

            case "Pendiente":
                return {
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                    text: "text-amber-700",
                    iconBg: "bg-amber-100",
                    icon: "text-amber-600",
                    dot: "bg-amber-500",
                };

            case "Idea":
                return {
                    bg: "bg-violet-50",
                    border: "border-violet-100",
                    text: "text-violet-700",
                    iconBg: "bg-violet-100",
                    icon: "text-violet-600",
                    dot: "bg-violet-500",
                };

            case "Link":
                return {
                    bg: "bg-emerald-50",
                    border: "border-emerald-100",
                    text: "text-emerald-700",
                    iconBg: "bg-emerald-100",
                    icon: "text-emerald-600",
                    dot: "bg-emerald-500",
                };

            case "Observación":
                return {
                    bg: "bg-sky-50",
                    border: "border-sky-100",
                    text: "text-sky-700",
                    iconBg: "bg-sky-100",
                    icon: "text-sky-600",
                    dot: "bg-sky-500",
                };

            default:
                return {
                    bg: "bg-indigo-50",
                    border: "border-indigo-100",
                    text: "text-indigo-700",
                    iconBg: "bg-indigo-100",
                    icon: "text-indigo-600",
                    dot: "bg-indigo-500",
                };
        }
    };

    // =========================================================
    // ESTILOS ESTADO
    // =========================================================

    const getStatusStyles = (
        recordStatus?: RecordStatus
    ) => {
        switch (recordStatus ?? "Pendiente") {
            case "Completado":
                return {
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                    text: "text-emerald-700",
                    icon: "text-emerald-600",
                    dot: "bg-emerald-500",
                };

            case "En progreso":
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    text: "text-blue-700",
                    icon: "text-blue-600",
                    dot: "bg-blue-500",
                };

            case "Por revisar":
                return {
                    bg: "bg-violet-50",
                    border: "border-violet-200",
                    text: "text-violet-700",
                    icon: "text-violet-600",
                    dot: "bg-violet-500",
                };

            case "Archivado":
                return {
                    bg: "bg-slate-100",
                    border: "border-slate-200",
                    text: "text-slate-600",
                    icon: "text-slate-500",
                    dot: "bg-slate-400",
                };

            default:
                return {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-700",
                    icon: "text-amber-600",
                    dot: "bg-amber-500",
                };
        }
    };

    const getStatusIcon = (
        recordStatus?: RecordStatus,
        size = 14
    ) => {
        switch (recordStatus ?? "Pendiente") {
            case "Completado":
                return (
                    <CircleCheck size={size} />
                );

            case "En progreso":
                return (
                    <Clock3 size={size} />
                );

            case "Por revisar":
                return (
                    <RotateCcw size={size} />
                );

            case "Archivado":
                return (
                    <Archive size={size} />
                );

            default:
                return (
                    <CircleDot size={size} />
                );
        }
    };

    const getTypeFilterStyles = (
        typeName: string,
        active: boolean
    ) => {
        if (!active) {
            return "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700";
        }

        switch (typeName) {
            case "Credencial":
                return "border-blue-200 bg-blue-50 text-blue-700";

            case "Pendiente":
                return "border-amber-200 bg-amber-50 text-amber-700";

            case "Idea":
                return "border-violet-200 bg-violet-50 text-violet-700";

            case "Link":
                return "border-emerald-200 bg-emerald-50 text-emerald-700";

            case "Observación":
                return "border-sky-200 bg-sky-50 text-sky-700";

            case "Nota":
                return "border-indigo-200 bg-indigo-50 text-indigo-700";

            default:
                return "border-indigo-200 bg-indigo-50 text-indigo-700";
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">

                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Cargando registros...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-full space-y-7">

            {/* =====================================================
                DECORACIÓN
            ====================================================== */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

            <div className="pointer-events-none absolute left-1/3 top-[28rem] h-72 w-72 rounded-full bg-violet-100/25 blur-3xl" />


            {/* =====================================================
                ENCABEZADO
            ====================================================== */}

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <div className="mb-2 flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-indigo-500" />

                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Workspace
                        </p>

                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Registros
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Guarda y organiza tus notas e información.
                    </p>

                </div>


                <button
                    onClick={openCreate}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl"
                >
                    <Plus
                        size={18}
                        className="transition-transform duration-200 group-hover:rotate-90"
                    />

                    Nuevo registro
                </button>

            </div>


            {/* =====================================================
                FILTROS
            ====================================================== */}

            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Buscar registros..."
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />

                    </div>


                    <select
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(e.target.value)
                        }
                        className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    >
                        <option>Todos</option>
                        <option>Nota</option>
                        <option>Observación</option>
                        <option>Credencial</option>
                        <option>Idea</option>
                        <option>Pendiente</option>
                        <option>Link</option>
                    </select>


                    <select
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(e.target.value)
                        }
                        className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    >
                        <option>Todos</option>

                        {STATUS_OPTIONS.map(
                            (statusOption) => (
                                <option
                                    key={statusOption}
                                >
                                    {statusOption}
                                </option>
                            )
                        )}
                    </select>


                    <select
                        value={filterFavorite}
                        onChange={(e) =>
                            setFilterFavorite(
                                e.target.value
                            )
                        }
                        className="h-12 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    >
                        <option>Todos</option>
                        <option>Favoritos</option>
                    </select>

                </div>

            </div>


            {/* =====================================================
                FILTROS POR ESTADO
            ====================================================== */}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

                <div className="mb-3 flex items-center justify-between">

                    <div>

                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            Estado
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Organiza lo que tienes pendiente.
                        </p>

                    </div>

                </div>

                <div className="flex flex-wrap gap-2">

                    <button
                        onClick={() =>
                            setFilterStatus("Todos")
                        }
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                            filterStatus === "Todos"
                                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                        Todos

                        <span className="ml-1.5 opacity-60">
                            {records.length}
                        </span>
                    </button>


                    {STATUS_OPTIONS.map(
                        (statusOption) => {

                            const styles =
                                getStatusStyles(
                                    statusOption
                                );

                            const count =
                                countByStatus(
                                    statusOption
                                );

                            const active =
                                filterStatus ===
                                statusOption;

                            return (
                                <button
                                    key={statusOption}
                                    onClick={() =>
                                        setFilterStatus(
                                            statusOption
                                        )
                                    }
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                                        active
                                            ? `${styles.bg} ${styles.border} ${styles.text}`
                                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >

                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                                    />

                                    {statusOption}

                                    <span className="opacity-60">
                                        {count}
                                    </span>

                                </button>
                            );
                        }
                    )}

                </div>

            </div>


            {/* =====================================================
                TIPOS
            ====================================================== */}

            <div className="flex flex-wrap items-center gap-2">

                <button
                    onClick={() =>
                        setFilterType("Todos")
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${getTypeFilterStyles(
                        "Todos",
                        filterType === "Todos"
                    )}`}
                >
                    Todos

                    <span className="ml-1.5 opacity-60">
                        {records.length}
                    </span>
                </button>


                {[
                    "Nota",
                    "Observación",
                    "Idea",
                    "Credencial",
                    "Pendiente",
                    "Link",
                ].map((typeName) => {

                    const count =
                        countByType(typeName);

                    if (count === 0) return null;

                    return (
                        <button
                            key={typeName}
                            onClick={() =>
                                setFilterType(typeName)
                            }
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${getTypeFilterStyles(
                                typeName,
                                filterType === typeName
                            )}`}
                        >
                            {typeName}

                            <span className="ml-1.5 opacity-60">
                                {count}
                            </span>
                        </button>
                    );
                })}

            </div>


            {/* =====================================================
                CABECERA LISTA
            ====================================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                        Tus registros
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {filteredRecords.length}{" "}
                        {filteredRecords.length === 1
                            ? "registro encontrado"
                            : "registros encontrados"}
                    </p>

                </div>


                {(search ||
                    filterType !== "Todos" ||
                    filterFavorite !== "Todos" ||
                    filterStatus !== "Todos") && (

                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        <X size={14} />

                        Limpiar filtros
                    </button>

                )}

            </div>


            {/* =====================================================
                LISTA VACÍA
            ====================================================== */}

            {filteredRecords.length === 0 ? (

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-100/50 blur-3xl" />

                    <div className="relative">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">

                            <FileText
                                size={28}
                                className="text-indigo-500"
                            />

                        </div>

                        <h3 className="mt-5 text-base font-bold text-slate-800">
                            No se encontraron registros
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            {search ||
                            filterType !== "Todos" ||
                            filterFavorite !== "Todos" ||
                            filterStatus !== "Todos"
                                ? "Prueba cambiando los filtros de búsqueda."
                                : "Crea tu primer registro para comenzar."}
                        </p>


                        {!search &&
                            filterType === "Todos" &&
                            filterFavorite === "Todos" &&
                            filterStatus === "Todos" && (

                            <button
                                onClick={openCreate}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
                            >
                                <Plus size={17} />

                                Nuevo registro
                            </button>

                        )}

                    </div>

                </div>

            ) : (

                /* =====================================================
                   LISTA
                ====================================================== */

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">

                        <div className="grid grid-cols-[minmax(0,1fr)_150px_170px_210px] items-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">

                            <span>
                                Registro
                            </span>

                            <span>
                                Tipo
                            </span>

                            <span>
                                Estado
                            </span>

                            <span className="text-right">
                                Acciones
                            </span>

                        </div>

                    </div>


                    <div className="divide-y divide-slate-100">

                        {filteredRecords.map(
                            (record) => {

                                const typeStyles =
                                    getTypeStyles(
                                        record.type
                                    );

                                const statusStyles =
                                    getStatusStyles(
                                        record.status
                                    );

                                return (

                                    <div
                                        key={record.id}
                                        className="group relative grid grid-cols-[minmax(0,1fr)_150px_170px_210px] items-center gap-4 px-6 py-5 transition-all hover:bg-slate-50/70"
                                    >

                                        <div
                                            className={`absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full opacity-0 transition-opacity group-hover:opacity-100 ${typeStyles.dot}`}
                                        />


                                        {/* REGISTRO */}

                                        <div className="flex min-w-0 items-center gap-4">

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeStyles.iconBg} ring-1 ring-black/[0.03] transition-transform duration-200 group-hover:scale-105`}
                                            >

                                                <FileText
                                                    size={19}
                                                    className={
                                                        typeStyles.icon
                                                    }
                                                />

                                            </div>


                                            <div className="min-w-0">

                                                <h3 className="truncate text-sm font-bold text-slate-800">
                                                    {record.title}
                                                </h3>

                                                <p className="mt-1 truncate text-sm text-slate-400">
                                                    {record.description ||
                                                        "Sin descripción"}
                                                </p>

                                                {/* FECHA DE ACTUALIZACIÓN */}

                                                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">

                                                    <Clock3
                                                        size={12}
                                                    />

                                                    <span>
                                                        {getRelativeTime(
                                                            record.updatedAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* TIPO */}

                                        <div>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${typeStyles.bg} ${typeStyles.border} ${typeStyles.text}`}
                                            >

                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${typeStyles.dot}`}
                                                />

                                                {record.type}

                                            </span>

                                        </div>


                                        {/* ESTADO */}

                                        <div>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${statusStyles.bg} ${statusStyles.border} ${statusStyles.text}`}
                                            >

                                                {getStatusIcon(
                                                    record.status,
                                                    13
                                                )}

                                                {record.status ??
                                                    "Pendiente"}

                                            </span>

                                        </div>


                                        {/* ACCIONES */}

                                        <div className="flex justify-end gap-2">

                                            <button
                                                onClick={() =>
                                                    toggleFavorite(
                                                        record.id
                                                    )
                                                }
                                                title={
                                                    record.favorite
                                                        ? "Quitar de favoritos"
                                                        : "Agregar a favoritos"
                                                }
                                                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                                                    record.favorite
                                                        ? "border-amber-200 bg-amber-50"
                                                        : "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50"
                                                }`}
                                            >

                                                <Star
                                                    size={16}
                                                    className={
                                                        record.favorite
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-slate-400"
                                                    }
                                                />

                                            </button>


                                            <button
                                                onClick={() =>
                                                    openView(
                                                        record
                                                    )
                                                }
                                                title="Ver registro"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Eye
                                                    size={16}
                                                />
                                            </button>


                                            <button
                                                onClick={() =>
                                                    openEdit(
                                                        record
                                                    )
                                                }
                                                title="Editar"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <Pencil
                                                    size={16}
                                                />
                                            </button>


                                            <button
                                                onClick={() =>
                                                    askDeleteRecord(
                                                        record
                                                    )
                                                }
                                                title="Eliminar"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2
                                                    size={16}
                                                />
                                            </button>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL CREAR / EDITAR
            ====================================================== */}

            {showForm && (

                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeForm();
                        }
                    }}
                >

                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500" />


                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <div className="mb-1 flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-indigo-500" />

                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                                        {editingId
                                            ? "Editar"
                                            : "Nuevo"}
                                    </p>

                                </div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingId
                                        ? "Editar registro"
                                        : "Nuevo registro"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Completa la información del registro.
                                </p>

                            </div>


                            <button
                                onClick={closeForm}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <div className="space-y-5 p-6">

                            {/* TÍTULO */}

                            <div>

                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Título
                                </label>

                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ej. Reunión con el equipo"
                                    autoFocus
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                            </div>


                            {/* DESCRIPCIÓN */}

                            <div>

                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Descripción
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Escribe los detalles del registro..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                            </div>


                            {/* TIPO + ESTADO */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Tipo de registro
                                    </label>

                                    <select
                                        value={type}
                                        onChange={(e) =>
                                            setType(
                                                e.target.value
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    >
                                        <option>
                                            Nota
                                        </option>

                                        <option>
                                            Observación
                                        </option>

                                        <option>
                                            Credencial
                                        </option>

                                        <option>
                                            Idea
                                        </option>

                                        <option>
                                            Pendiente
                                        </option>

                                        <option>
                                            Link
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Estado
                                    </label>

                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target
                                                    .value as RecordStatus
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    >
                                        {STATUS_OPTIONS.map(
                                            (
                                                statusOption
                                            ) => (
                                                <option
                                                    key={
                                                        statusOption
                                                    }
                                                >
                                                    {
                                                        statusOption
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>

                            </div>

                        </div>


                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">

                            <button
                                onClick={closeForm}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={saveRecord}
                                disabled={!title.trim()}
                                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {editingId
                                    ? "Guardar cambios"
                                    : "Guardar registro"}
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL VER
            ====================================================== */}

            {selectedRecord && (

                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeView();
                        }
                    }}
                >

                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                            <div className="flex min-w-0 items-center gap-4">

                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                        getTypeStyles(
                                            selectedRecord.type
                                        ).iconBg
                                    }`}
                                >
                                    <FileText
                                        size={21}
                                        className={
                                            getTypeStyles(
                                                selectedRecord.type
                                            ).icon
                                        }
                                    />
                                </div>


                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="truncate text-xl font-bold text-slate-900">
                                            {
                                                selectedRecord.title
                                            }
                                        </h2>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                                getTypeStyles(
                                                    selectedRecord.type
                                                ).bg
                                            } ${
                                                getTypeStyles(
                                                    selectedRecord.type
                                                ).border
                                            } ${
                                                getTypeStyles(
                                                    selectedRecord.type
                                                ).text
                                            }`}
                                        >

                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    getTypeStyles(
                                                        selectedRecord.type
                                                    ).dot
                                                }`}
                                            />

                                            {
                                                selectedRecord.type
                                            }

                                        </span>

                                    </div>


                                    <div className="mt-2 flex flex-wrap gap-2">

                                        {(() => {
                                            const styles =
                                                getStatusStyles(
                                                    selectedRecord.status
                                                );

                                            return (
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles.bg} ${styles.border} ${styles.text}`}
                                                >
                                                    {getStatusIcon(
                                                        selectedRecord.status,
                                                        12
                                                    )}

                                                    {selectedRecord.status ??
                                                        "Pendiente"}
                                                </span>
                                            );
                                        })()}

                                    </div>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Detalle del registro
                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={closeView}
                                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <div className="space-y-5 p-6">

                            {/* DESCRIPCIÓN */}

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                    Descripción
                                </p>

                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                    {
                                        selectedRecord.description ||
                                        "Sin descripción"
                                    }
                                </p>

                            </div>


                            {/* INFORMACIÓN BÁSICA */}

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                                <div className="rounded-xl border border-slate-200 bg-white p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        Tipo
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedRecord.type
                                        }
                                    </p>

                                </div>


                                <div className="rounded-xl border border-slate-200 bg-white p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        Estado
                                    </p>

                                    <div className="mt-2">

                                        {(() => {
                                            const styles =
                                                getStatusStyles(
                                                    selectedRecord.status
                                                );

                                            return (
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles.bg} ${styles.border} ${styles.text}`}
                                                >
                                                    {getStatusIcon(
                                                        selectedRecord.status,
                                                        12
                                                    )}

                                                    {selectedRecord.status ??
                                                        "Pendiente"}
                                                </span>
                                            );
                                        })()}

                                    </div>

                                </div>


                                <div className="rounded-xl border border-slate-200 bg-white p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        Favorito
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {selectedRecord.favorite
                                            ? "Sí"
                                            : "No"}
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                FECHAS
                            ================================================== */}

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                {/* CREADO */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <Clock3 size={15} />
                                        </div>

                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Creado
                                        </p>

                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-800">
                                        {formatDateTime(
                                            selectedRecord.createdAt
                                        )}
                                    </p>

                                </div>


                                {/* ACTUALIZADO */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                            <RotateCcw size={15} />
                                        </div>

                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Última actualización
                                        </p>

                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-800">
                                        {formatDateTime(
                                            selectedRecord.updatedAt
                                        )}
                                    </p>

                                </div>

                            </div>


                            {/* ACTIVIDAD */}

                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">

                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                    <p className="text-xs font-semibold text-indigo-700">
                                        Actividad del registro
                                    </p>

                                    <p className="text-xs text-indigo-600">
                                        {getRelativeTime(
                                            selectedRecord.updatedAt
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <button
                                onClick={() =>
                                    toggleFavorite(
                                        selectedRecord.id
                                    )
                                }
                                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                                    selectedRecord.favorite
                                        ? "border-amber-200 bg-amber-50 text-amber-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                }`}
                            >

                                <Star
                                    size={16}
                                    className={
                                        selectedRecord.favorite
                                            ? "fill-amber-400 text-amber-400"
                                            : ""
                                    }
                                />

                                {selectedRecord.favorite
                                    ? "Quitar favorito"
                                    : "Agregar favorito"}

                            </button>


                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() =>
                                        askDeleteRecord(
                                            selectedRecord
                                        )
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                                >
                                    <Trash2 size={16} />

                                    Eliminar
                                </button>


                                <button
                                    onClick={closeView}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Cerrar
                                </button>


                                <button
                                    onClick={() => {
                                        closeView();

                                        openEdit(
                                            selectedRecord
                                        );
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700"
                                >
                                    <Pencil size={16} />

                                    Editar
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL CONFIRMAR ELIMINACIÓN
            ====================================================== */}

            {recordToDelete && (

                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            cancelDelete();
                        }
                    }}
                >

                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />


                        <div className="p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100">

                                    <AlertTriangle
                                        size={22}
                                        className="text-red-500"
                                    />

                                </div>


                                <div className="min-w-0">

                                    <h2 className="text-lg font-bold text-slate-900">
                                        ¿Eliminar registro?
                                    </h2>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Estás a punto de eliminar este registro.
                                        Esta acción no se puede deshacer.
                                    </p>

                                </div>

                            </div>


                            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                <p className="truncate text-sm font-bold text-slate-800">
                                    {recordToDelete.title}
                                </p>

                                <p className="mt-1 truncate text-xs text-slate-500">
                                    {recordToDelete.description ||
                                        "Sin descripción"}
                                </p>

                            </div>

                        </div>


                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">

                            <button
                                onClick={cancelDelete}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={deleteRecord}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 hover:shadow-lg"
                            >
                                <Trash2 size={16} />

                                Eliminar registro
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                TOAST
            ====================================================== */}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

        </div>
    );
};

export default RecordsPage;