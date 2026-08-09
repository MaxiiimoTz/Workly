import { useEffect, useState } from "react";
import {
    User,
    Lock,
    Save,
    Eye,
    EyeOff,
    Camera,
} from "lucide-react";

const API_URL = "https://workly-ilqb.onrender.com/api";

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [profileImage, setProfileImage] =
        useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // CARGAR USUARIO Y FOTO
    // =====================================================

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser =
                    localStorage.getItem("worklyUser");

                // Cargar foto guardada
                const savedImage =
                    localStorage.getItem(
                        "worklyProfileImage"
                    );

                if (savedImage) {
                    setProfileImage(savedImage);
                }

                if (!storedUser) {
                    setError(
                        "No se encontró la sesión del usuario."
                    );

                    setLoading(false);
                    return;
                }

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

                const response = await fetch(
                    `${API_URL}/users/${parsedUser.id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "No se pudo obtener el perfil."
                    );
                }

                const data =
                    await response.json();

                setName(data.name ?? "");

                setUsername(
                    data.username ?? ""
                );
            } catch (err) {
                console.error(
                    "Error cargando perfil:",
                    err
                );

                setError(
                    "No se pudo cargar la información del perfil."
                );
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // =====================================================
    // GUARDAR PERFIL
    // =====================================================

    const saveProfile = async () => {
        if (!user?.id) {
            setError(
                "No se encontró el usuario."
            );
            return;
        }

        if (!name.trim()) {
            setError(
                "El nombre no puede estar vacío."
            );
            return;
        }

        if (!username.trim()) {
            setError(
                "El usuario no puede estar vacío."
            );
            return;
        }

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/users/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        username:
                            username.trim(),
                        name: name.trim(),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "No se pudo actualizar el perfil."
                );
            }

            const updatedUser =
                await response.json();

            const newUser = {
                ...user,
                id: updatedUser.id,
                username:
                    updatedUser.username,
                name: updatedUser.name,
            };

            setUser(newUser);

            localStorage.setItem(
                "worklyUser",
                JSON.stringify(newUser)
            );

            setMessage(
                "Perfil actualizado correctamente."
            );
        } catch (err) {
            console.error(
                "Error actualizando perfil:",
                err
            );

            setError(
                "No se pudo actualizar el perfil."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CAMBIAR CONTRASEÑA
    // =====================================================

    const changePassword = async () => {
        if (!user?.id) {
            setError(
                "No se encontró el usuario."
            );
            return;
        }

        setMessage("");
        setError("");

        if (!currentPassword) {
            setError(
                "Ingresa tu contraseña actual."
            );
            return;
        }

        if (!newPassword) {
            setError(
                "Ingresa la nueva contraseña."
            );
            return;
        }

        if (newPassword.length < 4) {
            setError(
                "La nueva contraseña debe tener al menos 4 caracteres."
            );
            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "Las contraseñas nuevas no coinciden."
            );
            return;
        }

        setSaving(true);

        try {
            // Verificar contraseña actual
            const loginResponse =
                await fetch(
                    `${API_URL}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            username:
                                user.username,
                            password:
                                currentPassword,
                        }),
                    }
                );

            if (!loginResponse.ok) {
                setError(
                    "La contraseña actual es incorrecta."
                );

                setSaving(false);
                return;
            }

            // Actualizar contraseña
            const response =
                await fetch(
                    `${API_URL}/users/${user.id}/password`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            password:
                                newPassword,
                        }),
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "No se pudo cambiar la contraseña."
                );
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setMessage(
                "Contraseña actualizada correctamente."
            );
        } catch (err) {
            console.error(
                "Error cambiando contraseña:",
                err
            );

            setError(
                "No se pudo cambiar la contraseña."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // FOTO DE PERFIL
    // =====================================================

    const handleProfileImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        if (
            !file.type.startsWith("image/")
        ) {
            setError(
                "Selecciona una imagen válida."
            );

            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const result =
                reader.result as string;

            // Guardar permanentemente en localStorage
            localStorage.setItem(
                "worklyProfileImage",
                result
            );

            // Actualizar inmediatamente la imagen
            // dentro de esta página
            setProfileImage(result);

            // Avisar al MainLayout para actualizar
            // inmediatamente la foto del Sidebar
            window.dispatchEvent(
                new CustomEvent(
                    "worklyProfileImageUpdated",
                    {
                        detail: result,
                    }
                )
            );

            setMessage(
                "Foto de perfil actualizada."
            );

            setError("");
        };

        reader.readAsDataURL(file);

        // Permitir seleccionar nuevamente
        // la misma imagen si se desea
        event.target.value = "";
    };

    // =====================================================
    // INICIALES
    // =====================================================

    const initials =
        (
            name ||
            username ||
            "U"
        )
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) =>
                word
                    .charAt(0)
                    .toUpperCase()
            )
            .join("");

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Cargando perfil...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-full w-full max-w-full space-y-7 overflow-x-hidden">

            {/* =====================================================
                ENCABEZADO
            ====================================================== */}

            <div>
                <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />

                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Cuenta
                    </p>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Mi perfil
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Administra tu información personal y seguridad.
                </p>
            </div>

            {/* =====================================================
                MENSAJES
            ====================================================== */}

            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* =================================================
                    INFORMACIÓN PERSONAL
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <User size={19} />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Información personal
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Actualiza tus datos.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">

                        {/* FOTO */}

                        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:gap-5">

                            <div className="relative">

                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-100">

                                    {profileImage ? (
                                        <img
                                            src={
                                                profileImage
                                            }
                                            alt="Foto de perfil"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        initials ||
                                        "U"
                                    )}

                                </div>

                                <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700">

                                    <Camera size={14} />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={
                                            handleProfileImage
                                        }
                                    />

                                </label>

                            </div>

                            <div className="mt-4 text-center sm:mt-0 sm:text-left">

                                <p className="text-sm font-bold text-slate-800">
                                    Foto de perfil
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Puedes cambiar tu foto desde el botón de cámara.
                                </p>

                            </div>

                        </div>

                        {/* NOMBRE */}

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Nombre
                            </label>

                            <input
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        {/* USUARIO */}

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Usuario
                            </label>

                            <input
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        {/* GUARDAR */}

                        <div className="flex justify-end border-t border-slate-100 pt-5">

                            <button
                                onClick={saveProfile}
                                disabled={saving}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                <Save size={16} />

                                {saving
                                    ? "Guardando..."
                                    : "Guardar cambios"}
                            </button>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    SEGURIDAD
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <Lock size={19} />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Seguridad
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Cambia tu contraseña.
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="space-y-5 p-5 sm:p-6">

                        {/* CONTRASEÑA ACTUAL */}

                        <div>

                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Contraseña actual
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        currentPassword
                                    }
                                    onChange={(e) =>
                                        setCurrentPassword(
                                            e.target.value
                                        )
                                    }
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword
                                        )
                                    }
                                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* NUEVA */}

                        <div>

                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Nueva contraseña
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(
                                            !showNewPassword
                                        )
                                    }
                                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* CONFIRMAR */}

                        <div>

                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Confirmar contraseña
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* AVISO */}

                        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

                            <p className="text-xs leading-5 text-amber-700">
                                Por seguridad, debes ingresar tu contraseña actual antes de establecer una nueva.
                            </p>

                        </div>

                        {/* CAMBIAR */}

                        <div className="flex justify-end border-t border-slate-100 pt-5">

                            <button
                                onClick={
                                    changePassword
                                }
                                disabled={saving}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                <Lock size={16} />

                                {saving
                                    ? "Actualizando..."
                                    : "Cambiar contraseña"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProfilePage;