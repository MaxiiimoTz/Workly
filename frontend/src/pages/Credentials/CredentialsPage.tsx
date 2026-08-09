import { useEffect, useState } from "react";
import {
    Copy,
    Eye,
    EyeOff,
    ExternalLink,
    KeyRound,
    Pencil,
    Plus,
    Star,
    Trash2,
    X,
    AlertTriangle,
    Clock3,
    RotateCcw,
} from "lucide-react";
import axios from "axios";

interface Credential {
    id: string;
    name: string;
    category: string;
    system: string;
    environment: string;
    host: string;
    port: string;
    database: string;
    domain: string;
    username: string;
    password: string;
    url: string;
    notes: string;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
}

const api = axios.create({
    baseURL: "https://workly-ilqb.onrender.com/api",
});

const emptyForm = {
    name: "",
    category: "sql",
    system: "",
    environment: "prod",
    host: "",
    port: "",
    database: "",
    domain: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    favorite: false,
};

const CredentialsPage = () => {
    const [credentials, setCredentials] = useState<Credential[]>([]);

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    // Modal crear / editar
    const [showForm, setShowForm] = useState(false);

    // Modal ver
    const [selectedCredential, setSelectedCredential] =
        useState<Credential | null>(null);

    // Modal confirmar eliminación
    const [credentialToDelete, setCredentialToDelete] =
        useState<Credential | null>(null);

    // Contraseñas visibles
    const [showPasswords, setShowPasswords] = useState<
        Record<string, boolean>
    >({});

    // Contraseña visible dentro del modal
    const [showModalPassword, setShowModalPassword] =
        useState(false);

    // =========================================================
    // CARGAR CREDENCIALES
    // =========================================================

    const loadCredentials = async () => {
        try {
            const response = await api.get("/credentials");

            setCredentials(response.data);
        } catch (error) {
            console.error(
                "Error cargando credenciales:",
                error
            );
        }
    };

    useEffect(() => {
        loadCredentials();
    }, []);

    // =========================================================
    // CAMBIAR FORMULARIO
    // =========================================================

    const change = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    // =========================================================
    // CREAR
    // =========================================================

    const openCreate = () => {
        setEditingId(null);

        setForm({
            ...emptyForm,
        });

        setShowForm(true);
    };

    // =========================================================
    // EDITAR
    // =========================================================

    const openEdit = (
        credential: Credential
    ) => {
        setEditingId(credential.id);

        setForm({
            name: credential.name,
            category: credential.category,
            system: credential.system,
            environment: credential.environment,
            host: credential.host,
            port: credential.port,
            database: credential.database,
            domain: credential.domain,
            username: credential.username,
            password: credential.password,
            url: credential.url,
            notes: credential.notes,
            favorite: credential.favorite,
        });

        setShowForm(true);
    };

    // =========================================================
    // CERRAR FORMULARIO
    // =========================================================

    const closeForm = () => {
        setShowForm(false);

        setEditingId(null);

        setForm({
            ...emptyForm,
        });
    };

    // =========================================================
    // VER CREDENCIAL
    // =========================================================

    const openView = (
        credential: Credential
    ) => {
        setSelectedCredential(credential);

        setShowModalPassword(false);
    };

    const closeView = () => {
        setSelectedCredential(null);

        setShowModalPassword(false);
    };

    // =========================================================
    // FECHAS
    // =========================================================

    const formatDateTime = (
        date?: string | Date
    ) => {
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

    const getRelativeTime = (
        date?: string | Date
    ) => {
        if (!date) {
            return "Sin fecha";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Sin fecha";
        }

        const difference =
            Date.now() - parsedDate.getTime();

        if (difference < 0) {
            return "Actualizado recientemente";
        }

        const seconds = Math.floor(
            difference / 1000
        );

        if (seconds < 60) {
            return "Actualizado hace unos segundos";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        if (minutes < 60) {
            return `Actualizado hace ${minutes} ${
                minutes === 1
                    ? "minuto"
                    : "minutos"
            }`;
        }

        const hours = Math.floor(
            minutes / 60
        );

        if (hours < 24) {
            return `Actualizado hace ${hours} ${
                hours === 1
                    ? "hora"
                    : "horas"
            }`;
        }

        const days = Math.floor(
            hours / 24
        );

        if (days < 30) {
            return `Actualizado hace ${days} ${
                days === 1
                    ? "día"
                    : "días"
            }`;
        }

        const months = Math.floor(
            days / 30
        );

        if (months < 12) {
            return `Actualizado hace ${months} ${
                months === 1
                    ? "mes"
                    : "meses"
            }`;
        }

        const years = Math.floor(
            months / 12
        );

        return `Actualizado hace ${years} ${
            years === 1
                ? "año"
                : "años"
        }`;
    };

    // =========================================================
    // GUARDAR
    // =========================================================

    const save = async () => {
        if (!form.name.trim()) return;

        try {
            if (editingId) {
                await api.put(
                    `/credentials/${editingId}`,
                    form
                );
            } else {
                await api.post(
                    "/credentials",
                    form
                );
            }

            closeForm();

            await loadCredentials();
        } catch (error) {
            console.error(
                "Error guardando credencial:",
                error
            );
        }
    };

    // =========================================================
    // ABRIR CONFIRMACIÓN ELIMINACIÓN
    // =========================================================

    const askDelete = (
        credential: Credential
    ) => {
        setCredentialToDelete(
            credential
        );
    };

    const cancelDelete = () => {
        setCredentialToDelete(null);
    };

    // =========================================================
    // ELIMINAR
    // =========================================================

    const remove = async () => {
        if (!credentialToDelete) {
            return;
        }

        try {
            await api.delete(
                `/credentials/${credentialToDelete.id}`
            );

            await loadCredentials();

            if (
                selectedCredential?.id ===
                credentialToDelete.id
            ) {
                closeView();
            }

            setCredentialToDelete(null);
        } catch (error) {
            console.error(
                "Error eliminando credencial:",
                error
            );
        }
    };

    // =========================================================
    // FAVORITO
    // =========================================================

    const toggleFavorite = async (
        id: string
    ) => {
        try {
            await api.patch(
                `/credentials/${id}/favorite`
            );

            await loadCredentials();

            if (
                selectedCredential?.id === id
            ) {
                const response =
                    await api.get(
                        "/credentials"
                    );

                const updated =
                    response.data.find(
                        (
                            credential: Credential
                        ) =>
                            credential.id === id
                    );

                if (updated) {
                    setSelectedCredential(
                        updated
                    );
                }
            }
        } catch (error) {
            console.error(
                "Error actualizando favorito:",
                error
            );
        }
    };

    // =========================================================
    // COPIAR
    // =========================================================

    const copy = async (
        value: string
    ) => {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(
                value
            );
        } catch (error) {
            console.error(
                "No se pudo copiar:",
                error
            );
        }
    };

    // =========================================================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // =========================================================

    const togglePassword = (
        id: string
    ) => {
        setShowPasswords(
            (current) => ({
                ...current,
                [id]: !current[id],
            })
        );
    };

    // =========================================================
    // CATEGORÍAS
    // =========================================================

    const getCategoryLabel = (
        category: string
    ) => {
        const categories: Record<
            string,
            string
        > = {
            sql: "SQL Server",
            rdp: "PC Remoto",
            vpn: "VPN",
            tomcat: "Tomcat",
            ftp: "FTP",
            api: "API",
            web: "Web",
            otro: "Otro",
        };

        return (
            categories[category] ||
            category
        );
    };

    // =========================================================
    // AMBIENTES
    // =========================================================

    const getEnvironmentLabel = (
        environment: string
    ) => {
        const environments: Record<
            string,
            string
        > = {
            prod: "Producción",
            qa: "QA",
            test: "Test",
            dev: "Desarrollo",
            local: "Local",
        };

        return (
            environments[environment] ||
            environment
        );
    };

    // =========================================================
    // CONTADORES
    // =========================================================

    const favoriteCount =
        credentials.filter(
            (credential) =>
                credential.favorite
        ).length;

    const productionCount =
        credentials.filter(
            (credential) =>
                credential.environment ===
                "prod"
        ).length;

    const totalCount =
        credentials.length;

    const favoritePercentage =
        totalCount > 0
            ? Math.min(
                  (favoriteCount /
                      totalCount) *
                      100,
                  100
              )
            : 0;

    const productionPercentage =
        totalCount > 0
            ? Math.min(
                  (productionCount /
                      totalCount) *
                      100,
                  100
              )
            : 0;

    const totalPercentage =
        totalCount > 0
            ? Math.min(
                  totalCount * 20,
                  100
              )
            : 0;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-full rounded-[28px] bg-[#edf2f9] p-1 sm:p-2">

            <div className="space-y-5 sm:space-y-6 lg:space-y-7">

                {/* =================================================
                    ENCABEZADO
                ================================================== */}

                <div className="flex flex-col gap-4 px-1 pt-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <span className="h-1.5 w-1.5 rounded-full bg-[#5b5bea]" />

                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#71809d]">
                                Workspace
                            </p>

                        </div>

                        <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#14213d] sm:text-[34px] lg:text-[38px]">
                            Credenciales
                        </h1>

                        <p className="mt-1 text-xs text-[#60708e] sm:text-sm">
                            Administra tus accesos de forma segura y organizada.
                        </p>

                    </div>


                    <button
                        onClick={openCreate}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5547e8] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(85,71,232,0.22)] transition-all duration-200 hover:bg-[#493bd4] hover:shadow-[0_8px_20px_rgba(85,71,232,0.28)] active:scale-[0.98] sm:mt-1 sm:w-auto sm:px-5"
                    >
                        <Plus size={17} />

                        Nueva credencial
                    </button>

                </div>


                {/* =================================================
                    TARJETAS DE RESUMEN
                ================================================== */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-5">

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-[0_3px_12px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,50,84,0.08)]">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9eaff]">

                                <KeyRound
                                    size={20}
                                    strokeWidth={2}
                                    className="text-[#5754ed]"
                                />

                            </div>

                            <span className="text-xs font-medium text-[#8a98b2]">
                                Total
                            </span>

                        </div>

                        <p className="mt-5 text-[30px] font-bold tracking-tight text-[#15233e]">
                            {totalCount}
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-[#637492]">
                            Credenciales
                        </p>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#e9edf4]">

                            <div
                                className="h-full rounded-full bg-[#625ff1] transition-all duration-500"
                                style={{
                                    width: `${totalPercentage}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* FAVORITOS */}

                    <div className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-[0_3px_12px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,50,84,0.08)]">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff5d9]">

                                <Star
                                    size={20}
                                    strokeWidth={2}
                                    className="text-[#f3a900]"
                                />

                            </div>

                            <span className="text-xs font-medium text-[#8a98b2]">
                                Guardados
                            </span>

                        </div>

                        <p className="mt-5 text-[30px] font-bold tracking-tight text-[#15233e]">
                            {favoriteCount}
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-[#637492]">
                            Favoritos
                        </p>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#edf0f4]">

                            <div
                                className="h-full rounded-full bg-[#f4ae00] transition-all duration-500"
                                style={{
                                    width: `${favoritePercentage}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* PRODUCCIÓN */}

                    <div className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-[0_3px_12px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,50,84,0.08)]">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcf8ed]">

                                <span className="h-3 w-3 rounded-full bg-[#0db77d]" />

                            </div>

                            <span className="text-xs font-medium text-[#8a98b2]">
                                Ambiente
                            </span>

                        </div>

                        <p className="mt-5 text-[30px] font-bold tracking-tight text-[#15233e]">
                            {productionCount}
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-[#637492]">
                            Producción
                        </p>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#e4f2ed]">

                            <div
                                className="h-full rounded-full bg-[#0db77d] transition-all duration-500"
                                style={{
                                    width: `${productionPercentage}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    LISTA
                ================================================== */}

                {credentials.length === 0 ? (

                    <div className="rounded-2xl border border-[#dce4ef] bg-white px-6 py-16 text-center shadow-[0_3px_12px_rgba(31,50,84,0.05)]">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9eaff]">

                            <KeyRound
                                size={25}
                                className="text-[#5956e9]"
                            />

                        </div>

                        <h3 className="mt-5 text-base font-bold text-[#172642]">
                            No tienes credenciales guardadas
                        </h3>

                        <p className="mt-1 text-sm text-[#71809d]">
                            Crea tu primera credencial para comenzar.
                        </p>

                        <button
                            onClick={openCreate}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5547e8] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5547e8]/15 transition hover:bg-[#493bd4]"
                        >
                            <Plus size={16} />

                            Nueva credencial
                        </button>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {credentials.map(
                            (credential) => (

                                <div
                                    key={credential.id}
                                    className="group overflow-hidden rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-[0_4px_14px_rgba(31,50,84,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_25px_rgba(31,50,84,0.09)]"
                                >

                                    {/* HEADER */}

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">

                                        <div className="flex min-w-0 items-start gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff]">

                                                <KeyRound
                                                    size={20}
                                                    strokeWidth={2}
                                                    className="text-[#5956e9]"
                                                />

                                            </div>


                                            <div className="min-w-0">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <h2 className="truncate text-[16px] font-bold text-[#172642]">
                                                        {
                                                            credential.name
                                                        }
                                                    </h2>

                                                    <span className="rounded-full bg-[#e7e8ff] px-2.5 py-1 text-[10px] font-bold text-[#5854df]">
                                                        {getCategoryLabel(
                                                            credential.category
                                                        )}
                                                    </span>

                                                </div>


                                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">

                                                    <span className="font-medium text-[#71809d]">
                                                        {credential.system ||
                                                            "Sin sistema"}
                                                    </span>

                                                    {credential.environment && (
                                                        <>
                                                            <span className="text-[#c2cad7]">
                                                                •
                                                            </span>

                                                            <span
                                                                className={
                                                                    credential.environment ===
                                                                    "prod"
                                                                        ? "font-semibold text-[#08a56c]"
                                                                        : "font-medium text-[#71809d]"
                                                                }
                                                            >
                                                                {getEnvironmentLabel(
                                                                    credential.environment
                                                                )}
                                                            </span>
                                                        </>
                                                    )}

                                                </div>


                                                {/* FECHA */}

                                                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#8a98b2]">

                                                    <Clock3
                                                        size={12}
                                                    />

                                                    <span>
                                                        {getRelativeTime(
                                                            credential.updatedAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ACCIONES */}

                                        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">

                                            {/* FAVORITO */}

                                            <button
                                                onClick={() =>
                                                    toggleFavorite(
                                                        credential.id
                                                    )
                                                }
                                                title="Favorito"
                                                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                                                    credential.favorite
                                                        ? "border-[#dddfff] bg-[#f1f0ff]"
                                                        : "border-[#dce4ef] bg-white hover:border-[#dddfff] hover:bg-[#f5f4ff]"
                                                }`}
                                            >

                                                <Star
                                                    size={17}
                                                    className={
                                                        credential.favorite
                                                            ? "fill-[#6864ec] text-[#6864ec]"
                                                            : "text-[#8795ad]"
                                                    }
                                                />

                                            </button>


                                            {/* VER */}

                                            <button
                                                onClick={() =>
                                                    openView(
                                                        credential
                                                    )
                                                }
                                                title="Ver credencial"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4ef] bg-white text-[#7788a5] transition-all hover:border-[#d8d7ff] hover:bg-[#f3f2ff] hover:text-[#5b57e7]"
                                            >
                                                <Eye size={16} />
                                            </button>


                                            {/* EDITAR */}

                                            <button
                                                onClick={() =>
                                                    openEdit(
                                                        credential
                                                    )
                                                }
                                                title="Editar"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4ef] bg-white text-[#7788a5] transition-all hover:border-[#d8d7ff] hover:bg-[#f3f2ff] hover:text-[#5b57e7]"
                                            >
                                                <Pencil size={16} />
                                            </button>


                                            {/* ELIMINAR */}

                                            <button
                                                onClick={() =>
                                                    askDelete(
                                                        credential
                                                    )
                                                }
                                                title="Eliminar"
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadcdf] bg-white text-[#a5a9b4] transition-all hover:border-[#f0cfd3] hover:bg-[#fff4f5] hover:text-[#e86672]"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>

                                    </div>


                                    {/* RESUMEN */}

                                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

                                        {/* HOST */}

                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Host
                                            </p>

                                            <p className="mt-2 truncate text-[13px] font-semibold text-[#1c2d4b]">
                                                {credential.host ||
                                                    "-"}
                                            </p>

                                        </div>


                                        {/* USUARIO */}

                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Usuario
                                            </p>

                                            <p className="mt-2 truncate text-[13px] font-semibold text-[#1c2d4b]">
                                                {credential.username ||
                                                    "-"}
                                            </p>

                                        </div>


                                        {/* CONTRASEÑA */}

                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <div className="flex items-center justify-between">

                                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                    Contraseña
                                                </p>

                                                {credential.password && (
                                                    <button
                                                        onClick={() =>
                                                            togglePassword(
                                                                credential.id
                                                            )
                                                        }
                                                        className="rounded-lg p-1 text-[#8495b3] transition hover:bg-[#e2e8f2] hover:text-[#5b57e7]"
                                                        title={
                                                            showPasswords[
                                                                credential
                                                                    .id
                                                            ]
                                                                ? "Ocultar contraseña"
                                                                : "Mostrar contraseña"
                                                        }
                                                    >
                                                        {showPasswords[
                                                            credential.id
                                                        ] ? (
                                                            <EyeOff
                                                                size={14}
                                                            />
                                                        ) : (
                                                            <Eye
                                                                size={14}
                                                            />
                                                        )}
                                                    </button>
                                                )}

                                            </div>

                                            <p className="mt-2 truncate text-[13px] font-semibold tracking-wide text-[#1c2d4b]">
                                                {showPasswords[
                                                    credential.id
                                                ]
                                                    ? credential.password ||
                                                      "-"
                                                    : "••••••••"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    MODAL NUEVA / EDITAR
                ================================================== */}

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
                            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-2xl shadow-slate-900/20"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-[#e4e9f1] bg-[#f7f9fc] px-4 py-4 sm:px-7 sm:py-6">

                                <div>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a56e9]">
                                        {editingId
                                            ? "Editar"
                                            : "Nueva"}
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold text-[#15233e] sm:text-2xl">
                                        {editingId
                                            ? "Editar credencial"
                                            : "Nueva credencial"}
                                    </h2>

                                    <p className="mt-1 text-sm text-[#71809d]">
                                        Completa los datos del acceso.
                                    </p>

                                </div>


                                <button
                                    onClick={closeForm}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce4ef] bg-white text-[#8290aa] transition hover:bg-[#f1f4f8] hover:text-[#33415c]"
                                >
                                    <X size={17} />
                                </button>

                            </div>


                            <div className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-7 md:grid-cols-2">

                                {/* NOMBRE */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Nombre
                                    </label>

                                    <input
                                        value={form.name}
                                        onChange={(e) =>
                                            change(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ej. SQL Producción"
                                        autoFocus
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* CATEGORÍA */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Categoría
                                    </label>

                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            change(
                                                "category",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#33415c] outline-none transition focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    >
                                        <option value="sql">
                                            SQL Server
                                        </option>

                                        <option value="rdp">
                                            PC Remoto
                                        </option>

                                        <option value="vpn">
                                            VPN
                                        </option>

                                        <option value="tomcat">
                                            Tomcat
                                        </option>

                                        <option value="ftp">
                                            FTP
                                        </option>

                                        <option value="api">
                                            API
                                        </option>

                                        <option value="web">
                                            Web
                                        </option>

                                        <option value="otro">
                                            Otro
                                        </option>

                                    </select>

                                </div>


                                {/* SISTEMA */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Sistema
                                    </label>

                                    <input
                                        value={form.system}
                                        onChange={(e) =>
                                            change(
                                                "system",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ej. Workly"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* AMBIENTE */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Ambiente
                                    </label>

                                    <select
                                        value={
                                            form.environment
                                        }
                                        onChange={(e) =>
                                            change(
                                                "environment",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#33415c] outline-none transition focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    >
                                        <option value="prod">
                                            Producción
                                        </option>

                                        <option value="qa">
                                            QA
                                        </option>

                                        <option value="test">
                                            Test
                                        </option>

                                        <option value="dev">
                                            Desarrollo
                                        </option>

                                        <option value="local">
                                            Local
                                        </option>

                                    </select>

                                </div>


                                {/* HOST */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        IP / Host
                                    </label>

                                    <input
                                        value={form.host}
                                        onChange={(e) =>
                                            change(
                                                "host",
                                                e.target.value
                                            )
                                        }
                                        placeholder="192.168.1.100"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* PUERTO */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Puerto
                                    </label>

                                    <input
                                        value={form.port}
                                        onChange={(e) =>
                                            change(
                                                "port",
                                                e.target.value
                                            )
                                        }
                                        placeholder="1433"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* BASE DE DATOS */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Base de datos
                                    </label>

                                    <input
                                        value={
                                            form.database
                                        }
                                        onChange={(e) =>
                                            change(
                                                "database",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nombre de BD"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* DOMINIO */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Dominio
                                    </label>

                                    <input
                                        value={form.domain}
                                        onChange={(e) =>
                                            change(
                                                "domain",
                                                e.target.value
                                            )
                                        }
                                        placeholder="DOMINIO"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* USUARIO */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Usuario
                                    </label>

                                    <input
                                        value={
                                            form.username
                                        }
                                        onChange={(e) =>
                                            change(
                                                "username",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Usuario"
                                        autoComplete="off"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* CONTRASEÑA */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Contraseña
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            form.password
                                        }
                                        onChange={(e) =>
                                            change(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contraseña"
                                        autoComplete="new-password"
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* URL */}

                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        URL
                                    </label>

                                    <input
                                        value={form.url}
                                        onChange={(e) =>
                                            change(
                                                "url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://..."
                                        className="h-11 w-full rounded-xl border border-[#dce4ef] bg-[#f1f5fa] px-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>


                                {/* NOTAS */}

                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-[#33415c]">
                                        Notas
                                    </label>

                                    <textarea
                                        value={form.notes}
                                        onChange={(e) =>
                                            change(
                                                "notes",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Información adicional..."
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-[#dce4ef] bg-[#f1f5fa] p-4 text-sm text-[#243552] outline-none transition placeholder:text-[#9aa7bb] focus:border-[#817cf0] focus:bg-white focus:ring-4 focus:ring-[#817cf0]/10"
                                    />

                                </div>

                            </div>


                            <div className="flex flex-col-reverse gap-3 border-t border-[#e4e9f1] bg-[#f7f9fc] px-4 py-4 sm:flex-row sm:justify-end sm:px-7 sm:py-5">

                                <button
                                    onClick={closeForm}
                                    className="rounded-xl border border-[#dce4ef] bg-white px-5 py-2.5 text-sm font-semibold text-[#65738d] transition hover:bg-[#f1f4f8]"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={save}
                                    disabled={
                                        !form.name.trim()
                                    }
                                    className="rounded-xl bg-[#5547e8] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5547e8]/15 transition hover:bg-[#493bd4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {editingId
                                        ? "Guardar cambios"
                                        : "Guardar credencial"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    MODAL VER CREDENCIAL
                ================================================== */}

                {selectedCredential && (

                    <div
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]"
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
                            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-2xl shadow-slate-900/25"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* HEADER */}

                            <div className="flex items-start justify-between gap-3 border-b border-[#e4e9f1] bg-[#f7f9fc] px-4 py-4 sm:px-7 sm:py-6">

                                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9eaff]">

                                        <KeyRound
                                            size={21}
                                            className="text-[#5956e9]"
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <h2 className="break-words text-xl font-bold text-[#15233e] sm:text-2xl">
                                                {
                                                    selectedCredential.name
                                                }
                                            </h2>

                                            <span className="rounded-full bg-[#e7e8ff] px-2.5 py-1 text-[10px] font-bold text-[#5854df]">
                                                {getCategoryLabel(
                                                    selectedCredential.category
                                                )}
                                            </span>

                                        </div>

                                        <p className="mt-1 text-sm text-[#71809d]">
                                            {selectedCredential.system ||
                                                "Sin sistema"}

                                            {" • "}

                                            {getEnvironmentLabel(
                                                selectedCredential.environment
                                            )}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={closeView}
                                    className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce4ef] bg-white text-[#8290aa] transition hover:bg-[#f1f4f8] hover:text-[#33415c]"
                                >
                                    <X size={17} />
                                </button>

                            </div>


                            {/* CONTENIDO */}

                            <div className="space-y-4 p-4 sm:space-y-5 sm:p-7">

                                {/* CONEXIÓN */}

                                <div>

                                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#71809d]">
                                        Información de conexión
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Host
                                            </p>

                                            <p className="mt-2 break-all text-[13px] font-semibold text-[#1c2d4b]">
                                                {selectedCredential.host ||
                                                    "-"}
                                            </p>

                                        </div>


                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Puerto
                                            </p>

                                            <p className="mt-2 text-[13px] font-semibold text-[#1c2d4b]">
                                                {selectedCredential.port ||
                                                    "-"}
                                            </p>

                                        </div>


                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Base de datos
                                            </p>

                                            <p className="mt-2 break-all text-[13px] font-semibold text-[#1c2d4b]">
                                                {selectedCredential.database ||
                                                    "-"}
                                            </p>

                                        </div>


                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Dominio
                                            </p>

                                            <p className="mt-2 break-all text-[13px] font-semibold text-[#1c2d4b]">
                                                {selectedCredential.domain ||
                                                    "-"}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* ACCESO */}

                                <div>

                                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#71809d]">
                                        Acceso
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                        {/* USUARIO */}

                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Usuario
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">

                                                <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1c2d4b]">
                                                    {selectedCredential.username ||
                                                        "-"}
                                                </p>

                                                {selectedCredential.username && (
                                                    <button
                                                        onClick={() =>
                                                            copy(
                                                                selectedCredential.username
                                                            )
                                                        }
                                                        title="Copiar usuario"
                                                        className="shrink-0 rounded-lg p-1.5 text-[#8495b3] transition hover:bg-[#e2e8f2] hover:text-[#5b57e7]"
                                                    >
                                                        <Copy
                                                            size={15}
                                                        />
                                                    </button>
                                                )}

                                            </div>

                                        </div>


                                        {/* CONTRASEÑA */}

                                        <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Contraseña
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">

                                                <p className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-wide text-[#1c2d4b]">

                                                    {showModalPassword
                                                        ? selectedCredential.password ||
                                                          "-"
                                                        : "••••••••"}

                                                </p>


                                                <button
                                                    onClick={() =>
                                                        setShowModalPassword(
                                                            (current) =>
                                                                !current
                                                        )
                                                    }
                                                    title={
                                                        showModalPassword
                                                            ? "Ocultar contraseña"
                                                            : "Mostrar contraseña"
                                                    }
                                                    className="shrink-0 rounded-lg p-1.5 text-[#8495b3] transition hover:bg-[#e2e8f2] hover:text-[#5b57e7]"
                                                >
                                                    {showModalPassword ? (
                                                        <EyeOff
                                                            size={15}
                                                        />
                                                    ) : (
                                                        <Eye
                                                            size={15}
                                                        />
                                                    )}
                                                </button>


                                                {selectedCredential.password && (
                                                    <button
                                                        onClick={() =>
                                                            copy(
                                                                selectedCredential.password
                                                            )
                                                        }
                                                        title="Copiar contraseña"
                                                        className="shrink-0 rounded-lg p-1.5 text-[#8495b3] transition hover:bg-[#e2e8f2] hover:text-[#5b57e7]"
                                                    >
                                                        <Copy
                                                            size={15}
                                                        />
                                                    </button>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* SISTEMA */}

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                    <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                            Sistema
                                        </p>

                                        <p className="mt-2 text-[13px] font-semibold text-[#1c2d4b]">
                                            {selectedCredential.system ||
                                                "-"}
                                        </p>

                                    </div>


                                    <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-3.5">

                                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                            Ambiente
                                        </p>

                                        <p className="mt-2 text-[13px] font-semibold text-[#1c2d4b]">
                                            {getEnvironmentLabel(
                                                selectedCredential.environment
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* FECHAS */}

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                    <div className="rounded-xl border border-[#dce4ef] bg-[#f7f9fc] px-4 py-4">

                                        <div className="flex items-center gap-2">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e9eaff] text-[#5956e9]">
                                                <Clock3
                                                    size={15}
                                                />
                                            </div>

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Creado
                                            </p>

                                        </div>

                                        <p className="mt-3 text-sm font-semibold text-[#1c2d4b]">
                                            {formatDateTime(
                                                selectedCredential.createdAt
                                            )}
                                        </p>

                                    </div>


                                    <div className="rounded-xl border border-[#dce4ef] bg-[#f7f9fc] px-4 py-4">

                                        <div className="flex items-center gap-2">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0edff] text-[#6b5be8]">
                                                <RotateCcw
                                                    size={15}
                                                />
                                            </div>

                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                                Última actualización
                                            </p>

                                        </div>

                                        <p className="mt-3 text-sm font-semibold text-[#1c2d4b]">
                                            {formatDateTime(
                                                selectedCredential.updatedAt
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* URL */}

                                {selectedCredential.url && (

                                    <div>

                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#71809d]">
                                            URL
                                        </p>

                                        <a
                                            href={
                                                selectedCredential.url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 rounded-xl border border-[#dfe1ff] bg-[#f4f3ff] px-4 py-3 text-sm font-medium text-[#5c58df] transition hover:border-[#cfcfff] hover:bg-[#eeedff]"
                                        >

                                            <ExternalLink
                                                size={15}
                                                className="shrink-0"
                                            />

                                            <span className="truncate">
                                                {
                                                    selectedCredential.url
                                                }
                                            </span>

                                        </a>

                                    </div>

                                )}


                                {/* NOTAS */}

                                {selectedCredential.notes && (

                                    <div className="rounded-xl border border-[#dce4ef] bg-[#eef3f9] px-4 py-4">

                                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#687995]">
                                            Notas
                                        </p>

                                        <p className="whitespace-pre-wrap text-sm leading-6 text-[#596b88]">
                                            {
                                                selectedCredential.notes
                                            }
                                        </p>

                                    </div>

                                )}


                                {/* ACTIVIDAD */}

                                <div className="rounded-xl border border-[#e1e0ff] bg-[#f5f4ff] px-4 py-3">

                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                        <p className="text-xs font-semibold text-[#5b57e7]">
                                            Actividad de la credencial
                                        </p>

                                        <p className="text-xs text-[#716bd5]">
                                            {getRelativeTime(
                                                selectedCredential.updatedAt
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="flex flex-col gap-3 border-t border-[#e4e9f1] bg-[#f7f9fc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">

                                <button
                                    onClick={() =>
                                        toggleFavorite(
                                            selectedCredential.id
                                        )
                                    }
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                                        selectedCredential.favorite
                                            ? "border-[#dddfff] bg-[#f1f0ff] text-[#5b57e7]"
                                            : "border-[#dce4ef] bg-white text-[#65738d] hover:border-[#dddfff] hover:bg-[#f5f4ff] hover:text-[#5b57e7]"
                                    }`}
                                >

                                    <Star
                                        size={16}
                                        className={
                                            selectedCredential.favorite
                                                ? "fill-[#6864ec] text-[#6864ec]"
                                                : ""
                                        }
                                    />

                                    {selectedCredential.favorite
                                        ? "Quitar favorito"
                                        : "Agregar favorito"}

                                </button>


                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                                    <button
                                        onClick={() =>
                                            askDelete(
                                                selectedCredential
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-[#f0cfd3] bg-[#fff4f5] px-4 py-2.5 text-sm font-semibold text-[#e86672] transition hover:bg-[#ffe9eb]"
                                    >
                                        <Trash2 size={16} />

                                        Eliminar
                                    </button>


                                    <button
                                        onClick={closeView}
                                        className="rounded-xl border border-[#dce4ef] bg-white px-5 py-2.5 text-sm font-semibold text-[#65738d] transition hover:bg-[#f1f4f8]"
                                    >
                                        Cerrar
                                    </button>


                                    <button
                                        onClick={() => {
                                            closeView();

                                            openEdit(
                                                selectedCredential
                                            );
                                        }}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#5547e8] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5547e8]/15 transition hover:bg-[#493bd4]"
                                    >
                                        <Pencil size={16} />

                                        Editar
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    MODAL CONFIRMAR ELIMINACIÓN
                ================================================== */}

                {credentialToDelete && (

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
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-2xl shadow-slate-950/20"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />


                            <div className="p-4 sm:p-6">

                                <div className="flex items-start gap-3 sm:gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100">

                                        <AlertTriangle
                                            size={22}
                                            className="text-red-500"
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <h2 className="text-lg font-bold text-[#172642]">
                                            ¿Eliminar credencial?
                                        </h2>

                                        <p className="mt-1 text-sm leading-5 text-[#71809d]">
                                            Estás a punto de eliminar esta credencial.
                                            Esta acción no se puede deshacer.
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-5 rounded-xl border border-[#dce4ef] bg-[#eef3f9] p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e9eaff]">

                                            <KeyRound
                                                size={17}
                                                className="text-[#5956e9]"
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-bold text-[#1c2d4b]">
                                                {
                                                    credentialToDelete.name
                                                }
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-[#71809d]">
                                                {
                                                    credentialToDelete.system ||
                                                    "Sin sistema"
                                                }

                                                {" • "}

                                                {getEnvironmentLabel(
                                                    credentialToDelete.environment
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            <div className="flex flex-col-reverse gap-3 border-t border-[#e4e9f1] bg-[#f7f9fc] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">

                                <button
                                    onClick={cancelDelete}
                                    className="rounded-xl border border-[#dce4ef] bg-white px-5 py-2.5 text-sm font-semibold text-[#65738d] transition hover:bg-[#f1f4f8]"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={remove}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#e86672] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition hover:bg-[#d95562] hover:shadow-lg"
                                >
                                    <Trash2 size={16} />

                                    Eliminar credencial
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};

export default CredentialsPage;