import DatePicker from "react-datepicker";
import React, {useState} from "react";

import "react-datepicker/dist/react-datepicker.css";

export default function MyDatePicker(props) {
    const [startDate, setStartDate] = useState(new Date());

    const dateToMyDate = (date) => {
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    }

    return (
        <DatePicker selected={startDate} onChange={(date:Date) => {setStartDate(date); props.onChange(date); console.log(dateToMyDate(date));}}/>
    );
}