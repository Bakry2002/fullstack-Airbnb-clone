'use client';

//? libraries
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
//? react hooks
import {} from 'react';
//? icons
import { BiDollar } from 'react-icons/bi';

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    register: UseFormRegister<FieldValues>; // register function from react-hook-form
    required?: boolean;
    errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    type,
    disabled,
    formatPrice,
    register,
    required,
    errors,
}) => {
    return (
        <div className="relative w-full">
            {formatPrice && (
                <BiDollar
                    size={24}
                    className="absolute left-2 top-5 text-neutral-700"
                />
            )}
            <input
                id={id}
                type={type}
                disabled={disabled}
                {...register(id, { required })} // register the input with the register function from react-hook-form
                placeholder=" " // empty for now to make cool animation 😁!
                className={`peer mt-[2px] w-full rounded-md border-2 bg-white p-4 pb-2 pt-6 font-light outline-none transition disabled:cursor-not-allowed disabled:opacity-70
                    ${formatPrice ? 'pl-9' : 'pl-4'}
                    ${errors[id] ? 'border-red-500' : 'border-neutral-300'}
                    ${
                        errors[id]
                            ? 'focus:border-red-500'
                            : 'focus:border-black'
                    }
                `}
            />
            <label
                className={`text-md absolute top-5 z-10 origin-[0] -translate-y-3 transform duration-150 
                ${formatPrice ? 'left-9' : 'left-4'}  
                peer-placeholder-shown:translate-y-0 
                peer-placeholder-shown:scale-100 
                peer-focus:mb-2
                peer-focus:-translate-y-4 
                peer-focus:scale-75
                ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
                `}
            >
                {label}
            </label>
        </div>
    );
};

export default Input;
