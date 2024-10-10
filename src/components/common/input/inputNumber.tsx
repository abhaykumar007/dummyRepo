import { InputNumberProps } from "antd/lib";
import { InputNumber as AntdInputNumber } from "antd";

const InputNumber=(props:InputNumberProps)=>{
    return <AntdInputNumber className="common-input" {...props}/>
}

export default InputNumber;