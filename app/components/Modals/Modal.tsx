'use client';

import { useState, useEffect, useCallback } from 'react';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void; // function that closes the modal
    onSubmit: () => void; // function that submits the modal
    title?: string; // title of the modal
    body?: string; // body of the modal
    footer?: string; // footer of the modal
    actionLabel: string; // label of the action button
    disabled?: boolean; // disable the action button
    secondaryAction?: () => void; // function that handles the secondary action
    secondaryActionLabel?: string; // label of the secondary action button
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel,
}) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    // close the modal when the user clicks on the overlay
    const handleClose = useCallback(() => {
        if (disabled) return; // if its already disabled, do not close the modal

        setShowModal(false);
        setTimeout(() => {
            onClose(); // close the modal after 300ms, why? because of the animation
        }, 300);
    }, [disabled, onClose]);

    // submit the modal when the user clicks on the action button
    const handleSubmit = useCallback(() => {
        if (disabled) return; // if its already disabled, do not submit the modal

        onSubmit();
    }, [disabled, onSubmit]);

    // handle the secondary action
    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) return; // if its already disabled or if there is no secondary action, do nothing

        secondaryAction();
    }, [disabled, secondaryAction]);

    if (!isOpen) return null; // if the modal is not open, do not render anything

    return (
        <>
            <div
                className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    overflow-y-auto
                    overflow-x-hidden
                    bg-neutral-800/70
                    focus:outline-none
                "
            >
                <div
                    className="
                        relative
                        mx-auto
                        my-6
                        h-full
                        w-full
                        md:h-auto
                        md:w-4/6
                        lg:h-auto
                        lg:w-3/6
                        xl:w-2/5
                    "
                >
                    {/* Content */}
                    <div
                        className={`
                            translate
                            h-full
                            duration-300
                            ${showModal ? 'translate-y-0' : 'translate-y-full'}
                            ${showModal ? 'opacity-100' : 'opacity-0'}
                            `}
                    >
                        <div
                            className="
                                translate
                                relative
                                flex
                                h-full
                                w-full
                                flex-col
                                rounded-lg
                                border-0
                                bg-white
                                shadow-lg
                                outline-none
                                focus:outline-none
                                md:h-auto
                                lg:h-auto
                            "
                        >
                            {/* Header */}
                            <div className="relative flex items-center justify-center rounded-t border-b p-6">
                                <button
                                    onClick={handleClose}
                                    className="absolute left-9 border-0 p-1 transition hover:opacity-70"
                                >
                                    <IoMdClose size={18} />
                                </button>
                                <div className="text-lg font-bold">{title}</div>
                            </div>
                            {/* Body */}
                            <div className="relative flex-auto p-6">{body}</div>
                            {/* Footer */}
                            <div className="flex flex-col gap-2 p-6">
                                <div className="flex w-full flex-row items-center gap-4">
                                    {secondaryAction &&
                                        secondaryActionLabel && (
                                            <Button
                                                outline
                                                label={secondaryActionLabel}
                                                onClick={handleSecondaryAction}
                                                disabled={disabled}
                                            />
                                        )}
                                    <Button
                                        label={actionLabel}
                                        onClick={handleSubmit}
                                        disabled={disabled}
                                    />
                                </div>
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
