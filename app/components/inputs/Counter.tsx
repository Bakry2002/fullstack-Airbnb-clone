'use client';

import { useCallback } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

interface CounterProps {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void; // this function will be called when the user changes the value of the counter
}

const Counter: React.FC<CounterProps> = ({
    title,
    subtitle,
    value,
    onChange,
}) => {
    // setup the add counter function
    const onAdd = useCallback(() => {
        onChange(value + 1);
    }, [value, onChange]);

    //setup the reduce counter function
    const onReduce = useCallback(() => {
        // check if the counter is already hits 1, no negative value allowed 😅
        if (value === 1) return;
        onChange(value - 1);
    }, [value, onChange]);

    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <div className="font-medium">{title}</div>
                <div className="text-gary-600 font-light">{subtitle}</div>
            </div>
            <div className="flex flex-row items-center gap-4">
                {/* Reduce button */}
                <div
                    onClick={onReduce}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-neutral-400 text-neutral-600 transition hover:opacity-80 "
                >
                    <AiOutlineMinus />
                </div>
                {/* Counter value */}
                <div className="text-xl font-light text-neutral-600">
                    {value}
                </div>
                {/* Add button */}
                <div
                    onClick={onAdd}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-neutral-400 text-neutral-600 transition hover:opacity-80 "
                >
                    <AiOutlinePlus />
                </div>
            </div>
        </div>
    );
};

export default Counter;
