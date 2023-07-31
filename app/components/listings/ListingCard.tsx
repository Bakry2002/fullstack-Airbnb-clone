'use client';

import { Listing, Reservation } from '@prisma/client';
import { SafeUser, safeListing } from '@/app/types';
//?next
import { useRouter } from 'next/navigation';
//?custom hooks
import useCountries from '@/app/hooks/useCountries';
import { useCallback, useMemo } from 'react';
//?date-fns
import { format } from 'date-fns';
import Image from 'next/image';
import HeartButton from '../HeartButton';
import Button from '../Button';

interface ListingCardProps {
    data: safeListing;
    reservations?: Reservation;
    onAction?: (id: string) => void;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
    disabled?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservations,
    onAction,
    actionId,
    actionLabel,
    currentUser,
    disabled,
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    // in our listing, we store the location as short code for the country (e.g. US, CA, etc.)
    // we need to convert that to the full name of the country, that why we use getByValue from our custom hook to access that country using that code provided in the listing data
    const location = getByValue(data.locationValue);

    // handle cancel to handle the cancelation of a reservation for example
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation(); // stop the event from bubbling up to the parent, meaning stop the event from triggering the onClick on the parent

            if (disabled) {
                return; // if the button is disabled, we don't want to do anything
            }

            onAction?.(actionId!); // if the button is not disabled, we call the onAction function that we passed in as a prop, and we pass in the actionId as an argument  to that function
            // the ! at the end of actionId is a typescript thing, it means that we are sure that actionId is not null or undefined, so we are telling typescript to trust us
        },
        [onAction, actionId, disabled],
    );

    // handle price for the reservation
    const price = useMemo(() => {
        if (reservations) {
            return reservations.totalPrice;
        }

        return data.price; // if there is no reservation, we return the price of the listing
    }, [reservations, data.price]);

    // reservation date
    const reservationDate = useMemo(() => {
        if (!reservations) {
            return null;
        }

        const start = new Date(reservations.startDate);
        const end = new Date(reservations.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    }, [reservations]);
    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="group col-span-1 cursor-pointer"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={data.imageSrc}
                    alt="Listings"
                    className="h-full w-full object-cover transition group-hover:scale-110"
                />
                <div className="absolute right-3 top-3">
                    <HeartButton
                        listingId={data.id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
            <div className="text-xl font-semibold">
                {location?.region}, {location?.label}
            </div>
            <div className="font-light text-neutral-500">
                {reservationDate || data.category}
            </div>
            <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">$ {price}</div>
                {!reservations && <div className="font-light">/night</div>}
            </div>
            {
                // if there is a reservation, we show the cancel button
                onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )
            }
        </div>
    );
};

export default ListingCard;
