'use client';

import useCountries from '@/app/hooks/useCountries';
import useSearchModal from '@/app/hooks/useSearchModal';
import { differenceInDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';

const Search = () => {
    const searchModal = useSearchModal(); // use the store
    const params = useSearchParams();
    const { getByValue } = useCountries();

    // get individual params
    const locationValue = params?.get('locationValue');
    const startDate = params?.get('startDate');
    const endDate = params?.get('endDate');
    const guestCount = params?.get('guestCount');

    const locationLabel = useMemo(() => {
        if (locationValue) {
            return getByValue(locationValue as string)?.label;
        }
        return 'Anywhere';
    }, [getByValue, locationValue]);

    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1;
            }

            return `${diff} day${diff > 1 ? 's' : ''}`;
        }
        return 'Any Week';
    }, [startDate, endDate]);

    const guestLabel = useMemo(() => {
        if (guestCount) {
            return `${guestCount} guest${+guestCount > 1 ? 's' : ''}`;
        }
        return 'Add Guests';
    }, [guestCount]);
    return (
        <div
            onClick={searchModal.onOpen}
            className="w-full cursor-pointer rounded-full border py-2 shadow-sm transition md:w-auto"
        >
            <div className="flex flex-row items-center justify-between">
                <div className="px-6 text-sm font-semibold">
                    {locationLabel}
                </div>
                <div className="hidden flex-1 border-x px-6 text-center text-sm font-semibold sm:block">
                    {durationLabel}
                </div>
                <div className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
                    <div className="hidden sm:block">{guestLabel}</div>
                    <div className="rounded-full bg-rose-500 p-2 text-white">
                        <BiSearch size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
