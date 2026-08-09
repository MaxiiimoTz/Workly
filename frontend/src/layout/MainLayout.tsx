import { useEffect, useRef, useState } from "react";
import {
    Link,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    FileText,
    KeyRound,
    LayoutDashboard,
    LogOut,
    Camera,
    ChevronDown,
    Star,
    Menu,
    X,
} from "lucide-react";

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<any>(null);

    const [profileImage, setProfileImage] =
        useState<string | null>(null);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const menu = [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            path: "/records",
            label: "Registros",
            icon: FileText,
        },
        {
            path: "/credentials",
            label: "Credenciales",
            icon: KeyRound,
        },
        {
            path: "/favorites",
            label: "Favoritos",
            icon: Star,
        },
    ];

    // =====================================================
    // USUARIO Y FOTO DE PERFIL
    // =====================================================

    useEffect(() => {
        const storedUser =
            localStorage.getItem("worklyUser");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }

        const savedImage =
            localStorage.getItem(
                "worklyProfileImage"
            );

        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

    // =====================================================
    // ESCUCHAR CAMBIOS DE FOTO DESDE PROFILE
    // =====================================================

    useEffect(() => {
        const handleProfileImageUpdated = (
            event: Event
        ) => {
            const customEvent =
                event as CustomEvent<string>;

            const newImage =
                customEvent.detail;

            if (!newImage) return;

            setProfileImage(newImage);
        };

        window.addEventListener(
            "worklyProfileImageUpdated",
            handleProfileImageUpdated
        );

        return () => {
            window.removeEventListener(
                "worklyProfileImageUpdated",
                handleProfileImageUpdated
            );
        };
    }, []);

    // =====================================================
    // DATOS USUARIO
    // =====================================================

    const getUserName = () => {
        if (!user) return "Usuario";

        return (
            user.name ||
            user.nombre ||
            user.fullName ||
            user.fullname ||
            user.username ||
            user.usuario ||
            "Usuario"
        );
    };

    const getUserUsername = () => {
        if (!user) return "";

        return (
            user.username ||
            user.usuario ||
            user.email ||
            ""
        );
    };

    const userName = getUserName();
    const userUsername = getUserUsername();

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word: string) =>
            word.charAt(0).toUpperCase()
        )
        .join("");

    // =====================================================
    // FOTO DE PERFIL DESDE SIDEBAR
    // =====================================================

    const handleProfileImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const result =
                reader.result as string;

            setProfileImage(result);

            localStorage.setItem(
                "worklyProfileImage",
                result
            );

            // Avisar también a cualquier componente
            // que esté escuchando cambios de foto
            window.dispatchEvent(
                new CustomEvent(
                    "worklyProfileImageUpdated",
                    {
                        detail: result,
                    }
                )
            );
        };

        reader.readAsDataURL(file);

        // Permitir volver a seleccionar
        // la misma imagen
        event.target.value = "";
    };

    // =====================================================
    // ABRIR PERFIL
    // =====================================================

    const openProfile = () => {
        navigate("/profile");
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {
        localStorage.removeItem("worklyUser");

        navigate("/login", {
            replace: true,
        });
    };

    // =====================================================
    // CERRAR SIDEBAR AL CAMBIAR DE PÁGINA
    // =====================================================

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="h-screen overflow-hidden bg-[#eef2f7] text-slate-800">

            {/* =====================================================
                BOTÓN MENÚ MOBILE
            ====================================================== */}

            <button
                type="button"
                onClick={() =>
                    setSidebarOpen(true)
                }
                className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-md lg:hidden"
            >
                <Menu size={20} />
            </button>

            {/* =====================================================
                OVERLAY MOBILE
            ====================================================== */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-64 flex-col
                    border-r border-slate-800/80
                    bg-[#0a1020]
                    transition-transform duration-300
                    lg:translate-x-0
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* =================================================
                    LOGO
                ================================================== */}

                <div className="flex h-[76px] items-center justify-between border-b border-white/[0.06] px-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/40">

                            <KeyRound
                                size={19}
                                strokeWidth={2.2}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-[19px] font-bold tracking-tight text-white">
                                Workly
                            </h1>

                            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-slate-500">
                                Workspace
                            </p>

                        </div>

                    </div>

                    {/* Cerrar sidebar */}

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* =================================================
                    NAVEGACIÓN
                ================================================== */}

                <nav className="flex-1 overflow-y-auto px-3 py-6">

                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        Menú principal
                    </p>

                    <div className="space-y-1.5">

                        {menu.map((item) => {

                            const Icon = item.icon;

                            const active =
                                location.pathname ===
                                item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        group relative flex items-center gap-3
                                        rounded-xl px-3.5 py-3
                                        text-sm font-medium
                                        transition-all duration-200
                                        ${
                                            active
                                                ? "bg-[#1b2740] text-white shadow-sm ring-1 ring-white/[0.05]"
                                                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                        }
                                    `}
                                >

                                    {active && (
                                        <div className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-indigo-400" />
                                    )}

                                    <Icon
                                        size={18}
                                        strokeWidth={1.9}
                                        className={
                                            active
                                                ? item.path ===
                                                  "/favorites"
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-indigo-400"
                                                : item.path ===
                                                  "/favorites"
                                                    ? "text-slate-500 transition-colors group-hover:text-amber-400"
                                                    : "text-slate-500 transition-colors group-hover:text-slate-300"
                                        }
                                    />

                                    <span>
                                        {item.label}
                                    </span>

                                </Link>
                            );
                        })}

                    </div>

                </nav>

                {/* =================================================
                    USUARIO
                ================================================== */}

                <div className="border-t border-white/[0.06] p-3">

                    {/* =================================================
                        TARJETA PERFIL
                    ================================================== */}

                    <div
                        onClick={openProfile}
                        className={`
                            mb-2 cursor-pointer rounded-2xl
                            border border-white/[0.06]
                            bg-[#111827]/80 p-3
                            transition-all duration-200
                            hover:border-white/[0.1]
                            hover:bg-[#151e30]
                            ${
                                location.pathname ===
                                "/profile"
                                    ? "ring-1 ring-indigo-500/30"
                                    : ""
                            }
                        `}
                    >

                        <div className="flex items-center gap-3">

                            {/* FOTO */}

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    fileInputRef.current?.click();
                                }}
                                className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 ring-1 ring-white/10"
                                title="Cambiar foto de perfil"
                            >

                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Foto de perfil"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                                        {initials ||
                                            "U"}
                                    </span>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">

                                    <Camera
                                        size={15}
                                        className="text-white"
                                    />

                                </div>

                            </button>

                            {/* INFORMACIÓN */}

                            <div className="min-w-0 flex-1">

                                <div className="flex items-center gap-2">

                                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
                                        Sesión activa
                                    </p>

                                </div>

                                <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                                    {userName}
                                </p>

                                {userUsername &&
                                    userUsername !==
                                        userName && (
                                        <p className="mt-0.5 truncate text-[10px] text-slate-500">
                                            {
                                                userUsername
                                            }
                                        </p>
                                    )}

                            </div>

                            {/* FLECHA */}

                            <ChevronDown
                                size={14}
                                className={`
                                    text-slate-600
                                    transition-transform
                                    ${
                                        location.pathname ===
                                        "/profile"
                                            ? "rotate-180 text-indigo-400"
                                            : ""
                                    }
                                `}
                            />

                        </div>

                    </div>

                    {/* =================================================
                        INPUT FOTO
                    ================================================== */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={
                            handleProfileImage
                        }
                    />

                    {/* =================================================
                        CERRAR SESIÓN
                    ================================================== */}

                    <button
                        onClick={logout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/[0.08] hover:text-red-400"
                    >

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] transition group-hover:bg-red-500/10">

                            <LogOut
                                size={16}
                                strokeWidth={1.9}
                                className="text-slate-500 transition group-hover:text-red-400"
                            />

                        </div>

                        <span>
                            Cerrar sesión
                        </span>

                    </button>

                </div>

            </aside>

            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <main
                className="
                    h-screen
                    overflow-y-auto
                    overflow-x-hidden
                    bg-[#eef2f7]
                    lg:ml-64
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                "
            >

                <div className="pointer-events-none fixed left-0 right-0 top-0 z-10 h-px bg-slate-300/70 lg:left-64" />

                <div className="min-h-full px-4 pb-6 pt-20 sm:px-6 lg:p-8">

                    <Outlet />

                </div>

            </main>

        </div>
    );
};

export default MainLayout;