import { getTranslation } from "@/translation/i18n"

export interface TaskColumnType{
    title: string,
    key: string,
    titleColor: string
}


export const taskColumns :TaskColumnType[] = [
    {
        title:getTranslation("task.open"),
        key:"open",
        titleColor: "#0049B7"
    },
    {
        title:getTranslation("task.inProgress"),
        key:"inProgress",
        titleColor: "#00DDFF"
    },
    {
        title:getTranslation("task.inReview"),
        key:"inReview",
        titleColor: "#f56a00"
    },
    {
        title:getTranslation("task.closed"),
        key:"closed",
        titleColor:"#87d068"
    },
    
    {
        title:getTranslation("task.cancelled"),
        key:"cancelled",
        titleColor:"red"
    }
]