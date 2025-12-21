import type { UserGeneral } from "./authType"

export type baseAnswerType = {
    id:number,
    questionId:string,
}

export type answerFnType = baseAnswerType & {
    answer:number,
    tolerance:string
}

export type answerFnsType = baseAnswerType &{
    answer:string,
    synonyms:string
}

export type answerFsType = baseAnswerType &{
    answer:string
}

export type answerMcqType = baseAnswerType &{
    content:string,
    isCorrect:boolean,
}

export type answerMpType = baseAnswerType &{
    column1:string,
    column2:string,
}

export type questionImgType = baseAnswerType &{
    url:string,
    indexOrder:number
}

export type questionType = {
    id:string,
    topicId:string,
    questionType:string,
    bloom:string,
    status:boolean,
    questionContent:string,
    indexOrder:number,
    createdBy:UserGeneral,
    updatedBy:UserGeneral,
    fnAnswers:answerFnType[],
    fnsAnswers:answerFnsType[],
    fsAnswers:answerFsType[],
    mcqAnswers:answerMcqType[],
    mpAnswers:answerMpType[],
    createdAt:string,
    updatedAt:string,
    questionImgs:questionImgType[]
}