'use client';
import { useEffect } from 'react';
import EmptyState from './components/EmptyState';

interface errorProps {
    error: Error;
}

const ErrorState: React.FC<errorProps> = ({ error }) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <EmptyState
            title="Uh Oh!"
            subtitle="Something went wrong! Please try again."
        />
    );
};

export default ErrorState;
