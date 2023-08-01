//?components
import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';
//? actions
import getCurrentUser from '../actions/getCurrentUser';
import getReservations from '../actions/getReservations';
import getListings from '../actions/getListings';
import PropertiesClient from './PropertiesClient';

const page = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You aren't signed in."
                    subtitle="Sign in to see your properties."
                />
            </ClientOnly>
        );
    }

    const listings = await getListings({
        userId: currentUser.id,
    });

    // if there is no properties, we want to show an empty state.
    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You don't have any properties."
                    subtitle="Once you create a property, it will show up here."
                />
            </ClientOnly>
        );
    }
    return (
        <ClientOnly>
            <PropertiesClient listings={listings} currentUser={currentUser} />
        </ClientOnly>
    );
};

export default page;
