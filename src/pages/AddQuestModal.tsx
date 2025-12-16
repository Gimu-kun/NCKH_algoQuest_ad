import { Divider, FormControl, Input, InputLabel, NativeSelect, CircularProgress, Backdrop, TextareaAutosize, Box, Button, Grid, Typography, IconButton, Stack, TextField, FormHelperText } from "@mui/material";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import topicApiService from "../service/apis/topicApiService";

type Props = {
    isEdit: boolean;
    editingId: string | null;
    onClose: (message?: string, success?: boolean) => void;
};

type TopicSelectType = {
    id: string,
    title: string
}

const AddQuestModal = ({ isEdit, editingId, onClose }: Props) => {
    //#region Biến toàn cục
    const [activeType, setActiveType] = useState<number>(0);
    const [topicSelectorLs, setTopicSelectorLs] = useState<TopicSelectType[]>([])
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    //#endregion

    //#region Hàm upload ảnh
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemove = (indexToRemove: number) => {
        setImages((prev) => {
            const newImages = prev.filter((_, i) => i !== indexToRemove);
            if (newImages.length === 0 && fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return newImages;
        });
    };
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

    const dividerText = {
        1: "Điền thông tin bài học",
        2: "Điền thông tin trắc nghiệm",
        3: "Điền thông tin minh hoạ",
    }[activeType];

    useEffect(() => {
        setLoading(true);
        getTopicList();
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [])
    //#endregion

    const handleSubmit = () => {

    }

    return (
        <section className="fixed w-screen inset-0 flex items-center justify-center bg-black/20 z-10">
            <Backdrop open={loading} sx={{zIndex:100}}>
                <CircularProgress />
            </Backdrop>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-5 rounded-xl w-min-1/2"
            >
                <h2 className="text-xl font-bold text-center mb-3">
                    {isEdit ? "Cập nhật chủ đề" : "Thêm mới chủ đề"}
                </h2>
                {/*-------------- Các trường chung ----------------*/}
                <FormControl sx={{ mr: 2 }}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Kiểu màn chơi
                    </InputLabel>
                    <NativeSelect
                        defaultValue={0}
                        onChange={(e) => setActiveType(Number(e.target.value))}
                    >
                        <option value={0} disabled>Chọn kiểu màn chơi</option>
                        <option value={1}>Bài học</option>
                        <option value={2}>Bài tập trắc nghiệm</option>
                        <option value={3}>Minh hoạ trực quan</option>
                    </NativeSelect>
                </FormControl>
                <FormControl sx={{ mr: 2 }}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native" shrink={Boolean(topicSelectorLs)}>
                        Chọn chương
                    </InputLabel>
                    <NativeSelect
                        defaultValue={"null"}
                        onChange={(e) => setActiveType(Number(e.target.value))}
                    >
                        <option key={"null"} value={"null"} disabled>Chọn chương</option>
                        {
                            topicSelectorLs.length != 0 && topicSelectorLs.map(
                                item => <option key={item.id} value={item.id}>{item.title}</option>
                            )
                        }
                    </NativeSelect>
                </FormControl>
                <Input
                    name="title-input"
                    placeholder="Điền tiêu đề (ít nhất 4 kí tự)"
                    //defaultValue={editingRow?.title}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Input
                    name="desc-input"
                    placeholder="Điền mô tả tổng quát"
                    //defaultValue={editingRow?.description}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Divider sx={{ mt: 2, mb: 2 }} textAlign="left">Phần thưởng</Divider>
                <Grid size={3} container spacing={2} mt={1} mb={1} >
                    <TextField
                        label="Kinh nghiệm"
                        type="number"
                        defaultValue={0}
                        inputProps={{ min: 1, max: 10 }}
                    />
                    <TextField
                        label="Số gỗ"
                        type="number"
                        defaultValue={0}
                        inputProps={{ min: 1, max: 10 }}
                    />
                    <TextField
                        label="Số đá"
                        type="number"
                        defaultValue={0}
                        inputProps={{ min: 1, max: 10 }}
                    />
                </Grid>
                {
                    activeType != 0 && <Divider sx={{ mt: 2, mb: 2 }} textAlign="left">{dividerText}</Divider>
                }
                {
                    activeType == 1 ?
                        (
                            <>
                                {/*-------------- Các trường kiểu bài học ----------------*/}

                                <FormControl fullWidth>
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        placeholder="Nhập nội dung bài học"

                                        style={{ width: "100%", minHeight: 100, padding: 10, border: "1px solid #000000", borderRadius: 5 }}
                                    />
                                    <FormHelperText>
                                        Vị trí ảnh kí hiệu #pic số thứ tự ảnh stt=1 ghi là #pic1
                                    </FormHelperText>
                                </FormControl>
                                <Box mt={2}>
                                    {images.length > 0 && (
                                        <Grid container spacing={2} mt={1} mb={1}>
                                            {images.map((file, index) => (
                                                <Grid size={4} key={index}>
                                                    <Box
                                                        sx={{
                                                            position: "relative",
                                                            border: "1px solid #ddd",
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemove(index)}
                                                            sx={{
                                                                position: "absolute",
                                                                top: 4,
                                                                right: 4,
                                                                bgcolor: "rgba(0,0,0,0.6)",
                                                                color: "#fff",
                                                                zIndex: 2,
                                                                "&:hover": {
                                                                    bgcolor: "rgba(0,0,0,0.8)",
                                                                },
                                                            }}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: 4,
                                                                left: 4,
                                                                bgcolor: "rgba(0,0,0,0.6)",
                                                                color: "#fff",
                                                                px: 1,
                                                                borderRadius: 1,
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Box>
                                                        <Box
                                                            component="img"
                                                            src={URL.createObjectURL(file)}
                                                            alt={`preview-${index}`}
                                                            sx={{
                                                                width: "100%",
                                                                height: 120,
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                    <Stack alignItems={"center"}>
                                        <Button sx={{ width: 150 }} variant="outlined" component="label">
                                            Tải ảnh lên
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                onChange={handleUpload}
                                            />
                                        </Button>
                                    </Stack>
                                </Box>
                            </>
                        ) : activeType == 2 ?
                        (
                            <>
                            {/*-------------- Các trường kiểu bài tập trắc nghiệm ----------------*/}
                            </>
                        ) : 
                        (
                            <>
                            {/*-------------- Các trường minh hoạ trực quan ----------------*/}
                            </>
                        )
                }
                <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="outlined" color="error" onClick={()=>{onClose()}}>
                        Đóng
                    </Button>
                    <Button variant="contained" type="submit">
                        {isEdit ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </Stack>
            </form>
        </section>
    )
}

export default AddQuestModal;