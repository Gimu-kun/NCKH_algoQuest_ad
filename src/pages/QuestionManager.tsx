import { Backdrop, Box, Button, Collapse, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from "react";
import formatDate from "../service/utils/dataFormat";
import questionApiService from "../service/apis/questionApiService";
import AddQuestionModal from "./AddQuestionModal";
import { LessonLatexRender } from "../components/ui/LessonLatexRender";

const Row = (props: { row: any }) => {
    const { row } = props;
    const [open, setOpen] = useState(false);

    // Hàm render câu trả lời dựa trên questionType
    const renderAnswers = () => {
        switch (row.questionType) {
            case 'fn': // Fill-in-number
                return row.fnAnswers.map((a: any) => (
                    <Typography key={a.id}>- Đáp án: <b>{a.answer}</b> (Sai số cho phép: {a.tolerance || 0})</Typography>
                ));
            case 'fns': // Fill-in-number sequence
                return row.fnsAnswers.map((a: any) => (
                    <Typography key={a.id}>- Chuỗi đáp án: <b>{a.answer}</b></Typography>
                ));
            case 'fs': // Fill-in-string
                return row.fsAnswers.map((a: any) => (
                    <Typography key={a.id}>- Đáp án: <b>{a.answer}</b> (Đồng nghĩa: {a.synonyms})</Typography>
                ));
            case 'mcq': // Multiple choice
                return row.mcqAnswers.map((a: any) => (
                    <Typography key={a.id} color={a.isCorrect ? "success.main" : "text.primary"}>
                        {a.isCorrect ? "●" : "○"} {a.content} {a.isCorrect && "(Đúng)"}
                    </Typography>
                ));
            case 'mp': // Matching pair
                return row.mpAnswers.map((a: any) => (
                    <Typography key={a.id}>- {a.column1} ↔ {a.column2}</Typography>
                ));
            default:
                return <Typography color="error">Không rõ loại câu hỏi</Typography>;
        }
    };

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell><b>{row.id}</b></TableCell>
                <TableCell>
                    <Chip label={row.questionType.toUpperCase()} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                    <Typography noWrap sx={{ maxWidth: 200 }}>{row.questionContent}</Typography>
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>{row.createdBy.username}</TableCell>
                <TableCell>
                    <Button sx={{ marginLeft: 1 }} size="small" variant="contained" color="secondary">Sửa</Button>
                    <Button sx={{ marginLeft: 1 }} size="small" variant="outlined" color="error">Xoá</Button>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom color="primary">Nội dung câu hỏi</Typography>
                            <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 1, bgcolor: "#fafafa", mb: 2 }}>
                                <LessonLatexRender content={row.questionContent} images={row.questionImgs.map((item: any) => item.url)} />
                            </Box>

                            <Typography variant="h6" gutterBottom color="secondary">Đáp án ({row.questionType})</Typography>
                            <Box sx={{ pl: 2, mb: 2 }}>
                                {renderAnswers()}
                            </Box>

                            {row.questionImgs.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Hình ảnh minh họa:</Typography>
                                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                        {row.questionImgs.map((img: any) => (
                                            <Box key={img.id} sx={{ textAlign: 'center' }}>
                                                <img 
                                                    src={import.meta.env.VITE_HOST_URL + img.url}
                                                    alt="question" 
                                                    style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} 
                                                />
                                                <Typography variant="caption" display="block">Thứ tự: {img.indexOrder}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const QuestionManager = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);

    const fetchQuestions = async () => {
        try {
            const res = await questionApiService.getAll();
            if (res.success && res.data) {
                setQuestions(res.data);
            }
        } catch {
            console.error("Lỗi khi lấy dữ liệu câu hỏi");
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [isModalOpen]);

    return (
        <Box sx={{ p: 3 }}>
            <Backdrop open={isModalOpen} sx={{ zIndex: 100 }}>
                <Stack sx={{ maxHeight: "90%", overflowY: "auto", width: "80%" }}>
                    <AddQuestionModal onClose={() => setModalOpen(false)} />
                </Stack>
            </Backdrop>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Quản lý câu hỏi</Typography>
                <Button variant="contained" onClick={() => setModalOpen(true)}>Thêm câu hỏi mới</Button>
            </Stack>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell width="50px" />
                            <TableCell>ID</TableCell>
                            <TableCell>Loại</TableCell>
                            <TableCell>Nội dung</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Người tạo</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((q) => (
                            <Row key={q.id} row={q} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default QuestionManager;