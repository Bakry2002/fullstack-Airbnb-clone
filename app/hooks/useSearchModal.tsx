'use client';

import { create } from 'zustand';

interface SearchModalProps {
    isOpen: boolean;
    onOpen: () => void; // function that opens the modal
    onClose: () => void; // function that closes the modal
}

// create a store to manage the state of the modal
const useSearchModal = create<SearchModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set(() => ({ isOpen: true })),
    onClose: () => set(() => ({ isOpen: false })),
}));
export default useSearchModal;
