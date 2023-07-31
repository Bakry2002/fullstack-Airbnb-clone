'use client';

//? icons
import { AiOutlineMenu } from 'react-icons/ai';
//? components
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
//? hooks
import { useState, useCallback } from 'react';
//? custom hooks
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
//? nex-auth
import { signOut } from 'next-auth/react';
//? types
import { SafeUser } from '@/app/types';
import useRentModal from '@/app/hooks/useRentModal';

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);

    const registerModal = useRegisterModal(); // get the register modal from the store, to observe the state of the modal
    const loginModal = useLoginModal(); // get the login modal from the store, to observe the state of the modal
    const rentModal = useRentModal(); // get the rent modal from the store, to observe the state of the modal

    // toggle menu using callback to prevent re-rendering of the component
    const toggleMenu = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    // Rent modal, but first we need to check if the user is logged in
    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        // open rent modal
        rentModal.onOpen(); // open the rent modal
    }, [currentUser, loginModal, rentModal]);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="hidden cursor-pointer rounded-full px-4 py-3 text-sm font-semibold transition hover:bg-neutral-100 md:block"
                >
                    Airbnb your home
                </div>
                {/* user menu */}
                <div
                    onClick={toggleMenu}
                    className="flex cursor-pointer items-center gap-3 rounded-full border border-neutral-200 p-4 transition hover:shadow-md md:px-2 md:py-1"
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image} />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white text-sm shadow-md md:w-3/4">
                    <div className="flex cursor-pointer flex-col">
                        {currentUser ? (
                            <>
                                <MenuItem onClick={() => {}} label="My trips" />
                                <MenuItem
                                    onClick={() => {}}
                                    label="My favorites"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    label="My reservations"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    label="My properties"
                                />
                                <MenuItem
                                    onClick={rentModal.onOpen}
                                    label="Airbnb my home"
                                />
                                <hr />
                                <MenuItem
                                    onClick={() => signOut()}
                                    label="Logout"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={loginModal.onOpen}
                                    label="Log in"
                                />
                                <MenuItem
                                    onClick={registerModal.onOpen}
                                    label="Sign up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
