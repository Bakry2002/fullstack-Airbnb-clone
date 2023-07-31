'use client';

//?libraries
import { CldUploadWidget } from 'next-cloudinary';
//?next
import Image from 'next/image';
//?react hooks
import { useCallback } from 'react';
//?icons
import { TbPhotoPlus } from 'react-icons/tb';

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
    const handleUpload = useCallback((result: any) => {
        onChange(result.info.secure_url); // set the value of the input to the secure_url of the image, coming from cloudinary
    }, []);
    return (
        <CldUploadWidget
            onUpload={handleUpload}
            uploadPreset="g9okbcix"
            options={{
                maxFiles: 1, // the user can only upload one image
            }}
        >
            {({ open }) => {
                return (
                    <div
                        onClick={() => open?.()} // open the upload widget when the user clicks on the div
                        className="relative flex cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed border-neutral-300 p-20 text-neutral-600 transition hover:opacity-70"
                    >
                        <TbPhotoPlus size={50} />
                        <div className="text-xl font-semibold">
                            Click to upload
                        </div>
                        {value && (
                            <div className="absolute inset-0 h-full w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    loading="lazy"
                                    src={value}
                                    style={{ objectFit: 'cover' }}
                                    alt="uploaded image"
                                />
                            </div>
                        )}
                    </div>
                );
            }}
        </CldUploadWidget>
    );
};

export default ImageUpload;
