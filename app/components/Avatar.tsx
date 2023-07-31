'use client';

import Image from 'next/image';

interface AvatarProps {
    src: string | null | undefined | any;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src || '/images/placeholder.jpg'}
            alt="profile Avatar"
            width={30}
            height={30}
            className="rounded-full"
        />
    );
};
export default Avatar;
