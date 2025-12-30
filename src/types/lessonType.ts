import type { topicType } from "./topicType";

export type LessonImg = {
    id: string;
    sectionId: string;
    url: string;
    indexOrder: number;
}

export type LessonSectionType = {
    id: string;
    parentId?: string | null;
    lessonId: string;
    title: string;
    content: string;
    level: number;
    orderIndex: number;
    images: LessonImg[];
    children: LessonSectionType[]; // Cấu trúc đệ quy
}

export type LessonType = {
    id: string;
    parentId?: string | null;
    title: string;
    topic:topicType;
    sections: LessonSectionType[];
    updatedBy: { username: string };
    createdBy: { username: string };
    updatedAt: string;
    createdAt: string;
    
}

export type LessonCreationType = {
    title: string;
    operatorId: string;
}