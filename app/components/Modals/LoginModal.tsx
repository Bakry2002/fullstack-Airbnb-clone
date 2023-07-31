'use client';

//? hooks
import { useState, useCallback } from 'react';
//? icons
import { AiFillGithub, AiFillFacebook } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
//? libraries
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
//? components
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
//? custom hooks
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
//? next-auth
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // form controller
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true); // set loading state to true

        signIn('credentials', {
            ...data, // pass the data to the credentials provider
            redirect: false, // prevent next-auth from redirecting the user
        }).then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Logged in successfully!'); // show toast notification
                router.refresh(); // refresh the page, which makes next-auth redirect the user to the home page
                loginModal.onClose(); // close the modal
            }

            // if there is an error in the callback
            if (callback?.error) {
                toast.error(callback.error); // show toast notification
            }
        });
    };

    // toggle between login and register modals
    const toggleModals = useCallback(() => {
        loginModal.onClose(); // close the login modal
        registerModal.onOpen(); // open the register modal
    }, [loginModal, registerModal]);

    // body of the modal
    const bodyContent: any = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome Back!" subtitle="Log in to your account" />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                required
                errors={errors}
            />
            <Input
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                required
                errors={errors}
            />
        </div>
    );

    // footer of the modal
    const footerContent: any = (
        <div className="mt-3 flex flex-col gap-4">
            <span className='relative text-neutral-700 before:absolute before:-top-3 before:left-1/2 before:z-10 before:flex before:w-10 before:-translate-x-1/2 before:items-center before:justify-center before:bg-white before:content-["or"]'>
                <hr />
            </span>
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                disabled={isLoading}
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                disabled={isLoading}
                onClick={() => signIn('github')}
            />
            {/* <Button
                outline
                label="Continue with Facebook"
                icon={AiFillFacebook}
                disabled={isLoading}
                onClick={() => signIn('facebook')}
            /> */}
            <div className="mt-4 font-light text-neutral-500">
                <div className="flex flex-row items-center justify-center gap-2 text-center">
                    <div>First time using Airbnb?</div>
                    <div
                        onClick={toggleModals}
                        className="cursor-pointer text-neutral-800 hover:underline"
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading} // disable the modal if the request is loading, to prevent multiple requests
            isOpen={loginModal.isOpen} // open the modal if the state of the modal is true, which exists in the store
            onClose={loginModal.onClose} // close the modal if the state of the modal is false, which exists in the store
            title="Log in" // title of the modal
            actionLabel="Continue" // label of the submit button
            onSubmit={handleSubmit(onSubmit)} // submit the form if the form is valid
            body={bodyContent} // body of the modal
            footer={footerContent} // footer of the modal
        />
    );
};

export default LoginModal;
