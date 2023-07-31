'use client';
import { IconType } from 'react-icons';
//?next
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
//?libraries
import qs from 'query-string'; // parse and stringify URL query strings, meaning you can easily work with URL query strings without having to parse them yourself.

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected,
}) => {
    const router = useRouter();
    const params = useSearchParams(); // returns a URLSearchParams object instance

    const handleClick = useCallback(() => {
        let currentQuery = {}; // its empty for now...

        // if there are any query params, parse them into an object
        if (params) {
            currentQuery = qs.parse(params.toString()); // parse the query string into an object
        }

        // update the query string, and add the category to it
        const updatedQuery: any = {
            ...currentQuery,
            category: label,
        };

        // reset the query string if the category is already selected to remove it, why we do that? because we want to toggle the category selection and choose another one
        // so if a query is selected and you click on it again, it will remove it from the query string, and reset to default without the category params, until you select another one
        if (params?.get('category') === label) {
            // if the category is already selected
            delete updatedQuery.category; // remove it from the query string
        }

        //  and then stringify the object into a query string
        const url = qs.stringifyUrl(
            {
                url: '/',
                query: updatedQuery,
            },
            { skipNull: true },
        ); // skipNull: true, means that if the value of the query param is null, it will be removed from the query string

        // push the new url to the router
        router.push(url);
    }, [label, params, router]);
    return (
        <div
            onClick={handleClick}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-b-2 p-3 transition ${
                selected
                    ? 'border-b-neutral-800 text-black'
                    : 'border-transparent text-black/60 hover:border-b-neutral-300 hover:text-black'
            }`}
        >
            <Icon size={26} />
            <div className="text-sm font-medium">{label}</div>
        </div>
    );
};

export default CategoryBox;
