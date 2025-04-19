import React, {ReactNode} from 'react';

type ButtonProps = {
    children: ReactNode;
    primary: boolean;
    bordered?: boolean;
    disabled?: boolean;
    onClick: () => void;
};
const Button: React.FC<ButtonProps> = ({
                                           children,
                                           primary = false,
                                           bordered = true,
                                           disabled = false,
                                           onClick,
                                       }) => {
    let colorClass = '';
    let borderClass = '';
    let cursorClass = 'cursor-pointer';
    const textClass = 'uppercase font-semibold text-[14px]/[24px] tracking-[0.029rem]';

    if (bordered) {
        borderClass = 'rounded-md border-none transition-colors transition-shadow transition-border duration-200 ease-in-out my-2 py-2';

        if (primary) {
            colorClass = 'bg-[#0E9E57] hover:bg-[#0A703E] text-white shadow-lg';
        } else {
            colorClass = 'bg-transparent hover:bg-[#4242420a] text-[#424242] border-gray-300';
        }
    }

    if (disabled) {
        cursorClass = 'cursor-not-allowed';
    }

    return (
        <button
            className={`px-4  ${textClass} ${colorClass} ${borderClass} ${cursorClass}`}
            onClick={() => {
                if (disabled) {
                    return;
                }
                onClick();
            }}
        >
            {children}
        </button>
    );
};

export default Button;