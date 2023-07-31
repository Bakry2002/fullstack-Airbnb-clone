'use client';

//? custom hooks
import useCountries from '@/app/hooks/useCountries';
//? types
import { SafeUser } from '@/app/types';
import { Listing } from '@prisma/client';
import { IconType } from 'react-icons';
//? components
import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';
const Map = dynamic(() => import('../Map'), { ssr: false });
//? next
import dynamic from 'next/dynamic';

interface ListingInfoProps {
    user: SafeUser;
    category:
        | { icon: IconType; label: string; description: string }
        | undefined;
    description: string;
    roomCount: number;
    bathroomCount: number;
    guestCount: number;
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    category,
    description,
    locationValue,
    roomCount,
    bathroomCount,
    guestCount,
}) => {
    // get location coordinates
    const { getByValue } = useCountries();
    const coordinates = getByValue(locationValue)?.latlng;

    return (
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2 text-lg font-semibold">
                    <div>Hosted by {user?.name}</div>
                    <Avatar src={user?.image} />
                </div>
                <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                    <div>{guestCount} guests</div>
                    <div>{roomCount} rooms</div>
                    <div>{bathroomCount} bathrooms</div>
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <hr />
            <Map center={coordinates} />
        </div>
    );
};

export default ListingInfo;
