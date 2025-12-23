import {
    Box, Button, Divider, Grid, IconButton, List, ListItem,
    ListItemText, Paper, Stack, Typography, Tab, Tabs, TextField, InputAdornment,
    ListItemButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import lessonApiService from "../service/apis/lessonApiService";
import questionApiService from "../service/apis/questionApiService";
import { Search, VisibilityOutlined } from "@mui/icons-material";
import ContentDetailDialog from "./ContentDetailDialog";
import questApiService from "../service/apis/questApiService";
import type { questContentType, questContentTypeRequest } from "../types/questType";

type Props = {
    questId: string;
    questName: string;
    onClose: (success?: boolean) => void;
};



const ManageQuestContentModal = ({ questId, questName, onClose }: Props) => {
    console.log(questId);
    const [tabIndex, setTabIndex] = useState(0); // 0: Lessons, 1: Questions
    const [allLessons, setAllLessons] = useState<any[]>([]);
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [detailConfig, setDetailConfig] = useState<{ open: boolean, id: string | null, type: 'lesson' | 'question' }>({
        open: false,
        id: null,
        type: 'lesson'
    });

    const [selectedLessons, setSelectedLessons] = useState<questContentType[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<questContentType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCurrentQuestContent = async () => {
        try {
            const resQuest = await questApiService.getById(questId);
            console.log(resQuest)
            if (resQuest.success && resQuest.data) {
                const data = resQuest.data;
                if (data.lessons) {
                    const initialLessons = data.lessons.map((item: any) => ({
                        id: item.lesson?.id || item.lessonId,
                        point: item.point ?? 10,
                        exp: item.exp ?? 10
                    }));
                    setSelectedLessons(initialLessons);
                }

                if (data.questions) {
                    const initialQuestions = data.questions.map((item: any) => ({
                        id: item.question?.id || item.questionId,
                        point: item.point ?? 20,
                        exp: item.exp ?? 15
                    }));
                    setSelectedQuestions(initialQuestions);
                }
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu Quest hiện tại:", error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchCurrentQuestContent(); 
    }, [questId]);

    const fetchData = async () => {
        const [resLessons, resQuestions] = await Promise.all([
            lessonApiService.getAll(),
            questionApiService.getAll()
        ]);
        if (resLessons.success) setAllLessons(resLessons.data || []);
        if (resQuestions.success) setAllQuestions(resQuestions.data || []);
    };

    const handleSave = async () => {
        const payload:questContentTypeRequest = {
            lessons: selectedLessons,
            questions: selectedQuestions
        };
        console.log("Dữ liệu gửi lên API:", payload);
        const res = await questApiService.adjustContent(questId, payload);
        if(res.success){
            onClose(true);
        }
    };

    const handleToggleLesson = (id: string) => {
        setSelectedLessons(prev =>
            prev.find(l => l.id === id)
                ? prev.filter(l => l.id !== id)
                : [...prev, { id, point: 10 , exp:10 }] 
        );
    };

    const handleUpdateLessonpoint = (id: string, point: number) => {
        setSelectedLessons(prev => prev.map(l => l.id === id ? { ...l, point } : l));
    };

    const handleUpdateLessonExp = (id: string, exp: number) => {
        setSelectedLessons(prev => prev.map(l => l.id === id ? { ...l, exp } : l));
    };

    const handleUpdateQuestionpoint = (id: string, point: number) => {
        setSelectedQuestions(prev => prev.map(q => q.id === id ? { ...q, point } : q));
    };

    const handleUpdateQuestionExp = (id: string, exp:number) => {
        setSelectedQuestions(prev => prev.map(q => q.id === id ? { ...q, exp } : q));
    };

    const handleToggleQuestion = (id: string) => {
        setSelectedQuestions(prev =>
            prev.find(q => q.id === id)
                ? prev.filter(q => q.id !== id)
                : [...prev, { id, point: 20 , exp:10 }] 
        );
    };



    const filteredLessons = allLessons.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredQuestions = allQuestions.filter(q => q.questionContent.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">Cài đặt nội dung màn chơi</Typography>
                    <Typography variant="subtitle1" color="primary">Màn chơi: {questName} (ID: {questId})</Typography>
                </Box>
                <IconButton onClick={() => onClose()}><CloseIcon /></IconButton>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={4}>    
                {/* Cột trái: Tìm kiếm và Tab chọn */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Tìm kiếm nội dung..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                    />

                    <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} sx={{ mb: 2 }}>
                        <Tab label={`Bài học (${allLessons.length})`} />
                        <Tab label={`Câu hỏi (${allQuestions.length})`} />
                    </Tabs>

                    <Paper variant="outlined" sx={{ height: 400, overflowY: "auto" }}>
                        <List dense>
                            {tabIndex === 0 ? (
                                // --- PHẦN BÀI HỌC ---
                                filteredLessons.map((lesson) => {
                                    const isSelected = selectedLessons.some(sl => sl.id === lesson.id);

                                    return (
                                        <ListItem
                                            key={lesson.id}
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => setDetailConfig({ open: true, id: lesson.id, type: 'lesson' })}>
                                                    <VisibilityOutlined color="action" />
                                                </IconButton>
                                            }
                                            disablePadding
                                            divider
                                            sx={{ bgcolor: isSelected ? 'action.hover' : 'transparent' }}
                                        >
                                            <ListItemButton
                                                onClick={() => handleToggleLesson(lesson.id)}
                                                selected={isSelected} 
                                                sx={{
                                                    '&.Mui-selected': {
                                                        bgcolor: 'rgba(25, 118, 210, 0.12)', 
                                                        borderLeft: '4px solid #1976d2', 
                                                        '&:hover': {
                                                            bgcolor: 'rgba(25, 118, 210, 0.20)',
                                                        }
                                                    }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={lesson.title}
                                                    secondary={`ID: ${lesson.id}`}
                                                    primaryTypographyProps={{
                                                        fontWeight: isSelected ? 'bold' : 'normal',
                                                        color: isSelected ? 'primary.main' : 'text.primary'
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            ) : (
                                // --- PHẦN CÂU HỎI ---
                                filteredQuestions.map((q) => {
                                    const isSelected = selectedQuestions.some(sq => sq.id === q.id);

                                    return (
                                        <ListItem
                                            key={q.id}
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => setDetailConfig({ open: true, id: q.id, type: 'question' })}>
                                                    <VisibilityOutlined color="action" />
                                                </IconButton>
                                            }
                                            disablePadding
                                            divider
                                            sx={{ bgcolor: isSelected ? 'action.hover' : 'transparent' }}
                                        >
                                            <ListItemButton
                                                onClick={() => handleToggleQuestion(q.id)}
                                                selected={isSelected}
                                                sx={{
                                                    '&.Mui-selected': {
                                                        bgcolor: 'rgba(156, 39, 176, 0.08)',
                                                        borderLeft: '4px solid #9c27b0',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(156, 39, 176, 0.15)',
                                                        }
                                                    }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <div
                                                            style={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                                                            dangerouslySetInnerHTML={{ __html: q.questionContent.substring(0, 60) + '...' }}
                                                        />
                                                    }
                                                    secondary={`Loại: ${q.questionType}`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Cột phải: Tóm tắt những gì đã chọn */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Typography variant="h6" mb={2}>Nội dung & Điểm thưởng</Typography>
                    <Paper sx={{ p: 2, height: 500, bgcolor: '#fcfcfc', overflowY: 'auto' }} variant="outlined">

                        {/* DANH SÁCH BÀI HỌC ĐÃ CHỌN */}
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>Bài học</Typography>
                        <Stack spacing={1} mb={3}>
                            {selectedLessons.map(sl => {
                                const lesson = allLessons.find(l => l.id === sl.id);
                                return (
                                    <Paper key={sl.id} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>{lesson?.id}</Typography>
                                        <TextField
                                            label="Điểm"
                                            type="number"
                                            size="small"
                                            sx={{ width: 80 }}
                                            value={sl.point}
                                            onChange={(e) => handleUpdateLessonpoint(sl.id, Number(e.target.value))}
                                        />
                                        <TextField
                                            label="Kinh nghiệm"
                                            type="number"
                                            size="small"
                                            sx={{ width: 80 }}
                                            value={sl.exp}
                                            onChange={(e) => handleUpdateLessonExp(sl.id, Number(e.target.value))}
                                        />
                                        <IconButton size="small" color="error" onClick={() => handleToggleLesson(sl.id)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                );
                            })}
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* DANH SÁCH CÂU HỎI ĐÃ CHỌN */}
                        <Typography variant="subtitle2" color="secondary" sx={{ mb: 1 }}>Câu hỏi</Typography>
                        <Stack spacing={1}>
                            {selectedQuestions.map(sq => {
                                const q = allQuestions.find(item => item.id === sq.id);
                                console.log(sq)
                                return (
                                    <Paper key={sq.id} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>ID: {sq.id}</Typography>
                                        <TextField
                                            label="Điểm"
                                            type="number"
                                            size="small"
                                            sx={{ width: 80 }}
                                            value={sq.point}
                                            onChange={(e) => handleUpdateQuestionpoint(sq.id, Number(e.target.value))}
                                        />
                                        <TextField
                                            label="Kinh nghiệm"
                                            type="number"
                                            size="small"
                                            sx={{ width: 80 }}
                                            value={sq.exp}
                                            onChange={(e) => handleUpdateQuestionExp(sq.id, Number(e.target.value))}
                                        />
                                        <IconButton size="small" color="error" onClick={() => handleToggleQuestion(sq.id)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                <Button variant="outlined" color="inherit" onClick={() => onClose()}>Hủy bỏ</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>Lưu thay đổi</Button>
            </Stack>
            <ContentDetailDialog
                open={detailConfig.open}
                id={detailConfig.id}
                type={detailConfig.type}
                onClose={() => setDetailConfig(prev => ({ ...prev, open: false }))}
            />
        </Box>
    );
};

export default ManageQuestContentModal;