'use client';

import useCountries from '@/app/hooks/useCountries';
import { SafeUser } from '@/app/types';
import Heading from '../Heading';

interface ListingHeadProps {
    title: string;
    imageSrc: string;
    locationValue: string;
    id: string;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    imageSrc,
    locationValue,
    id,
    currentUser,
}) => {
    const { getByValue } = useCountries(); // get country name by value
    const location = getByValue(locationValue);

    return (
        <>
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.label}`}
            />
            <div className="relative h-[60hv] w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt="Image"
                    className="w-full object-cover"
                />
            </div>
        </>
    );
};

export default ListingHead;
