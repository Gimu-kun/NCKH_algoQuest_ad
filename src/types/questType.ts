import type { UserGeneral } from "./authType"

export type questType = {
    id: string,
    questType: string,
    topicId: {
        id: string,
        title: string,
        status: boolean,
        description: string,
        indexOrder: number
    },
    title: string,
    status: boolean,
    description: string,
    indexOrder: number,
    createdBy: UserGeneral,
    updatedBy: UserGeneral,
    createdAt: Date,
    updatedAt: Date
}