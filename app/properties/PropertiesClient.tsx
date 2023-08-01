'use client';

import { useRouter } from 'next/navigation';
import { SafeUser, safeListing } from '../types';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Container from '../components/Container';
import Heading from '../components/Heading';
import ListingCard from '../components/listings/ListingCard';

interface PropertiesClientProps {
    listings: safeListing[];
    currentUser: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
    listings,
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
                .delete(`/api/listings/${id}`)
                .then(() => {
                    toast.success('Listings Deleted.');
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
            <Heading title="Properties" subtitle="List of your properties" />
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                        onAction={onCancel}
                        disabled={deletingId === listing.id} // disable the button if the deleting id is the same as the listing id
                        actionId={listing.id}
                        actionLabel="Delete Property"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
};

export default PropertiesClient;
