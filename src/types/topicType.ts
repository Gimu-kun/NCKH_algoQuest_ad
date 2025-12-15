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