import type { UserGeneral } from "./authType"

export interface questContentType {
    id: string;
    point: number;
    exp: number;
}

export type questContentTypeRequest = {
    lessons: Array<questContentType>,
    questions: Array<questContentType>
}

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

export type questRequestType = {
    title: string | null,
    description: string | null,
    topicId: string | null,
    status: boolean | null
    operatorId: string
}