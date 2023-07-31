import countries from 'world-countries';

const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flagName: country.cca2.toLowerCase(),
    latlng: country.latlng, // stands for latitude and longitude
    region: country.region,
}));

const useCountries = () => {
    const getAll = () => formattedCountries; // return all countries

    const getByValue = (value: string) => {
        // return the country that matches the value
        return formattedCountries.find((item) => item.value === value);
    };

    return {
        getAll,
        getByValue,
    };
};

export default useCountries;
