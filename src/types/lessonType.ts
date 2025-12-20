export type LessonImg = {
    id: string;
    lessonId: string;
    url: string;
    indexOrder: number;
}

export type LessonType = {
    id: string;
    title: string;
    content: string;
    indexOrder: number | null;
    lessonImgs: LessonImg[];
    createdBy: { username: string };
    updatedBy: { username: string };
    createdAt: string;
    updatedAt: string;
}

export type LessonCreationType = {
    title: string;
    content: string;
    images: File[];
    operatorId: string;
}