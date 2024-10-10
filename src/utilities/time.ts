import dayjs from "dayjs";
import moment from "moment";
const STANDARD_DATE_FORMAT = "DD-MM-YYYY";
export const getDateInFormat = (date: string, format: string): string => {
  return moment(new Date(date)).format(format);
};

export const getDateInStandardFormat = (date: string): string => {
  return getDateInFormat(date, STANDARD_DATE_FORMAT);
};

export const getDateTimeInStandardFormat = (date: string): string => {
  // AM PM format
  return moment(new Date(date)).format("DD-MM-YYYY hh:mm A");
};

export const checkDueDateIsClose = (dueDate: string): boolean => {
  const today = moment();
  const due = moment(dueDate);
  const diff = due.diff(today, "days");
  return diff <= 3;
};

export const getDayFromTimeStamp = (timestamp: number): string => {
  return dayjs.unix(timestamp).format("dddd");
};

export function isWithinTenPercent(
  startDate: string,
  endDate: string,
  currentDate: string = moment().utc().format()
): boolean {
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);
  const current = moment.utc(currentDate);

  const startLocal = start.local();
  const endLocal = end.local();
  const currentLocal = current.local();

  const totalTimeDifference: number = endLocal.diff(startLocal);

  const tenPercentOfTotalTime: number = totalTimeDifference * 0.1;

  const remainingTime: number = endLocal.diff(currentLocal);

  return remainingTime <= tenPercentOfTotalTime;
}

export const get30DaysBack = () => {
  const dateFormat = "YYYY-MM-DD";

  return dayjs(moment().subtract(30, "days").format("YYYY-MM-DD"), dateFormat);
};

export const isDateLessThan30Days = (date: string): boolean => {
  const givenDate = moment(date);
  const date30DaysBack = moment().subtract(30, "days");

  const isNotLessThan30Days = givenDate.isAfter(date30DaysBack);

  return isNotLessThan30Days;
};
