import { DatePickerProps } from "antd/lib";
import { DatePicker as AntdDatePicker } from "antd";

const DatePicker=(props:DatePickerProps)=>{
    return <AntdDatePicker className="common-input" {...props}/>
}

export default DatePicker;