import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
}

const Toast = ({
    message,
    type = "success",
    onClose,
}: ToastProps) => {
    const styles = {
        success: {
            container:
                "border-emerald-200 bg-white",
            iconContainer:
                "bg-emerald-50 text-emerald-600",
            icon: CheckCircle2,
            title: "Listo",
        },

        error: {
            container:
                "border-red-200 bg-white",
            iconContainer:
                "bg-red-50 text-red-600",
            icon: XCircle,
            title: "Ocurrió un error",
        },

        warning: {
            container:
                "border-amber-200 bg-white",
            iconContainer:
                "bg-amber-50 text-amber-600",
            icon: AlertTriangle,
            title: "Atención",
        },

        info: {
            container:
                "border-indigo-200 bg-white",
            iconContainer:
                "bg-indigo-50 text-indigo-600",
            icon: Info,
            title: "Información",
        },
    };

    const current = styles[type];
    const Icon = current.icon;

    return (
        <div className="pointer-events-none fixed right-6 top-6 z-[9999] w-[360px] max-w-[calc(100vw-32px)] animate-[toastIn_0.25s_ease-out]">

            <div
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-[0_12px_35px_rgba(15,23,42,0.15)] ${current.container}`}
            >

                {/* Icono */}

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${current.iconContainer}`}
                >
                    <Icon size={19} />
                </div>


                {/* Contenido */}

                <div className="min-w-0 flex-1 pt-0.5">

                    <p className="text-sm font-bold text-slate-800">
                        {current.title}
                    </p>

                    <p className="mt-0.5 text-sm leading-5 text-slate-500">
                        {message}
                    </p>

                </div>


                {/* Cerrar */}

                <button
                    onClick={onClose}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    <X size={15} />
                </button>

            </div>

        </div>
    );
};

export default Toast;