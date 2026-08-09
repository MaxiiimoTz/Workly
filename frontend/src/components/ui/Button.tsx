interface Props
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button = ({
    children,
    className = "",
    ...props
}: Props) => {
    return (
        <button
            {...props}
            className={`
                inline-flex
                h-11
                items-center
                justify-center
                rounded-xl
                bg-slate-900
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-slate-800
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-slate-300
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default Button;