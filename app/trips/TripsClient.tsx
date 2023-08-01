'use client';

import { useCallback, useState } from 'react';
import Container from '../components/Container';
import Heading from '../components/Heading';
import { SafeReservation, SafeUser } from '../types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import ListingCard from '../components/listings/ListingCard';

interface TripsClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    currentUser,
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    // cancel trip/reservation function
    const onCancel = useCallback(
        (id: string) => {
            // set the deleting id to the id of the reservation we want to delete
            setDeletingId(id);

            // delete the reservation by requesting the api
            axios
                .delete(`/api/reservations/${id}`)
                .then(() => {
                    toast.success('Reservation cancelled.');
                    router.refresh();
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.error); // get the error message from the api
                })
                .finally(() => {
                    // reset the deleting id
                    setDeletingId('');
                });
        },
        [router],
    );

    return (
        <Container>
            <Heading
                title="Trips"
                subtitle="Where you've been and where you're going"
            />
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id} // disable the button if the deleting id is the same as the reservation id
                        actionId={reservation.id}
                        actionLabel="Cancel reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
};

export default TripsClient;
