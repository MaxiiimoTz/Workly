import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Check,
    KeyRound,
    LockKeyhole,
    User,
} from "lucide-react";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
});

const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);

    const login = async () => {
        if (!username.trim() || !password.trim()) {
            setError("Ingresa tu usuario y contraseña.");
            return;
        }

        try {
            setError("");
            setLoading(true);

            const response = await api.post("/auth/login", {
                username,
                password,
            });

            localStorage.setItem(
                "worklyUser",
                JSON.stringify(response.data)
            );

            navigate("/dashboard");
        } catch {
            setError("Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            login();
        }
    };

    return (
        <div className="min-h-screen bg-[#070b18] text-white">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* =====================================================
                    IZQUIERDA - LOGIN
                ====================================================== */}

                <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">

                    {/* Decoración */}

                    <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

                    <div className="relative z-10 w-full max-w-md">

                        {/* Logo */}

                        <div className="mb-10">

                            <div className="mb-8 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/30">
                                    <KeyRound size={18} />
                                </div>

                                <span className="text-lg font-bold tracking-tight">
                                    Workly
                                </span>

                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Inicia sesión en tu cuenta
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Bienvenido de vuelta. Inicia sesión para
                                continuar.
                            </p>

                        </div>


                        {/* =================================================
                            FORMULARIO
                        ================================================== */}

                        <div className="space-y-5">

                            {/* Usuario */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-slate-300">
                                    Usuario
                                </label>

                                <div className="relative">

                                    <User
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ingresa tu usuario"
                                        autoComplete="username"
                                        className="h-12 w-full rounded-xl border border-slate-700/70 bg-slate-900/70 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                                    />

                                </div>

                            </div>


                            {/* Contraseña */}

                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <label className="block text-xs font-medium text-slate-300">
                                        Contraseña
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>

                                </div>

                                <div className="relative">

                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="h-12 w-full rounded-xl border border-slate-700/70 bg-slate-900/70 pl-11 pr-4 text-sm tracking-widest text-white placeholder:text-slate-600 outline-none backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                                    />

                                </div>

                            </div>


                            {/* Recordarme */}

                            <label className="flex cursor-pointer items-center gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setRemember(!remember)
                                    }
                                    className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                                        remember
                                            ? "border-indigo-500 bg-indigo-500"
                                            : "border-slate-600 bg-slate-900"
                                    }`}
                                >
                                    {remember && (
                                        <Check
                                            size={11}
                                            strokeWidth={3}
                                        />
                                    )}
                                </button>

                                <span className="text-xs text-slate-400">
                                    Recordarme
                                </span>

                            </label>


                            {/* Error */}

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                    <p className="text-xs text-red-400">
                                        {error}
                                    </p>
                                </div>
                            )}


                            {/* Botón */}

                            <button
                                onClick={login}
                                disabled={loading}
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-900/20 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-900/40 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    "Iniciando sesión..."
                                ) : (
                                    <>
                                        Iniciar sesión

                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}

                            </button>

                        </div>


                        {/* Footer */}

                        <p className="mt-8 text-center text-xs text-slate-500">

                            ¿No tienes cuenta?{" "}

                            <span className="font-medium text-indigo-400">
                                Contacta al administrador
                            </span>

                        </p>

                    </div>

                </div>


                {/* =====================================================
                    DERECHA - PANEL VISUAL
                ====================================================== */}

                <div className="relative hidden overflow-hidden lg:flex">

                    {/* Fondo */}

                    <div className="absolute inset-0 bg-gradient-to-br from-[#11152a] via-[#0d1224] to-[#080c1b]" />

                    {/* Luces */}

                    <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

                    <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-3xl" />

                    {/* Luz central */}

                    <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />

                    {/* Líneas */}

                    <div className="absolute right-[-15%] top-[35%] h-[300px] w-[700px] rotate-[-25deg] rounded-[50%] border border-indigo-500/20" />

                    <div className="absolute right-[-10%] top-[42%] h-[300px] w-[700px] rotate-[-25deg] rounded-[50%] border border-violet-500/10" />

                    <div className="absolute right-[-15%] top-[49%] h-[300px] w-[700px] rotate-[-25deg] rounded-[50%] border border-indigo-400/5" />


                    {/* Contenido */}

                    <div className="relative z-10 flex w-full flex-col items-center justify-center px-16">

                        <div className="max-w-lg">

                            {/* Texto */}

                            <div className="mb-12 text-center">

                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-900/20">
                                    <KeyRound size={26} />
                                </div>

                                <h2 className="text-4xl font-bold tracking-tight">
                                    Todo en un solo lugar.
                                </h2>

                                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">
                                    Organiza tus registros, credenciales y
                                    accesos de forma sencilla y segura.
                                </p>

                            </div>


                            {/* Tarjeta */}

                            <div className="relative mx-auto w-full max-w-md">

                                <div className="absolute inset-0 rounded-3xl bg-indigo-600/20 blur-3xl" />

                                <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">

                                    {/* Header */}

                                    <div className="mb-5 flex items-center justify-between">

                                        <div>

                                            <p className="text-xs text-slate-500">
                                                WORKLY
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-white">
                                                Panel de control
                                            </p>

                                        </div>

                                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                                    </div>


                                    {/* Mini cards */}

                                    <div className="grid grid-cols-2 gap-3">

                                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">

                                            <p className="text-[10px] text-slate-500">
                                                REGISTROS
                                            </p>

                                            <p className="mt-2 text-2xl font-bold">
                                                24
                                            </p>

                                            <div className="mt-3 h-1.5 rounded-full bg-slate-800">

                                                <div className="h-1.5 w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />

                                            </div>

                                        </div>


                                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">

                                            <p className="text-[10px] text-slate-500">
                                                CREDENCIALES
                                            </p>

                                            <p className="mt-2 text-2xl font-bold">
                                                12
                                            </p>

                                            <div className="mt-3 h-1.5 rounded-full bg-slate-800">

                                                <div className="h-1.5 w-1/2 rounded-full bg-indigo-400" />

                                            </div>

                                        </div>

                                    </div>


                                    {/* Registro */}

                                    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                                <KeyRound size={17} />
                                            </div>

                                            <div className="flex-1">

                                                <p className="text-xs font-medium text-white">
                                                    Credenciales
                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-500">
                                                    Accesos organizados
                                                </p>

                                            </div>

                                            <ArrowRight
                                                size={15}
                                                className="text-slate-600"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Frase */}

                            <p className="mt-10 text-center text-xs text-slate-600">
                                Simple · Organizado · Workly
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default LoginPage;