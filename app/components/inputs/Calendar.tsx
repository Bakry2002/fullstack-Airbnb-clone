'use client';

import { DateRange, Range, RangeKeyDict } from 'react-date-range';

//? react-date-range styles
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface CalendarProps {
    value: Range;
    onChange: (value: RangeKeyDict) => void;
    disabledDates: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    disabledDates,
}) => {
    return (
        <DateRange
            rangeColors={['#262626']}
            ranges={[value]}
            date={new Date()}
            onChange={onChange}
            direction="vertical"
            showDateDisplay={false} // hide the date display at the top
            minDate={new Date()} // disable past dates
            disabledDates={disabledDates} // disable dates that are already reserved
        />
    );
};

export default Calendar;
