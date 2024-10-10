// eslint-disable-next-line import/no-extraneous-dependencies
import momentGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/lib/date-picker/generatePicker";
import "antd/lib/date-picker/style/index";

const DatePicker = generatePicker(momentGenerateConfig);

export default DatePicker;
