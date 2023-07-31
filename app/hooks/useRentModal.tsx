'use client';

import { create } from 'zustand';

interface RentModalProps {
    isOpen: boolean;
    onOpen: () => void; // function that opens the modal
    onClose: () => void; // function that closes the modal
}

// create a store to manage the state of the modal
const useRentModal = create<RentModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set(() => ({ isOpen: true })),
    onClose: () => set(() => ({ isOpen: false })),
}));
export default useRentModal;
