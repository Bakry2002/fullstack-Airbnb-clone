'use client';

//?react hooks
import { useMemo, useState } from 'react';
//? components
import Modal from './Modal';
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
//?custom hooks
import useRentModal from '@/app/hooks/useRentModal';
//? libraries
import { FieldValues, SubmitHandler, set, useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
//?next
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// enum steps about how the modal will be rendered for the user
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

interface RentModalProps {}

const RentModal: React.FC<RentModalProps> = ({}) => {
    const [isLoading, setIsLoading] = useState(false); // if the form is loading, we will show a spinner
    const [step, setStep] = useState(STEPS.CATEGORY); // the initial step is the first one [0]
    const rentModal = useRentModal();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: '',
            title: '',
            description: '',
        },
    });

    // watch for changes in the category, location inputs, why? because we want to know when the user selects a category
    // and the selected category will be the value of the input and in the selected props of the CategoryInput
    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const ImageSrc = watch('imageSrc');

    // what this useMemo does is that it will import the map component dynamically, meaning that it will only be imported when the user is on the location step, why? because we don't want to load the map component when the user is not on the location step
    const Map = useMemo(
        () =>
            dynamic(() => import('../Map'), {
                ssr: false, // we don't want to render the map component on the server side
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location],
    );

    // set the values of the inputs, because we are using a custom input, we need to set the value manually
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true, // validate the input
            shouldDirty: true, // mark the input as dirty, which means the user has interacted with it
            shouldTouch: true, // mark the input as touched
        });
    };

    // go back to the previous step
    const onBack = () => {
        setStep((value) => value - 1);
    };

    // go to the next step
    const onNext = () => {
        setStep((value) => value + 1);
    };

    // when the user submits the form
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        // check if the user has reach the last step, if not go to the next step
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        // create post request to create a new listing
        axios
            .post('/api/listings', data)
            .then(() => {
                toast.success('Listing created!');
                router.refresh(); // refresh the page
                reset(); // reset the form
                setStep(STEPS.CATEGORY); // reset the steps and go back to the first step
                rentModal.onClose(); // close the modal
            })
            .catch(() => {
                toast.error('Something went wrong.');
            })
            .finally(() => {
                setIsLoading(false); // stop the loading
            });
    };

    // create our action label
    const actionLabel = useMemo(() => {
        //? why useMemo? because we don't want to re-render the component every time the step changes
        // if we are on the last step, the label will be 'Create'
        if (step === STEPS.PRICE) return 'Create';

        return 'Next'; // otherwise, the label will be 'Next'
    }, [step]);

    // create our secondary action label
    const secondaryActionLabel = useMemo(() => {
        // if we are on the first step, there will be no back option, so we return undefined
        if (step === STEPS.CATEGORY) return undefined;

        return 'Back'; // otherwise, the label will be 'Back'
    }, [step]);

    // create the body of the modal, depending on the step so it will be dynamic
    // First step
    let bodyContent: any = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
                {/* Category */}
                {categories.map((categoryItem) => (
                    <div key={categoryItem.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) =>
                                setCustomValue('category', category)
                            }
                            selected={category === categoryItem.label}
                            label={categoryItem.label}
                            icon={categoryItem.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    // Second step
    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Where's your place located?"
                    subtitle="Help guests find you!"
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)} // when the user selects a country, we set the value of the input
                />
                <Map center={location?.latlng} />
            </div>
        );
    }

    // Third step
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amenities do you have?"
                />
                <Counter
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        );
    }

    // Fourth step
    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                />
                <ImageUpload
                    value={ImageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        );
    }

    // Fifth step
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe you place?"
                    subtitle="Short and sweet works best!"
                />
                <Input
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    errors={errors}
                    register={register}
                    required
                />
                <hr />
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    errors={errors}
                    register={register}
                    required
                />
            </div>
        );
    }

    // last step
    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Now, set your price"
                    subtitle="How much do you want to charge per night?"
                />
                <Input
                    id="price"
                    label="Price"
                    disabled={isLoading}
                    errors={errors}
                    type="number"
                    register={register}
                    required
                    formatPrice
                />
            </div>
        );
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            title="Airbnb your home!"
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack} // if we are on the first step, there will be no back option
            body={bodyContent}
        />
    );
};

export default RentModal;
