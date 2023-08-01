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
//? custom hooks
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
//? components
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
//? next-auth
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    // form controller
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true); // set loading state to true

        axios
            .post('/api/register', data) // send a post request to the server with the form data
            .then(() => {
                toast.success('Registered successfully!');
                registerModal.onClose(); // close the modal after the request is successful
                loginModal.onOpen(); // open the login modal
            })
            .catch((err) => {
                toast.error('Something went wrong!'); // show an error toast if the request failed
            })
            .finally(() => {
                setIsLoading(false); // set loading state to false after the request is done
            });
    };

    // toggle between login and register modals
    const toggleModals = useCallback(() => {
        registerModal.onClose(); // close the login modal
        loginModal.onOpen(); // open the register modal
    }, [loginModal, registerModal]);

    // body of the modal
    const bodyContent: any = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to a Airbnb"
                subtitle="Create an account!"
            />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                required
                errors={errors}
            />
            <Input
                id="name"
                label="Name"
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
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            {/* <Button
                outline
                label="Continue with Facebook"
                icon={AiFillFacebook}
                onClick={() => signIn('facebook')}
            /> */}
            <div className="mt-4 font-light text-neutral-500">
                <div className="flex flex-row items-center justify-center gap-2 text-center">
                    <div>Already have an account?</div>
                    <div
                        onClick={toggleModals}
                        className="cursor-pointer text-neutral-800 hover:underline"
                    >
                        Log in
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading} // disable the modal if the request is loading, to prevent multiple requests
            isOpen={registerModal.isOpen} // open the modal if the state of the modal is true, which exists in the store
            onClose={registerModal.onClose} // close the modal if the state of the modal is false, which exists in the store
            title="Register" // title of the modal
            actionLabel="Continue" // label of the submit button
            onSubmit={handleSubmit(onSubmit)} // submit the form if the form is valid
            body={bodyContent} // body of the modal
            footer={footerContent} // footer of the modal
        />
    );
};

export default RegisterModal;
