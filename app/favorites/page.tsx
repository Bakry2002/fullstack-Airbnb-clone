//?components
import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';
//? actions
import getCurrentUser from '../actions/getCurrentUser';
import getFavoriteListings from '../actions/getFavoriteListings';
import FavoritesClient from './FavoritesClient';

const page = async () => {
    const currentUser = await getCurrentUser();
    const favoriteListings = await getFavoriteListings();

    if (favoriteListings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You don't have any favorites yet"
                    subtitle='When you find a place you like - click the "heart" icon to save it here.'
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <FavoritesClient
                favoriteListings={favoriteListings}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default page;
