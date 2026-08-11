import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    ChevronDown,
    ChevronRight,
    Clock3,
    CheckCircle2,
    Copy,
} from "lucide-react";
import axios from "axios";

interface Activity {
    id: string;
    title: string;
    percentage: number;
    hours: number;
    date: string;
    parentId: string | null;
    createdAt: string;
}

const api = axios.create({
    baseURL: "https://workly-ilqb.onrender.com/api",
});

const TOTAL_HOURS = 9.5;

const ActivitiesPage = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [percentage, setPercentage] =
        useState(100);
    const [hours, setHours] = useState(1);
    const [parentId, setParentId] =
        useState<string>("");

    const [expanded, setExpanded] =
        useState<Record<string, boolean>>({});

    const loadActivities = async () => {
        try {
            setLoading(true);

            const response =
                await api.get(
                    `/activities/date/${selectedDate}`
                );

            setActivities(response.data);
        } catch (error) {
            console.error(
                "Error cargando actividades:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();
    }, [selectedDate]);

    const parents = useMemo(
        () =>
            activities.filter(
                (activity) =>
                    !activity.parentId
            ),
        [activities]
    );

    const childrenOf = (
        parentId: string
    ) =>
        activities.filter(
            (activity) =>
                activity.parentId ===
                parentId
        );

    const openCreate = (
        parent?: Activity
    ) => {
        setEditingId(null);
        setTitle("");
        setPercentage(100);
        setHours(1);
        setParentId(
            parent?.id ?? ""
        );
        setShowForm(true);
    };

    const openEdit = (
        activity: Activity
    ) => {
        setEditingId(activity.id);
        setTitle(activity.title);
        setPercentage(
            activity.percentage
        );
        setHours(activity.hours);
        setParentId(
            activity.parentId ?? ""
        );
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setTitle("");
        setPercentage(100);
        setHours(1);
        setParentId("");
    };

    const saveActivity = async () => {
        if (!title.trim()) return;

        try {
            const data = {
                title: title.trim(),
                percentage,
                hours,
                date: `${selectedDate}T00:00:00`,
                parentId:
                    parentId || null,
            };

            if (editingId) {
                await api.put(
                    `/activities/${editingId}`,
                    {
                        id: editingId,
                        ...data,
                    }
                );
            } else {
                await api.post(
                    "/activities",
                    data
                );
            }

            closeForm();
            await loadActivities();
        } catch (error) {
            console.error(
                "Error guardando actividad:",
                error
            );
        }
    };

    const deleteActivity = async (
        id: string
    ) => {
        if (
            !confirm(
                "¿Eliminar esta actividad?"
            )
        ) {
            return;
        }

        try {
            await api.delete(
                `/activities/${id}`
            );

            await loadActivities();
        } catch (error) {
            console.error(
                "Error eliminando actividad:",
                error
            );
        }
    };

    const toggleExpanded = (
        id: string
    ) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const formatDate = () => {
        const date = new Date(
            `${selectedDate}T12:00:00`
        );

        return date.toLocaleDateString(
            "es-PE",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    const formatShortDate = () => {
        const date = new Date(
            `${selectedDate}T12:00:00`
        );

        return date.toLocaleDateString(
            "es-PE",
            {
                day: "2-digit",
                month: "2-digit",
            }
        );
    };

    const generateMessage = () => {
        let message =
            `Actividades del día ${formatShortDate()}\n\n`;

        message += `Total horas: ${TOTAL_HOURS}h\n\n`;

        parents.forEach(
            (activity) => {
                message += `- ${activity.title} | ${activity.percentage}% | ${activity.hours} hrs\n`;

                const children =
                    childrenOf(
                        activity.id
                    );

                children.forEach(
                    (child) => {
                        message += `  - ${child.title} | ${child.percentage}% | ${child.hours} hrs\n`;
                    }
                );
            }
        );

        return message.trim();
    };

    const copyMessage = async () => {
        try {
            await navigator.clipboard.writeText(
                generateMessage()
            );

            alert(
                "Mensaje copiado correctamente"
            );
        } catch (error) {
            console.error(
                "Error copiando mensaje:",
                error
            );
        }
    };

    const totalActivityHours =
        activities.reduce(
            (total, activity) =>
                total + Number(activity.hours),
            0
        );

    return (
        <div className="mx-auto max-w-[1400px] space-y-7">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                        Trabajo
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        Actividades del día
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {formatDate()}
                    </p>
                </div>

                <div className="flex gap-3">

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                            setSelectedDate(
                                e.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                    />

                    <button
                        onClick={() =>
                            openCreate()
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition hover:-translate-y-0.5"
                    >
                        <Plus size={17} />

                        Actividad
                    </button>
                </div>
            </div>

            {/* RESUMEN */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <Clock3
                                size={19}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400">
                                Total del día
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {TOTAL_HOURS}h
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                            <CheckCircle2
                                size={19}
                                className="text-emerald-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400">
                                Actividades
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {parents.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                            <Clock3
                                size={19}
                                className="text-violet-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400">
                                Horas registradas
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {totalActivityHours}h
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTIVIDADES */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Actividades
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Organiza tus actividades y sus tareas.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            openCreate()
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        <Plus size={14} />

                        Agregar
                    </button>
                </div>

                <div className="divide-y divide-slate-100">

                    {loading ? (
                        <div className="px-6 py-16 text-center text-sm text-slate-400">
                            Cargando actividades...
                        </div>
                    ) : parents.length ===
                      0 ? (
                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                                <Clock3
                                    size={25}
                                    className="text-indigo-500"
                                />
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-slate-800">
                                No hay actividades
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Agrega las actividades que realizaste hoy.
                            </p>

                            <button
                                onClick={() =>
                                    openCreate()
                                }
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
                            >
                                <Plus
                                    size={15}
                                />

                                Agregar actividad
                            </button>
                        </div>
                    ) : (
                        parents.map(
                            (activity) => {
                                const children =
                                    childrenOf(
                                        activity.id
                                    );

                                const isExpanded =
                                    expanded[
                                        activity.id
                                    ];

                                return (
                                    <div
                                        key={
                                            activity.id
                                        }
                                        className="p-5"
                                    >

                                        <div className="flex items-center gap-4">

                                            {children.length >
                                            0 ? (
                                                <button
                                                    onClick={() =>
                                                        toggleExpanded(
                                                            activity.id
                                                        )
                                                    }
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    ) : (
                                                        <ChevronRight
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="h-9 w-9 shrink-0" />
                                            )}

                                            <div className="min-w-0 flex-1">

                                                <h3 className="truncate text-sm font-bold text-slate-800">
                                                    {
                                                        activity.title
                                                    }
                                                </h3>

                                                <div className="mt-2 flex flex-wrap items-center gap-2">

                                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                                                        {
                                                            activity.percentage
                                                        }%
                                                    </span>

                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                                                        {
                                                            activity.hours
                                                        }{" "}
                                                        hrs
                                                    </span>

                                                    {children.length >
                                                        0 && (
                                                        <span className="text-[10px] text-slate-400">
                                                            {
                                                                children.length
                                                            }{" "}
                                                            subactividades
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        openCreate(
                                                            activity
                                                        )
                                                    }
                                                    title="Agregar subactividad"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    <Plus
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openEdit(
                                                            activity
                                                        )
                                                    }
                                                    title="Editar"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    <Pencil
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteActivity(
                                                            activity.id
                                                        )
                                                    }
                                                    title="Eliminar"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded &&
                                            children.length >
                                                0 && (
                                                <div className="ml-16 mt-4 space-y-2 border-l-2 border-slate-100 pl-4">

                                                    {children.map(
                                                        (
                                                            child
                                                        ) => (
                                                            <div
                                                                key={
                                                                    child.id
                                                                }
                                                                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                                                            >

                                                                <div className="h-2 w-2 rounded-full bg-indigo-400" />

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="truncate text-xs font-semibold text-slate-700">
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-indigo-600">
                                                                    {
                                                                        child.percentage
                                                                    }%
                                                                </span>

                                                                <span className="text-[10px] font-semibold text-slate-500">
                                                                    {
                                                                        child.hours
                                                                    }{" "}
                                                                    hrs
                                                                </span>

                                                                <button
                                                                    onClick={() =>
                                                                        openEdit(
                                                                            child
                                                                        )
                                                                    }
                                                                    className="text-slate-400 hover:text-indigo-600"
                                                                >
                                                                    <Pencil
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        deleteActivity(
                                                                            child.id
                                                                        )
                                                                    }
                                                                    className="text-slate-400 hover:text-red-500"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            </div>

            {/* MENSAJE */}

            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6">

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Mensaje del día
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Listo para copiar y enviar.
                        </p>
                    </div>

                    <button
                        onClick={
                            copyMessage
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700"
                    >
                        <Copy size={15} />

                        Copiar
                    </button>
                </div>

                <pre className="mt-5 whitespace-pre-wrap rounded-xl border border-white/80 bg-white/80 p-5 font-sans text-sm leading-7 text-slate-700">
                    {generateMessage()}
                </pre>
            </div>

            {/* MODAL */}

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
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="h-1 bg-gradient-to-r from-indigo-600 to-violet-600" />

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingId
                                        ? "Editar actividad"
                                        : parentId
                                          ? "Nueva subactividad"
                                          : "Nueva actividad"}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Completa los datos de la actividad.
                                </p>
                            </div>

                            <button
                                onClick={
                                    closeForm
                                }
                                className="text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-5 p-6">

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Actividad
                                </label>

                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Ej. Desarrollo de módulo"
                                    autoFocus
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Porcentaje
                                    </label>

                                    <div className="relative">

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={
                                                percentage
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setPercentage(
                                                    Number(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                )
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                            %
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Horas
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={
                                            hours
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setHours(
                                                Number(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>
                            </div>

                            {!parentId &&
                                !editingId && (
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Actividad principal
                                        </label>

                                        <select
                                            value={
                                                parentId
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setParentId(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                        >
                                            <option value="">
                                                Ninguna
                                            </option>

                                            {parents.map(
                                                (
                                                    activity
                                                ) => (
                                                    <option
                                                        key={
                                                            activity.id
                                                        }
                                                        value={
                                                            activity.id
                                                        }
                                                    >
                                                        {
                                                            activity.title
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                )}

                            {parentId && (
                                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                        Subactividad de
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-indigo-700">
                                        {parents.find(
                                            (
                                                activity
                                            ) =>
                                                activity.id ===
                                                parentId
                                        )?.title ??
                                            "Actividad"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">

                            <button
                                onClick={
                                    closeForm
                                }
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={
                                    saveActivity
                                }
                                disabled={
                                    !title.trim()
                                }
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {editingId
                                    ? "Guardar cambios"
                                    : "Guardar actividad"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesPage;