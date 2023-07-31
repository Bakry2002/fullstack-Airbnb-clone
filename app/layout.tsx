import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

//? components
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import Modal from './components/Modals/Modal';
import RegisterModal from './components/Modals/RegisterModal';
import ToastProvider from './providers/ToastProvider';
import LoginModal from './components/Modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';
import RentModal from './components/Modals/RentModal';

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
