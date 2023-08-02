'use client';

import useSearchModal from '@/app/hooks/useSearchModal';
import Modal from './Modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import dynamic from 'next/dynamic';
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect';
import qs from 'query-string';
import { formatISO, set } from 'date-fns';
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal(); // use the store

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION); // initiate with the first step
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    // import our map dynamically
    const Map = useMemo(
        () =>
            dynamic(() => import('../Map'), {
                ssr: false,
            }),
        [location],
    );

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(() => {
        // check if we are not on the last step
        if (step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString()); // parse the query string to an object
        }

        const updatedQuery: any = {
            ...currentQuery, // spread the current query
            locationValue: location?.value, // add the location
            guestCount, // add the guest count
            roomCount, // add the room count
            bathroomCount, // add the bathroom count
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate); // format the date to string and add the start date
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate); // format the date to string add the end date
        }

        // final url
        const url = qs.stringifyUrl(
            {
                url: '/',
                query: updatedQuery,
            },
            { skipNull: true },
        );

        setStep(STEPS.LOCATION); // reset the step
        searchModal.onClose(); // close the modal
        router.push(url); // push the url to the router, to apply all the filters selected.
    }, [
        step,
        searchModal,
        location,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        onNext,
        router,
        params,
    ]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        }
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }
        return 'Back';
    }, [step]);

    // body content for each step:-
    // first step
    let bodyContent: any = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Where do you want to go?"
                subtitle="Find the perfect location"
            />
            <CountrySelect
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    );

    // second steps
    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="When do you plan to go?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        );
    }

    // third step
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="More information"
                    subtitle="Make sure everyone is comfortable!"
                />
                <Counter
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        );
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            body={bodyContent}
        />
    );
};

export default SearchModal;
