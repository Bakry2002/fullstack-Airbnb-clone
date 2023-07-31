'use client';

import { create } from 'zustand';

interface LoginModalProps {
    isOpen: boolean;
    onOpen: () => void; // function that opens the modal
    onClose: () => void; // function that closes the modal
}

// create a store to manage the state of the modal
const useLoginModal = create<LoginModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set(() => ({ isOpen: true })),
    onClose: () => set(() => ({ isOpen: false })),
}));
export default useLoginModal;
