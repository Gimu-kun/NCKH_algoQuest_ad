import { FormControl, Input, InputLabel, NativeSelect, CircularProgress, Backdrop, Button, Stack, TextField, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import topicApiService from "../service/apis/topicApiService";
import 'katex/dist/katex.min.css';
import type { TopicSelectType } from "../types/topicType";
import questApiService from "../service/apis/questApiService";
import type { questRequestType } from "../types/questType";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type Props = {
    isEdit: boolean;
    editingId: string | null;
    onClose: (message?: string, success?: boolean) => void;
};

const AddQuestModal = ({ isEdit, editingId, onClose }: Props) => {
    //#region Biến toàn cục
    const [topicSelectorLs, setTopicSelectorLs] = useState<TopicSelectType[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [questData, setQuestData] = useState<any>(null);
    const [status, setStatus] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user);
    const [refVideo, setRefVideo] = useState<string>("");

    //biến trạng thái ẩn/hiện các khối chính
    const [lessonFormState, setLessonFormState] = useState<boolean>(false)
    const [refFormState, setRefFormState] = useState<boolean>(false)
    const [quizFormState, setQuizFormState] = useState<boolean>(false)
    const [visualFormState, setVisualFormState] = useState<boolean>(false)

    //biến trạng thái xác định kiểu minh hoạ đang chọn
    const [activeVisual, setActiveVisual] = useState<string>("null")
    //#endregion
    //#region Hàm khởi tạo nội dung
    const getTopicList = async () => {
        try {
            const res = await topicApiService.getAll();
            if (res.success && res.data) {
                let topicArr: Array<TopicSelectType> = res.data.map(item => {
                    return {
                        id: item.id,
                        title: item.title,
                        status: item.status
                    }
                }).filter(item => item.status == true)
                setTopicSelectorLs(topicArr);
            }
        } catch {
            alert("Lỗi khi lấy dữ liệu");
        }
    }

    const fetchQuestDetail = async (id: string) => {
        setLoading(true);
        const res = await questApiService.getById(id);
        if (res.success) {
            setQuestData(res.data);
            setStatus(res.data.status);
        }
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        getTopicList();
        if (isEdit && editingId) {
            fetchQuestDetail(editingId);
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [isEdit, editingId])
    //#endregion

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            const data:questRequestType = {
                title: String(formData.get("title")),
                description: String(formData.get("description")),
                topicId: String(formData.get("topic-id")),
                status: status,
                operatorId:user.id
            };

            setLoading(true);
            let res;
            if (isEdit && editingId) {
                // Gọi API Update (dựa vào file QuestController.java bạn gửi có PatchMapping("/{id}"))
                res = await questApiService.update(editingId, data); 
            } else {
                // Gọi API Create
                res = await questApiService.create(data);
            }
            if (res.success) {
                onClose(res.message, true);
            } else {
                onClose(res.message, false);
            }
            setLoading(false);
    }

    return (
        <section className="fixed w-screen  inset-0 flex items-center justify-center bg-black/20 z-10">
            <Backdrop open={loading} sx={{ zIndex: 100 }}>
                <CircularProgress />
            </Backdrop>
            <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-amber-50">
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel variant="standard" htmlFor="topic-select">Chương</InputLabel>
                    <NativeSelect
                        name="topic-id"
                        defaultValue={questData?.topicId?.id || "null"}
                        key={questData?.topicId?.id} // Quan trọng để re-render khi data về
                    >
                        <option value="null" disabled>Chọn chương</option>
                        {topicSelectorLs.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </NativeSelect>
                </FormControl>

                <TextField
                    name="title"
                    label="Tiêu đề"
                    fullWidth
                    sx={{ mt: 2 }}
                    defaultValue={questData?.title || ""}
                    key={`title-${questData?.id}`}
                />

                <TextField
                    name="description"
                    label="Mô tả"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mt: 2 }}
                    defaultValue={questData?.description || ""}
                    key={`desc-${questData?.id}`}
                />

                {/* PHẦN THÊM MỚI: TRẠNG THÁI */}
                <FormControl fullWidth sx={{ mt: 2, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography>Trạng thái ải:</Typography>
                    <Chip 
                        label={status ? "Đang hoạt động" : "Tạm khóa"} 
                        color={status ? "success" : "default"}
                        onClick={() => setStatus(!status)} 
                        variant={status ? "filled" : "outlined"}
                        sx={{ cursor: 'pointer' }}
                    />
                </FormControl>

                <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="outlined" color="error" onClick={() => onClose()}>Đóng</Button>
                    <Button variant="contained" type="submit">
                        {isEdit ? "Cập nhật thay đổi" : "Tạo mới ải"}
                    </Button>
                </Stack>
            </form>
        </section>
    )
}

export default AddQuestModal;