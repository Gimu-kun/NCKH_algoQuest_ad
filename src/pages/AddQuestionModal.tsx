import { Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography, IconButton, Checkbox, Paper, TextareaAutosize, NativeSelect } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UploadFileOutlined, AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import { useEffect, useRef, useState, type FormEvent } from "react";
import questionApiService from "../service/apis/questionApiService";
import { LessonLatexRender } from "../components/ui/LessonLatexRender";
import LatexToolBtnGroup from "../components/ui/LatexToolBtnGroup";
import type { TopicSelectType } from "../types/topicType";
import topicApiService from "../service/apis/topicApiService";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type Props = {
    onClose: (message?: string, success?: boolean) => void;
};

const AddQuestionModal = ({ onClose }: Props) => {
    const [questionType, setQuestionType] = useState("mcq");
    const [content, setContent] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [topicSelectorLs, setTopicSelectorLs] = useState<TopicSelectType[]>([])
    const user = useSelector((state: RootState) => state.user);

    const [selectedTopicId, setSelectedTopicId] = useState<string>("null");
    const [selectedBloom, setSelectedBloom] = useState<string>("null");
    const [mcqAnswers, setMcqAnswers] = useState([{ content: "", isCorrect: false }]);
    const [fnAnswer, setFnAnswer] = useState({ answer: 0, tolerance: 0 });
    const [fsAnswer, setFsAnswer] = useState({ answer: "", synonyms: "" });
    const [mpAnswers, setMpAnswers] = useState([{ column1: "", column2: "" }]);
    const [fnsAnswer, setFnsAnswer] = useState("");

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

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages((prev) => [...prev, ...filesArray]);
            const urls = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...urls]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        const questionDto = {
            questionContent: content,
            questionType: questionType,
            topicId: selectedTopicId,
            bloom: selectedBloom,
            operatorId: user.id,
            status: true,
            answerMcq: questionType === "mcq" ? mcqAnswers : [],
            answerFn: questionType === "fn" ? fnAnswer : null,
            answerFs: questionType === "fs" ? fsAnswer : null,
            answerMp: questionType === "mp" ? mpAnswers : [],
            answerFns: questionType === "fns" ? { answer: fnsAnswer } : null,
        };

        formData.append(
            "question",
            new Blob([JSON.stringify(questionDto)], { type: "application/json" })
        );

        images.forEach((img) => formData.append("imgs", img));

        try {
            await questionApiService.create(formData);
            handleClearForm();
            onClose("Thêm câu hỏi thành công!", true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClearForm = () => {
        setQuestionType("mcq");
        setContent("");
        setImages([]);
        setPreviewImages([]);
        setSelectedTopicId("null");
        setSelectedBloom("null");

        setMcqAnswers([{ content: "", isCorrect: false }]);
        setFnAnswer({ answer: 0, tolerance: 0 });
        setFsAnswer({ answer: "", synonyms: "" });
        setMpAnswers([{ column1: "", column2: "" }]);
        setFnsAnswer("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const insertLatex = (latex: string) => {
        const textarea = document.getElementById("question-textarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = content;

        const newText = text.substring(0, start) + latex + text.substring(end);

        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + latex.length, start + latex.length);
        }, 0);
    };

    const renderAnswerInput = () => {
        switch (questionType) {
            case "mcq":
                return (
                    <Stack spacing={2}>
                        <Typography variant="subtitle2">Lựa chọn trắc nghiệm:</Typography>
                        {mcqAnswers.map((ans, index) => (
                            <Stack key={index} direction="row" spacing={1} alignItems="center">
                                <Checkbox
                                    checked={ans.isCorrect}
                                    onChange={(e) => {
                                        const newAns = [...mcqAnswers];
                                        newAns[index].isCorrect = e.target.checked;
                                        setMcqAnswers(newAns);
                                    }}
                                />
                                <TextField
                                    fullWidth size="small" label={`Lựa chọn ${index + 1}`}
                                    value={ans.content}
                                    onChange={(e) => {
                                        const newAns = [...mcqAnswers];
                                        newAns[index].content = e.target.value;
                                        setMcqAnswers(newAns);
                                    }}
                                />
                                <IconButton color="error" onClick={() => setMcqAnswers(mcqAnswers.filter((_, i) => i !== index))}>
                                    <DeleteOutline />
                                </IconButton>
                            </Stack>
                        ))}
                        <Button startIcon={<AddCircleOutline />} onClick={() => setMcqAnswers([...mcqAnswers, { content: "", isCorrect: false }])}>Thêm lựa chọn</Button>
                    </Stack>
                );
            case "fn":
                return (
                    <Stack direction="row" spacing={2}>
                        <TextField label="Con số đúng" type="number" fullWidth onChange={(e) => setFnAnswer({ ...fnAnswer, answer: Number(e.target.value) })} />
                        <TextField label="Sai số cho phép" type="number" fullWidth onChange={(e) => setFnAnswer({ ...fnAnswer, tolerance: Number(e.target.value) })} />
                    </Stack>
                );
            case "mp":
                return (
                    <Stack spacing={2}>
                        <Typography variant="subtitle2">Cặp nối (Cột 1 nối với Cột 2):</Typography>
                        {mpAnswers.map((_, index) => (
                            <Stack key={index} direction="row" spacing={2}>
                                <TextField label="Vế A" fullWidth size="small" onChange={(e) => {
                                    const newAns = [...mpAnswers];
                                    newAns[index].column1 = e.target.value;
                                    setMpAnswers(newAns);
                                }} />
                                <TextField label="Vế B" fullWidth size="small" onChange={(e) => {
                                    const newAns = [...mpAnswers];
                                    newAns[index].column2 = e.target.value;
                                    setMpAnswers(newAns);
                                }} />
                            </Stack>
                        ))}
                        <Button startIcon={<AddCircleOutline />} onClick={() => setMpAnswers([...mpAnswers, { column1: "", column2: "" }])}>Thêm cặp nối</Button>
                    </Stack>
                );
            case "fns":
                return <TextField label="Chuỗi số (Ví dụ: [1,2,3])" fullWidth onChange={(e) => setFnsAnswer(e.target.value)} />;
            case "fs":
                return (
                    <Stack spacing={2}>
                        <TextField label="Từ khóa đúng" fullWidth onChange={(e) => setFsAnswer({ ...fsAnswer, answer: e.target.value })} />
                        <TextField label="Từ đồng nghĩa (cách nhau bởi dấu phẩy)" fullWidth onChange={(e) => setFsAnswer({ ...fsAnswer, synonyms: e.target.value })} />
                    </Stack>
                );
            default: return null;
        }
    };

    useEffect(() => {
        getTopicList();
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight="bold">Thêm câu hỏi mới</Typography>
                    <IconButton onClick={() => {
                        handleClearForm();
                        onClose();
                    }}><CloseIcon /></IconButton>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack direction="row" spacing={2} mb={3}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel shrink htmlFor="topic-native">
                                    Chọn chương
                                </InputLabel>
                                <NativeSelect
                                    value={selectedTopicId}
                                    onChange={(e) => setSelectedTopicId(e.target.value)}
                                    inputProps={{ id: 'topic-native' }}
                                >
                                    <option value="null" disabled>-- Chọn chương --</option>
                                    {topicSelectorLs.map(item => (
                                        <option key={item.id} value={item.id}>{item.title}</option>
                                    ))}
                                </NativeSelect>
                            </FormControl>

                            <FormControl fullWidth variant="standard">
                                <InputLabel shrink htmlFor="bloom-native">
                                    Thang Bloom
                                </InputLabel>
                                <NativeSelect
                                    value={selectedBloom}
                                    onChange={(e) => setSelectedBloom(e.target.value)}
                                    inputProps={{ id: 'bloom-native' }}
                                >
                                    <option value="null" disabled>-- Chọn mức độ --</option>
                                    <option value="r">Nhớ (Remember)</option>
                                    <option value="u">Hiểu (Understand)</option>
                                    <option value="ap">Vận dụng (Apply)</option>
                                    <option value="an">Phân tích (Analyze)</option>
                                </NativeSelect>
                            </FormControl>
                        </Stack>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Loại câu hỏi</InputLabel>
                            <Select value={questionType} label="Loại câu hỏi" onChange={(e) => setQuestionType(e.target.value)}>
                                <MenuItem value="mcq">Trắc nghiệm (MCQ)</MenuItem>
                                <MenuItem value="fn">Điền số (FN)</MenuItem>
                                <MenuItem value="fns">Chuỗi số (FNS)</MenuItem>
                                <MenuItem value="fs">Điền chữ (FS)</MenuItem>
                                <MenuItem value="mp">Nối cặp (MP)</MenuItem>
                            </Select>
                        </FormControl>
                        <LatexToolBtnGroup insertLatex={insertLatex} />
                        <TextareaAutosize
                            id="question-textarea"
                            name="question-textarea"
                            aria-label="empty textarea"
                            placeholder="Nhập nội dung bài học"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ width: "100%", minHeight: 100, padding: 10, border: "1px solid #000000", borderRadius: 5 }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" mb={1}>Xem trước nội dung:</Typography>
                        <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1, height: "100%", maxHeight: 320, minHeight: 150, bgcolor: "#fcfcfc", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            <LessonLatexRender content={content} images={images} />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                            {renderAnswerInput()}
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button variant="outlined" component="label" startIcon={<UploadFileOutlined />}>
                            Tải ảnh câu hỏi
                            <input ref={fileInputRef} type="file" hidden multiple accept="image/*" onChange={handleUpload} />
                        </Button>
                        <Stack direction="row" spacing={1} mt={2}>
                            {previewImages.map((url, i) => (
                                <img key={i} src={url} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 4 }} alt="preview" />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                    <Button variant="contained" color="error" onClick={() => {
                        handleClearForm();
                        onClose();
                    }}>Hủy bỏ</Button>
                    <Button variant="contained" color="primary" type="submit">Lưu câu hỏi</Button>
                </Stack>
            </Box>
        </form>
    );
};

export default AddQuestionModal;