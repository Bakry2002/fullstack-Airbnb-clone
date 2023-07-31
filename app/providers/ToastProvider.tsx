'use client';

//? libraries
import { Toaster } from 'react-hot-toast';

// this is a toast provider, it will be used to show toasts in the app
const ToastProvider = () => {
    return <Toaster />;
};
export default ToastProvider;

//! important note:
// why use provider instead of just importing the component?
// because we want to use the toast component in the server side as well, and we can't import react-hot-toast in the server side,
// and in our case we use next.js version 13 app router which supports server side rendering
// so we need to use a provider to wrap the app with it as most of the libraries works in client side only.
