'use client';

import { IconType } from 'react-icons';

interface ButtonProps {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon, // Icon is a react component
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative w-full rounded-lg transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70
            ${outline ? 'bg-white' : 'bg-rose-500'}
            ${outline ? 'border-black' : 'border-rose-500'}
            ${outline ? 'text-black' : 'text-white'}
            ${small ? 'py-1' : 'py-3'}
            ${small ? 'text-sm' : 'text-md'}
            ${small ? 'border-[1px]' : 'border-2'}
        `}
        >
            {Icon && (
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2" />
            )}
            {label}
        </button>
    );
};

export default Button;
