'use client';

//?react hooks
import { useCallback, useState } from 'react';
//?libraries
import axios from 'axios';
//?components
import Heading from '../components/Heading';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';
//? types
import { SafeReservation, SafeUser } from '../types';
//?next
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ReservationsClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser,
}) => {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState('');

    // cancel reservation function
    const onCancel = useCallback(
        (id: string) => {
            setDeleteId(id);

            axios
                .delete(`/api/reservations/${id}`)
                .then(() => {
                    toast.success('Reservation cancelled.');
                    router.refresh();
                })
                .catch((error) => {
                    toast.error('Something went wrong.');
                })
                .finally(() => {
                    setDeleteId('');
                });
        },
        [router],
    );

    return (
        <Container>
            <Heading
                title="Reservations"
                subtitle="Booking on your properties"
            />
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        onAction={onCancel}
                        actionId={reservation.id}
                        actionLabel="Cancel guest reservation"
                        disabled={deleteId === reservation.id}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
};

export default ReservationsClient;
