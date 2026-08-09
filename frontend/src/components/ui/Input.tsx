interface Props
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({
    className = "",
    ...props
}: Props) => {
    return (
        <input
            {...props}
            className={`
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-700
                outline-none
                transition-all
                duration-200
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-slate-400
                focus:ring-2
                focus:ring-slate-100
                ${className}
            `}
        />
    );
};

export default Input;