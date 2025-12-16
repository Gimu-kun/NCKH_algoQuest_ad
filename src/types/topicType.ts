import type { UserGeneral } from "./authType"
import type { questType } from "./questType"

export type topicType = {
    id: string,
    title: string,
    status: boolean,
    description: string,
    indexOrder: number,
    createdBy: UserGeneral,
    updatedBy: UserGeneral,
    createdAt: Date,
    updatedAt: Date,
    quests: questType[]
}

export type addNewTopic = {
    title:string,
    description:string,
    operatorId:string
}

export type editTopicType = {
    title:string,
    description:string,
    indexOrder:number,
    status:boolean
}