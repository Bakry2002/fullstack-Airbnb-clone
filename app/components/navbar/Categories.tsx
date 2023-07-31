'use client';

//?components
import Container from '../Container';
//? icons
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import {
    GiBarn,
    GiBoatFishing,
    GiCactus,
    GiCastle,
    GiCaveEntrance,
    GiForestCamp,
    GiIsland,
    GiWindmill,
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';
//? components
import CategoryBox from './CategoryBox';
//?next
import { useSearchParams, usePathname } from 'next/navigation';

export const categories = [
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'This property is close to the beach!',
    },
    {
        label: 'Windmills',
        icon: GiWindmill,
        description: 'This property is has windmills!',
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'This property is modern!',
    },
    {
        label: 'Countryside',
        icon: TbMountain,
        description: 'This property is in the countryside!',
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'This is property has a beautiful pool!',
    },
    {
        label: 'Islands',
        icon: GiIsland,
        description: 'This property is on an island!',
    },
    {
        label: 'Lake',
        icon: GiBoatFishing,
        description: 'This property is near a lake!',
    },
    {
        label: 'Skiing',
        icon: FaSkiing,
        description: 'This property has skiing activies!',
    },
    {
        label: 'Castles',
        icon: GiCastle,
        description: 'This property is an ancient castle!',
    },
    {
        label: 'Caves',
        icon: GiCaveEntrance,
        description: 'This property is in a spooky cave!',
    },
    {
        label: 'Camping',
        icon: GiForestCamp,
        description: 'This property offers camping activities!',
    },
    {
        label: 'Arctic',
        icon: BsSnow,
        description: 'This property is in arctic environment!',
    },
    {
        label: 'Desert',
        icon: GiCactus,
        description: 'This property is in the desert!',
    },
    {
        label: 'Barns',
        icon: GiBarn,
        description: 'This property is in a barn!',
    },
    {
        label: 'Lux',
        icon: IoDiamond,
        description: 'This property is brand new and luxurious!',
    },
];
const Categories = () => {
    const params = useSearchParams(); // returns a URLSearchParams object instanc
    // extract the category from the query string
    const category = params?.get('category');

    // limit the pathname to only see the params on the home page, not in other pages like favorites, etc...
    const pathname = usePathname();
    const isMainPage = pathname === '/';
    if (!isMainPage) {
        return null; // if we are not on the home page, don't show the categories
    }

    return (
        <Container>
            <div className="flex flex-row items-center justify-between overflow-x-auto pt-4">
                {categories.map((categoryItem) => (
                    <CategoryBox
                        key={categoryItem.label}
                        label={categoryItem.label}
                        icon={categoryItem.icon}
                        selected={category === categoryItem.label} // if the category is selected, then pass true, otherwise pass false
                    />
                ))}
            </div>
        </Container>
    );
};

export default Categories;
