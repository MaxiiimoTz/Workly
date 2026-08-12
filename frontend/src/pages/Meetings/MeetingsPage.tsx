import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock3,
    Pencil,
    Plus,
    Trash2,
    X,
    CheckCircle2,
    CircleDot,
} from "lucide-react";

import {
    meetingsService,
    type Meeting,
} from "./services/meetings.service";

const MeetingsPage = () => {

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] =
        useState<Meeting["status"]>("Pendiente");

    const loadMeetings = async () => {
        try {
            const data =
                await meetingsService.getAll();

            setMeetings(data);
        } catch (error) {
            console.error(
                "Error cargando reuniones:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMeetings();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setTitle("");
        setNotes("");
        setDate("");
        setStatus("Pendiente");

        setShowForm(true);
    };

    const openEdit = (meeting: Meeting) => {
        setEditingId(meeting.id);

        setTitle(meeting.title);
        setNotes(meeting.notes);

        const localDate =
            new Date(meeting.date);

        const formatted =
            `${localDate.getFullYear()}-${String(
                localDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
                localDate.getDate()
            ).padStart(2, "0")}T${String(
                localDate.getHours()
            ).padStart(2, "0")}:${String(
                localDate.getMinutes()
            ).padStart(2, "0")}`;

        setDate(formatted);
        setStatus(meeting.status);

        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
    };

    const saveMeeting = async () => {

        if (!title.trim() || !date) {
            return;
        }

        try {

            if (editingId) {

                const existing =
                    meetings.find(
                        m => m.id === editingId
                    );

                if (!existing) return;

                await meetingsService.update(
                    editingId,
                    {
                        ...existing,
                        title: title.trim(),
                        notes: notes.trim(),
                        date,
                        status,
                    }
                );

            } else {

                await meetingsService.create({
                    title: title.trim(),
                    notes: notes.trim(),
                    date,
                    status,
                });
            }

            closeForm();

            await loadMeetings();

        } catch (error) {

            console.error(
                "Error guardando reunión:",
                error
            );
        }
    };

    const deleteMeeting = async (
        id: string
    ) => {

        const confirmed =
            window.confirm(
                "¿Deseas eliminar esta reunión?"
            );

        if (!confirmed) return;

        try {

            await meetingsService.delete(id);

            await loadMeetings();

        } catch (error) {

            console.error(
                "Error eliminando reunión:",
                error
            );
        }
    };

    const pendingMeetings =
        meetings.filter(
            m => m.status === "Pendiente"
        );

    const completedMeetings =
        meetings.filter(
            m => m.status === "Realizada"
        );

    const cancelledMeetings =
        meetings.filter(
            m => m.status === "Cancelada"
        );

    const formatDate = (value: string) => {

        return new Date(value).toLocaleDateString(
            "es-PE",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    const formatTime = (value: string) => {

        return new Date(value).toLocaleTimeString(
            "es-PE",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Cargando reuniones...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="relative min-h-full space-y-7">

            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl" />

            {/* HEADER */}

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <div className="mb-2 flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-orange-500" />

                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Organización
                        </p>

                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Reuniones
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Organiza tus reuniones y guarda tus apuntes.
                    </p>

                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 transition hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    Nueva reunión
                </button>

            </div>

            {/* RESUMEN */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                            <Clock3
                                size={20}
                                className="text-orange-500"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Pendientes
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {pendingMeetings.length}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                            <CheckCircle2
                                size={20}
                                className="text-emerald-500"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Realizadas
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {completedMeetings.length}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                            <CalendarDays
                                size={20}
                                className="text-slate-500"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Total
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {meetings.length}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* PENDIENTES */}

            <MeetingSection
                title="Reuniones pendientes"
                description="Reuniones que todavía tienes por atender."
                meetings={pendingMeetings}
                emptyText="No tienes reuniones pendientes."
                onEdit={openEdit}
                onDelete={deleteMeeting}
                formatDate={formatDate}
                formatTime={formatTime}
            />

            {/* REALIZADAS */}

            <MeetingSection
                title="Reuniones realizadas"
                description="Historial de reuniones que ya terminaste."
                meetings={completedMeetings}
                emptyText="Todavía no tienes reuniones realizadas."
                onEdit={openEdit}
                onDelete={deleteMeeting}
                formatDate={formatDate}
                formatTime={formatTime}
            />

            {/* CANCELADAS */}

            {cancelledMeetings.length > 0 && (
                <MeetingSection
                    title="Canceladas"
                    description="Reuniones canceladas."
                    meetings={cancelledMeetings}
                    emptyText=""
                    onEdit={openEdit}
                    onDelete={deleteMeeting}
                    formatDate={formatDate}
                    formatTime={formatTime}
                />
            )}

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
                        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="h-1 bg-gradient-to-r from-orange-500 via-indigo-600 to-violet-600" />

                        {/* HEADER */}

                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500">
                                    {editingId
                                        ? "Editar reunión"
                                        : "Nueva reunión"}
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    {editingId
                                        ? "Editar reunión"
                                        : "Agregar reunión"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Guarda la información para no olvidar los detalles.
                                </p>

                            </div>

                            <button
                                onClick={closeForm}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* FORM */}

                        <div className="flex-1 overflow-y-auto p-6">

                            <div className="space-y-5">

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
                                        placeholder="Ej. Reunión con Joseph"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    />

                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Fecha y hora
                                        </label>

                                        <input
                                            type="datetime-local"
                                            value={date}
                                            onChange={(e) =>
                                                setDate(
                                                    e.target.value
                                                )
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Estado
                                        </label>

                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(
                                                    e.target.value as Meeting["status"]
                                                )
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                        >
                                            <option value="Pendiente">
                                                Pendiente
                                            </option>

                                            <option value="Realizada">
                                                Realizada
                                            </option>

                                            <option value="Cancelada">
                                                Cancelada
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Apuntes
                                    </label>

                                    <textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Escribe aquí los temas tratados, acuerdos, pendientes, personas involucradas, etc."
                                        rows={8}
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                            <button
                                onClick={closeForm}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={saveMeeting}
                                disabled={
                                    !title.trim() ||
                                    !date
                                }
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {editingId
                                    ? "Guardar cambios"
                                    : "Crear reunión"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

type MeetingSectionProps = {
    title: string;
    description: string;
    meetings: Meeting[];
    emptyText: string;
    onEdit: (meeting: Meeting) => void;
    onDelete: (id: string) => void;
    formatDate: (value: string) => string;
    formatTime: (value: string) => string;
};

const MeetingSection = ({
    title,
    description,
    meetings,
    emptyText,
    onEdit,
    onDelete,
    formatDate,
    formatTime,
}: MeetingSectionProps) => {

    return (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-xl font-bold text-slate-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>

            </div>

            {meetings.length === 0 ? (

                <div className="px-6 py-12 text-center">

                    <CircleDot
                        size={28}
                        className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        {emptyText}
                    </p>

                </div>

            ) : (

                <div className="divide-y divide-slate-100">

                    {meetings.map((meeting) => (

                        <div
                            key={meeting.id}
                            className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between"
                        >

                            <div className="min-w-0">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                                        <CalendarDays
                                            size={18}
                                            className="text-orange-500"
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="font-bold text-slate-800">
                                            {meeting.title}
                                        </h3>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">

                                            <span>
                                                {formatDate(
                                                    meeting.date
                                                )}
                                            </span>

                                            <span>
                                                •
                                            </span>

                                            <span>
                                                {formatTime(
                                                    meeting.date
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {meeting.notes && (

                                    <p className="mt-3 line-clamp-2 pl-[52px] text-sm text-slate-500">
                                        {meeting.notes}
                                    </p>

                                )}

                            </div>

                            <div className="flex shrink-0 gap-2">

                                <button
                                    onClick={() =>
                                        onEdit(meeting)
                                    }
                                    title="Editar"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() =>
                                        onDelete(
                                            meeting.id
                                        )
                                    }
                                    title="Eliminar"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>
    );
};

export default MeetingsPage;