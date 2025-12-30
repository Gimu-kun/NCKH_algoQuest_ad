import { Box, Button, FormControl, Input, InputLabel, NativeSelect, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import lessonApiService from "../service/apis/lessonApiService";
import type { TopicSelectType } from "../types/topicType";
import topicApiService from "../service/apis/topicApiService";

type Props = {
    onClose: (message?: string, success?: boolean) => void;
};

const AddLessonModal = ({ onClose }: Props) => {
    const [title, setTitle] = useState("");
    const user = useSelector((state: RootState) => state.user);
    const [topicOptions, setTopicOptions] = useState<TopicSelectType[]>([]);

    const getTopicList = async () => {
        try {
            const res = await topicApiService.getAll();
            console.log(res.data)
            if (res.success && res.data) {
                let topicArr: Array<TopicSelectType> = res.data.map(item => {
                    return {
                        id: item.id,
                        title: item.title,
                        status: item.status
                    }
                }).filter(item => item.status == true)
                setTopicOptions(topicArr);
            }
        } catch {
            alert("Lỗi khi lấy dữ liệu");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!title.trim()) return;

        const res = await lessonApiService.create({
            title,
            topic_id: String(formData.get("topic-id")),
            operatorId: user.id
        });

        if (res.success) {
            onClose("Khởi tạo bài học thành công! Hãy thêm nội dung ở mục chi tiết.", true);
        } else {
            alert(res.message);
        }
    };

    useEffect(()=>{
        getTopicList();
    },[])

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 3, width: 400, mx: 'auto', mt: '15%' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Tạo bài học mới</Typography>
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel variant="standard" htmlFor="topic-select">Chương</InputLabel>
                    <NativeSelect
                        name="topic-id"
                        defaultValue={"null"}
                        key={"null"}
                    >
                        <option value="null" disabled>Chọn chương</option>
                        {topicOptions.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </NativeSelect>
                </FormControl>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Nhập tiêu đề để bắt đầu. Bạn có thể thêm các mục nội dung sau khi tạo.
                </Typography>
                <Input 
                    fullWidth 
                    autoFocus
                    placeholder="Ví dụ: Thuật toán Sắp xếp" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 4, fontSize: '1.1rem' }}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="contained" type="submit" disabled={!title.trim()}>Khởi tạo</Button>
                    <Button color="inherit" onClick={() => onClose()}>Hủy</Button>
                </Stack>
            </Box>
        </form>
    );
};

export default AddLessonModal;