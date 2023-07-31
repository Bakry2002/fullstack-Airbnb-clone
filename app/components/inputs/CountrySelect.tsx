'use client';

//? custom hooks
import useCountries from '@/app/hooks/useCountries';
import Image from 'next/image';
//? libraries
import Select from 'react-select';

export type CountrySelectValue = {
    flag: string;
    label: string;
    value: string;
    latlng: number[];
    region: string;
};

interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void; // the onChange function will be called when the user selects a country
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const { getAll } = useCountries(); // get all countries
    console.log(getAll());
    return (
        <Select
            placeholder="Anywhere"
            isClearable // allow the user to clear the input
            options={getAll()} // pass the countries to the options prop
            value={value} // pass the value to the value prop
            onChange={(value) => onChange(value as CountrySelectValue)} // call the onChange function when the user selects a country
            formatOptionLabel={(option: any) => (
                <div className="flex flex-row items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`https://flagcdn.com/40x30/${option.flagName}.png`}
                        width="20"
                        height="20"
                        alt={option.label}
                        loading="lazy"
                    />
                    <div>
                        {option.label},
                        <span className="ml-1 text-neutral-500">
                            {option.region}
                        </span>
                    </div>
                </div>
            )}
            classNames={{
                control: () => 'p-3 border-2',
                input: () => 'text-lg',
                option: () => 'text-lg',
            }}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                    ...theme.colors,
                    primary: 'black', // the border color when the input is focused
                    primary25: '#ffe4e6', // the background color when the input is focused
                },
            })}
        />
    );
};

export default CountrySelect;
