import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, List, ListItem, ListItemText, 
    Typography, TextField, InputAdornment, Box,
    Stack,
    Tooltip,
    IconButton
} from "@mui/material";
import { Search, ArrowUpward, ArrowDownward, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import questApiService from "../service/apis/questApiService";
import type { questType } from "../types/questType";

type Props = {
    open: boolean;
    topicId: string | null;
    topicTitle: string;
    onClose: (message?: string, success?: boolean) => void;
};

const AddQuestToTopicModal = ({ open, topicId, topicTitle, onClose }: Props) => {
    const [allQuests, setAllQuests] = useState<questType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    useEffect(() => {
        if (open) fetchQuests();
    }, [open]);

    const fetchQuests = async () => {
        const res = await questApiService.getAll();
        if (res.success) setAllQuests(res.data);
    };

    const handleAssign = async (questId: string) => {
        if (!topicId) return;
        setLoadingId(questId);
        
        const res = await questApiService.addToTopic(topicId, questId);
        
        if (res.success) {
            setAllQuests(prev => prev.map(q => 
                q.id === questId 
                ? { ...q, topicId: { id: topicId, title: topicTitle } as any } 
                : q
            ));
        } else {
            alert(res.message);
        }
        setLoadingId(null);
    };

    const handleRemove = async (questId: string) => {
        setLoadingId(questId);
        const res = await questApiService.removeFromTopic(questId);
        if (res.success && res.data) {
            setAllQuests(prev => prev.map(q => 
                q.id === questId ? res.data : q
            ));
        }
        setLoadingId(null);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newQuests = [...allQuests];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newQuests.length) return;

        [newQuests[index], newQuests[targetIndex]] = [newQuests[targetIndex], newQuests[index]];
        setAllQuests(newQuests);
    };

    const saveOrder = async () => {
        const currentTopicQuestIds = allQuests
            .filter(q => q.topicId?.id === topicId)
            .map(q => q.id);

        const res = await questApiService.reorder(currentTopicQuestIds);
        if (res.success) {
            alert("Đã lưu thứ tự mới!");
        }
    };

    const filteredQuests = allQuests.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1 }}>
                Thêm màn chơi vào chương: 
                <Typography color="primary" variant="h6" fontWeight="bold">{topicTitle}</Typography>
            </DialogTitle>
            
            <DialogContent dividers>
                <TextField
                    fullWidth size="small" placeholder="Tìm kiếm màn chơi..." sx={{ mb: 2 }}
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                />

                <List sx={{ maxHeight: 400 }}>
                    {filteredQuests.map((quest) => {
                        const isCurrent = quest.topicId?.id === topicId;
                        const hasOtherTopic = quest.topicId?.id && !isCurrent;
                        const currentQuestsInTopic = filteredQuests.filter(q => q.topicId?.id === topicId);
                        const indexInTopic = currentQuestsInTopic.findIndex(q => q.id === quest.id);

                        return (
                            <ListItem 
                                secondaryAction={
                                    isCurrent ? (
                                        <Stack direction="row" alignItems="center">
                                            <Tooltip title="Lên">
                                                <IconButton 
                                                    size="small" 
                                                    disabled={indexInTopic === 0} 
                                                    onClick={() => handleMove(allQuests.indexOf(quest), 'up')}
                                                >
                                                    <ArrowUpward fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xuống">
                                                <IconButton 
                                                    size="small" 
                                                    disabled={indexInTopic === currentQuestsInTopic.length - 1} 
                                                    onClick={() => handleMove(allQuests.indexOf(quest), 'down')}
                                                >
                                                    <ArrowDownward fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Button color="error" size="small" onClick={() => handleRemove(quest.id)}>Loại</Button>
                                        </Stack>
                                    ) : (
                                        <Button variant="contained" size="small" onClick={() => handleAssign(quest.id)}>Gán</Button>
                                    )
                                }
                            >
                                <ListItemText 
                                    primary={quest.title}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
                                                ID: {quest.id}
                                            </Typography>
                                            {hasOtherTopic 
                                                ? `Đang thuộc: ${quest.topicId?.title}` 
                                                : (isCurrent ? "Đã thuộc chương này" : "Chưa có chương")
                                            }
                                        </>
                                    }
                                    primaryTypographyProps={{ fontWeight: isCurrent ? 'bold' : 'normal' }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>

            <DialogActions>
                <Typography variant="caption" color="text.secondary">
                    * Dùng mũi tên để thay đổi thứ tự hiển thị của màn chơi.
                </Typography>
                <Box>
                    <Button onClick={() => onClose()} color="inherit">Đóng</Button>
                    <Button 
                        startIcon={<Save />}
                        onClick={saveOrder} 
                        variant="contained" 
                        color="success"
                    >
                        Lưu thứ tự
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddQuestToTopicModal;