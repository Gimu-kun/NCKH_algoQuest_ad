import { Alert, Box, Button, Divider, FormControl, FormHelperText, Grid, IconButton, Input, Snackbar, Stack, TextareaAutosize, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { UploadFileOutlined } from "@mui/icons-material";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import lessonApiService from "../service/apis/lessonApiService";
import {LessonLatexRender} from "../components/ui/LessonLatexRender";
import LatexToolBtnGroup from "../components/ui/LatexToolBtnGroup";

type Props = {
    onClose: (message?: string, success?: boolean) => void;
};

const AddLessonModal = ({ onClose }: Props) => {
    const [lessonContent, setLessonContent] = useState<string>("")
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const user = useSelector((state: RootState) => state.user);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");


    const insertLatex = (latex: string) => {
        const textarea = document.getElementById("lesson-textarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = lessonContent;

        const newText = text.substring(0, start) + latex + text.substring(end);

        setLessonContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + latex.length, start + latex.length);
        }, 0);
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

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleClear = () => {
        setLessonContent("");
        setImages([]);
        const titleInput = document.getElementsByName("title_input")[0] as HTMLInputElement;
        if (titleInput) titleInput.value = "";

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    

    //#region Lệnh gọi API
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        let sendData = {
            title: (form.elements.namedItem("title_input") as HTMLInputElement).value,
            content: (form.elements.namedItem("lesson_content") as HTMLInputElement).value,
            images,
            operatorId: user.id
        }
        try {
            const res = await lessonApiService.create(sendData);
            if(res.success){
                setTimeout(()=>{
                    showSnackbar("Thêm bài học thành công","success");
                },200)
                handleClear();
                onClose();
            }else{
                showSnackbar(res.message,"error");
            }
        } catch (error) {
            showSnackbar("Lỗi:"+ error,"error")
        }
    }

    //#endregion

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl w-min-1/2 h-9/10 overflow-y-auto">
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight="bold">Thêm bài học mới</Typography>
                    <IconButton onClick={() => onClose()}><CloseIcon /></IconButton>
                </Stack>
            <FormControl fullWidth>
                <Input
                    name="title_input"
                    placeholder="Điền tiêu đề (ít nhất 4 kí tự)"
                    //defaultValue={editingRow?.title}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <LatexToolBtnGroup insertLatex={insertLatex}/>
                <TextareaAutosize
                    id="lesson-textarea"
                    name="lesson_content"
                    aria-label="empty textarea"
                    placeholder="Nhập nội dung bài học"
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    style={{ width: "100%", minHeight: 100, padding: 10, border: "1px solid #000000", borderRadius: 5 }}
                />
                <Divider sx={{ my: 2 }}>Preview</Divider>
                <Box
                    sx={{
                        width: "100%",
                        minHeight: 100,
                        p: 2,
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                        bgcolor: "#fafafa",
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap"
                    }}
                >
                    <LessonLatexRender content={lessonContent} images={images} />
                </Box>
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
                <Stack justifyContent={"center"} gap={2}>
                    <Button sx={{ mb: 2 }} variant="outlined" component="label">
                        <UploadFileOutlined color="primary" /> Tải ảnh lên
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                        />
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                        Thêm mới
                    </Button>
                    <Button variant="contained" color="error" onClick={() => { 
                        handleClear();
                        onClose(); }}>
                        Đóng
                    </Button>
                </Stack>
            </Box>
        </form>
    )
};

export default AddLessonModal;