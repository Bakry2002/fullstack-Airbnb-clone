import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

//? components
import Navbar from './components/navbar/Navbar';
//? Modals
import RegisterModal from './components/Modals/RegisterModal';
import LoginModal from './components/Modals/LoginModal';
import RentModal from './components/Modals/RentModal';
import SearchModal from './components/Modals/SearchModal';
//? providers
import ToastProvider from './providers/ToastProvider';
import ClientOnly from './components/ClientOnly';
//?actions
import getCurrentUser from './actions/getCurrentUser';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Vacation Homes & Condo Rentals - Airbnb Clone',
    description:
        'Vacation Rentals, Cabins, Beach Houses, Unique Homes & Experiences',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();
    return (
        <html lang="en">
            <body className={nunito.className}>
                <ClientOnly>
                    <ToastProvider />
                    <SearchModal />
                    <LoginModal />
                    <RegisterModal />
                    <RentModal />
                    <Navbar currentUser={currentUser} />
                </ClientOnly>
                <div className="pb-20 pt-28">{children}</div>
            </body>
        </html>
    );
}
