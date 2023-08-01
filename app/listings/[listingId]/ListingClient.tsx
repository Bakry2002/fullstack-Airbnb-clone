'use client';

//?components
import Container from '@/app/components/Container';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import { categories } from '@/app/components/navbar/Categories';
import ListingReservation from '@/app/components/listings/ListingReservation';
//?custom hooks
import useLoginModal from '@/app/hooks/useLoginModal';
//? types
import { SafeReservation, SafeUser, safeListing } from '@/app/types';
import { Range } from 'react-date-range';
//? hooks
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
//? libraries
import {
    differenceInCalendarDays,
    differenceInDays,
    eachDayOfInterval,
} from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';

// this is the initial date range for the date picker
const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
};

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: safeListing & { user: SafeUser };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    currentUser,
    reservations = [],
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const loginModal = useLoginModal();
    const router = useRouter();

    // create the reservation
    const onCreateReservation = useCallback(() => {
        // check if user no logged in
        if (!currentUser) {
            loginModal.onOpen();
        }

        // set loading to true to show the loading skeleton if any 😬.
        setIsLoading(true);

        axios
            .post('/api/reservations', {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing?.id,
            })
            .then(() => {
                toast.success('Reservation Booked successfully 👍.');
                setDateRange(initialDateRange);
                router.push(`/trips`); // redirect the user to the trips page
                router.refresh(); // refresh the page to get the new reservation
            })
            .catch((err) => {
                toast.error(
                    "Something went wrong, couldn't book the listing 😬.",
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [totalPrice, dateRange, listing?.id, currentUser, loginModal, router]);

    // useEffect to calculate the total price when the user selects a date range
    // or when the price changes
    useEffect(() => {
        // if the user selects a date range
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate,
            );

            // if there is a range date and dayCount is been calculated, calculate the total price
            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                // if no, set the price as the default price for the listing
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    // disabled selected dates in the date picker
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];
        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                // what eachDayOfInterval does is it takes a date range and returns an array of dates
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            });
            dates = [...dates, ...range]; // add the range to the dates array
        });

        return dates;
    }, [reservations]);

    // get the category of the listing
    const category = useMemo(() => {
        return categories.find(
            (category) => category.label === listing.category,
        );
    }, [listing.category]);
    return (
        <Container>
            <div className="mx-auto max-w-screen-lg">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-7 md:gap-10">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            bathroomCount={listing.bathroomCount}
                            guestCount={listing.guestCount}
                            locationValue={listing.locationValue}
                        />
                        <div className="order-first mb-10 md:order-last md:col-span-3">
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                disabledDates={disabledDates}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ListingClient;
