import { Dialog, DialogTitle, DialogContent, Typography, Box, Divider, Chip, Stack, CircularProgress, IconButton, Paper, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import lessonApiService from "../service/apis/lessonApiService";
import questionApiService from "../service/apis/questionApiService";
import { LessonLatexRender } from "../components/ui/LessonLatexRender";

type Props = {
    open: boolean;
    id: string | null;
    type: 'lesson' | 'question';
    onClose: () => void;
};

const ContentDetailDialog = ({ open, id, type, onClose }: Props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    

    useEffect(() => {
        if (open && id) {
            fetchDetail();
        }
    }, [open, id]);

    const fetchDetail = async () => {
        setLoading(true);
        const res = type === 'lesson' 
            ? await lessonApiService.getById(id!) 
            : await questionApiService.getById(id!);
            
        if (res.success) 
            console.log(res.data);
        setData(res.data);
        setLoading(false);
    };

    // Hàm render câu trả lời dựa trên loại câu hỏi
    const renderAnswers = () => {
        if (!data) return null;

        const answerBoxStyle = { p: 1.5, mb: 1, borderRadius: 1, border: '1px solid #e0e0e0' };

        switch (data.questionType) {
            case 'mcq': // Trắc nghiệm
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom color="primary">Danh sách đáp án:</Typography>
                        {data.mcqAnswers?.map((ans: any, index: number) => (
                            <Paper key={index} sx={{ ...answerBoxStyle, bgcolor: ans.isCorrect ? '#e8f5e9' : '#fff' }}>
                                <Typography variant="body2">
                                    {ans.isCorrect ? '✅ ' : '⚪ '} 
                                    <LessonLatexRender content={ans.content} images={[]} />
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                );

            case 'fn': // Điền số
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="primary">Đáp án điền số:</Typography>
                        {data.fnAnswers?.map((ans: any, index: number) => (
                            <Paper key={index} sx={answerBoxStyle}>
                                <Typography variant="body2">Giá trị: <b>{ans.answer}</b> (Sai số: ±{ans.tolerance})</Typography>
                            </Paper>
                        ))}
                    </Box>
                );

            case 'fs': // Điền từ
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="primary">Đáp án điền từ:</Typography>
                        {data.fsAnswers?.map((ans: any, index: number) => (
                            <Paper key={index} sx={answerBoxStyle}>
                                <Typography variant="body2">Chính xác: <b>{ans.answer}</b></Typography>
                                <Typography variant="caption" color="text.secondary">Từ đồng nghĩa: {ans.synonyms || 'Không có'}</Typography>
                            </Paper>
                        ))}
                    </Box>
                );

            case 'mp': // Nối cặp
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="primary">Các cặp ghép nối:</Typography>
                        {data.mpAnswers?.map((ans: any, index: number) => (
                            <Stack key={index} direction="row" spacing={2} sx={answerBoxStyle} alignItems="center">
                                <Paper variant="outlined" sx={{ px: 2, py: 1, flex: 1, textAlign: 'center' }}>{ans.column1}</Paper>
                                <Typography>↔</Typography>
                                <Paper variant="outlined" sx={{ px: 2, py: 1, flex: 1, textAlign: 'center', bgcolor: '#f0f4f8' }}>{ans.column2}</Paper>
                            </Stack>
                        ))}
                    </Box>
                );

            default:
                return <Typography variant="caption" color="error">Không rõ loại câu hỏi hoặc chưa có dữ liệu đáp án.</Typography>;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Chi tiết {type === 'lesson' ? 'Bài học' : 'Câu hỏi'}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : data && (
                    <Box>
                        <Button onClick={()=>{console.log(data.questionContent)}}>Test</Button>
                        {/* Phần chung cho cả 2 loại */}
                        <Typography variant="caption" color="text.secondary">ID: {data.id}</Typography>
                        
                        {type === 'lesson' ? (
                            <Box mt={1}>
                                <Typography variant="h5" color="primary" gutterBottom>{data.title}</Typography>
                                <Paper sx={{ p: 2, bgcolor: '#f9f9f9', mt: 2 }} variant="outlined">
                                    <LessonLatexRender 
                                        content={data.content} 
                                        images={data.lessonImgs?.map((img: any) => img.url) || []} 
                                    />
                                </Paper>
                                {data.lessonImgs?.length > 0 && (
                                    <Stack direction="row" spacing={1} mt={2}>
                                        {data.lessonImgs.map((img: any) => (
                                            <img key={img.id} src={import.meta.env.VITE_HOST_URL+ img.url} 
                                                 style={{ maxWidth: '200px', borderRadius: '8px' }} />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        ) : (
                            <Box mt={1}>
                                <Stack direction="row" spacing={1} mb={2}>
                                    <Chip label={data.questionType?.toUpperCase()} color="info" size="small" />
                                    <Chip label={`Độ khó: ${data.bloom}`} color="secondary" size="small" />
                                </Stack>
                                <Typography variant="subtitle1" fontWeight="bold">Nội dung câu hỏi:</Typography>
                                <Paper sx={{ p: 2, bgcolor: '#f5f5f5', my: 1 }} variant="outlined">
                                    <LessonLatexRender 
                                        content={data.questionContent} 
                                        images={data.questionImgs?.map((img: any) => img.url) || []} 
                                    />
                                </Paper>
                                {/* Phần render đáp án theo type */}
                                {renderAnswers()}
                                {data.questionImgs?.length > 0 && (
                                    <Stack direction="row" spacing={1} mt={2}>
                                        {data.questionImgs.map((img: any) => (
                                            <img key={img.id} src={import.meta.env.VITE_HOST_URL+ img.url} 
                                                 style={{ maxWidth: '200px', borderRadius: '8px' }} />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ContentDetailDialog;