//?components
import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';
//? actions
import getCurrentUser from '../actions/getCurrentUser';
import getReservations from '../actions/getReservations';
import ReservationsClient from './ReservationsClient';

interface pageProps {}

const page: React.FC<pageProps> = async ({}) => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You aren't signed in."
                    subtitle="Sign in to see your reservations."
                />
            </ClientOnly>
        );
    }

    // we want to list all reservations that other user have made on my listings.
    const reservations = await getReservations({
        authorId: currentUser.id,
    });

    // if there is no reservations, we want to show an empty state.
    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="You don't have any reservations."
                    subtitle="Once you make a reservations on your properties, it will show up here."
                />
            </ClientOnly>
        );
    }
    return (
        <ClientOnly>
            <ReservationsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default page;
