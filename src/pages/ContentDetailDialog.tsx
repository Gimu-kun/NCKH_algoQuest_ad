import { Dialog, DialogTitle, DialogContent, Typography, Box, Divider, Chip, Stack, CircularProgress, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import lessonApiService from "../service/apis/lessonApiService";
import questionApiService from "../service/apis/questionApiService";
import FormatAndLatexRender from "./FormatAndLatexRender";
import SmartContentDetailRender from "./SmartContentDetailRender";
import SectionDetailItem from "./SectionDetailItem";

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
        if (open && id) fetchDetail();
    }, [open, id]);

    const fetchDetail = async () => {
        setLoading(true);
        const res = type === 'lesson' 
            ? await lessonApiService.getById(id!) 
            : await questionApiService.getById(id!);
            
        if (res.success) setData(res.data);
        setLoading(false);
    };

    const renderAnswers = () => {
        if (!data) return null;
        const answerBoxStyle = { p: 1.5, mb: 1, borderRadius: 2, border: '1px solid #e0e0e0' };

        switch (data.questionType) {
            case 'mcq':
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom color="primary" fontWeight="bold">Đáp án trắc nghiệm:</Typography>
                        {data.mcqAnswers?.map((ans: any, index: number) => (
                            <Paper key={index} elevation={0} sx={{ ...answerBoxStyle, bgcolor: ans.isCorrect ? '#e8f5e9' : '#fff', borderColor: ans.isCorrect ? '#4caf50' : '#e0e0e0' }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    {ans.isCorrect ? '✅ ' : '⚪ '} 
                                    <Box component="span" sx={{ ml: 1 }}>
                                        <FormatAndLatexRender content={ans.content} />
                                    </Box>
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                );
            case 'fn':
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">Đáp án điền số:</Typography>
                        {data.fnAnswers?.map((ans: any, index: number) => (
                            <Paper key={index} variant="outlined" sx={answerBoxStyle}>
                                <Typography variant="body2">Giá trị: <b>{ans.answer}</b> (Sai số cho phép: ±{ans.tolerance})</Typography>
                            </Paper>
                        ))}
                    </Box>
                );
            case 'fs':
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">Đáp án điền từ:</Typography>
                        {data.fsAnswers?.map((ans: any, index: number) => (
                            <Paper key={index} variant="outlined" sx={answerBoxStyle}>
                                <Typography variant="body2">Chính xác: <b>{ans.answer}</b></Typography>
                                <Typography variant="caption" color="text.secondary">Từ đồng nghĩa: {ans.synonyms || 'Không có'}</Typography>
                            </Paper>
                        ))}
                    </Box>
                );
            case 'mp':
                return (
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold">Cặp ghép nối:</Typography>
                        {data.mpAnswers?.map((ans: any, index: number) => (
                            <Stack key={index} direction="row" spacing={2} sx={answerBoxStyle} alignItems="center">
                                <Paper variant="outlined" sx={{ px: 2, py: 1, flex: 1, textAlign: 'center', bgcolor: '#f8f9fa' }}>{ans.column1}</Paper>
                                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>⇄</Typography>
                                <Paper variant="outlined" sx={{ px: 2, py: 1, flex: 1, textAlign: 'center', bgcolor: '#e3f2fd' }}>{ans.column2}</Paper>
                            </Stack>
                        ))}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle sx={{ bgcolor: '#f8f9fa' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {type === 'lesson' ? '📖 Chi tiết bài giảng' : '❓ Chi tiết câu hỏi'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">ID: {id}</Typography>
                    </Box>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5 }}>
                        <CircularProgress size={40} />
                        <Typography sx={{ mt: 2 }} color="text.secondary">Đang tải dữ liệu...</Typography>
                    </Box>
                ) : data && (
                    <Box>
                        {type === 'lesson' ? (
                            <Box>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 3 }}>
                                    {data.title}
                                </Typography>
                                
                                <Divider sx={{ mb: 4 }} />

                                {/* Render Section Gốc (Level 1) */}
                                {data.sections
                                    ?.filter((s: any) => !s.parentId)
                                    .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                                    .map((section: any) => (
                                        <SectionDetailItem key={section.id} section={section} />
                                    ))
                                }
                            </Box>
                        ) : (
                            <Box>
                                <Stack direction="row" spacing={1} mb={3}>
                                    <Chip label={data.questionType?.toUpperCase()} color="primary" />
                                    <Chip label={`Độ khó: ${data.bloom}`} variant="outlined" />
                                    <Chip label={`Chủ đề: ${data.topic?.title}`} variant="outlined" color="info" />
                                </Stack>
                                
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Nội dung câu hỏi:</Typography>
                                <Paper sx={{ p: 3, bgcolor: '#fff', mb: 3, border: '1px solid #eee', borderRadius: 2 }}>
                                    <SmartContentDetailRender section={{ 
                                        content: data.questionContent, 
                                        images: data.questionImgs 
                                    }} />
                                </Paper>

                                {renderAnswers()}
                                
                                {data.explanation && (
                                    <Box mt={3} sx={{ p: 2, bgcolor: '#fffde7', borderRadius: 2, borderLeft: '4px solid #fbc02d' }}>
                                        <Typography variant="subtitle2" color="warning.dark" fontWeight="bold">Giải thích:</Typography>
                                        <FormatAndLatexRender content={data.explanation} />
                                    </Box>
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