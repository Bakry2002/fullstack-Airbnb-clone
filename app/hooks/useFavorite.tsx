import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';
import useLoginModal from './useLoginModal';

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    // check if the user has favored the listing, why in useMemo? because we don't want to run this function every time the component re-renders so we wrap it in useMemo to only run it when the listingId changes
    const hasFavored = useMemo(() => {
        const list = currentUser?.favoritesIds || []; // get the list of favorites from the user

        return list.includes(listingId); // check if the listingId is in the list
    }, [currentUser, listingId]);

    // toggle the favorite status of the listing
    const toggleFavorite = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation(); // stop the event from bubbling up to the parent element

            if (!currentUser) {
                return loginModal.onOpen(); // if the user is not logged in, open the login modal
            }

            // create the request to add or delete the favorite
            try {
                let request;

                if (hasFavored) {
                    request = () => axios.delete(`/api/favorites/${listingId}`); // if the user has favored the listing, delete the favorite
                } else {
                    request = () => axios.post(`/api/favorites/${listingId}`); // if the user has not favored the listing, add the favorite
                }

                await request(); // send the request
                router.refresh(); // refresh the page
                toast.success('success'); // display a success message
            } catch (error) {
                toast.error('Something went wrong.'); // display an error message
            }
        },
        [currentUser, listingId, loginModal, router, hasFavored],
    );

    return { hasFavored, toggleFavorite };
};

export default useFavorite;
