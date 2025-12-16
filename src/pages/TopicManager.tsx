import { Alert, Box, Button, Chip, Collapse, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from "react";
import topicApiService from "../service/apis/topicApiService";
import type { topicType } from "../types/topicType";
import AddTopicModal from "./AddTopicModal";
import formatDate from "../service/utils/dataFormat";

type TopicRowProps = {
    topic: topicType;
    onEdit: (id: string) => void;
};

const TopicRow = ({ topic, onEdit }: TopicRowProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{whiteSpace:"nowrap"}}>{topic.id}</TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>
                    <Chip label={topic.status ? "Hoạt động" : "Tạm ngưng"} color={topic.status ? "success" : "error"} size="medium" />
                </TableCell>
                <TableCell>{topic.quests.length}</TableCell>
                <TableCell>{topic.indexOrder}</TableCell>
                <TableCell>{formatDate(topic.createdAt.toString())}</TableCell>
                <TableCell>{formatDate(topic.updatedAt.toString())}</TableCell>
                <TableCell>{topic.createdBy.username}</TableCell>
                <TableCell>{topic.updatedBy.username}</TableCell>
                <TableCell>
                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="outlined" onClick={() => onEdit(topic.id)}>
                        Thêm màn
                    </Button>
                    <br/>
                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="contained" color="secondary" onClick={() => onEdit(topic.id)}>
                        Cập nhật 
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={12} sx={{ p: 0, bgcolor: "#f3f4f6" }}>
                    <Collapse in={open}>
                        <Box m={1}>
                            <Typography variant="h6">Màn chơi</Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">ID</TableCell>
                                        <TableCell align="left">Kiểu</TableCell>
                                        <TableCell align="left">Tiêu đề</TableCell>
                                        <TableCell align="left">Mô tả</TableCell>
                                        <TableCell align="left">Trạng thái</TableCell>
                                        <TableCell align="left">Thứ tự</TableCell>
                                        <TableCell align="left">Tạo lúc</TableCell>
                                        <TableCell align="left">Cập nhật lúc</TableCell>
                                        <TableCell align="left">Tạo bởi</TableCell>
                                        <TableCell align="left">Cập nhật bởi</TableCell>
                                        <TableCell align="left">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topic.quests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                Không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        topic.quests.map(q => (
                                            <TableRow key={q.id}>
                                                <TableCell sx={{whiteSpace:"nowrap"}}>{q.id}</TableCell>
                                                <TableCell>{q.questType}</TableCell>
                                                <TableCell>{q.title}</TableCell>
                                                <TableCell>{q.description}</TableCell>
                                                <TableCell>
                                                    <Chip label={q.status ? "Hoạt động" : "Tạm ngưng"} color={q.status ? "success" : "error"} size="medium" />
                                                </TableCell>
                                                <TableCell>{q.indexOrder}</TableCell>
                                                <TableCell>{formatDate(q.createdAt.toString())}</TableCell>
                                                <TableCell>{formatDate(q.updatedAt.toString())}</TableCell>
                                                <TableCell>{q.createdBy.username}</TableCell>
                                                <TableCell>{q.updatedBy.username}</TableCell>
                                                <TableCell>
                                                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="contained" onClick={() => onEdit(topic.id)}>
                                                        Chi tiết
                                                    </Button>
                                                    <br/>
                                                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="contained" color="error" onClick={() => onEdit(topic.id)}>
                                                        Xoá màn
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};


const TopicManager = () => {
    const [topics, setTopics] = useState<topicType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");


    const isEdit = Boolean(editingId);

    const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const fetchTopics = async () => {
        try {
            const res = await topicApiService.getAll();
            if (res.success && res.data) {
                setTopics(res.data);
            }
        } catch {
            alert("Lỗi khi lấy dữ liệu");
        }
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setModalOpen(true);
    };

    const handleCloseModal = (message?: string, success: boolean = true) => {
        setEditingId(null);
        setModalOpen(false);
        fetchTopics();

        if (message) {
            showSnackbar(message, success ? "success" : "error");
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div className="min-h-screen text-gray-800">
            <main className="p-6 md:p-8 lg:p-7">
            {isModalOpen && (
                <AddTopicModal
                    editingId={editingId}
                    isEdit={isEdit}
                    onClose={handleCloseModal}
                />
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Stack direction={"row"} justifyContent={"space-between"} sx={{padding:3}}>
                <h1 className="text-4xl font-bold">Quản lý chương</h1>
                <Button variant="contained" sx={{fontSize:12}} onClick={() => setModalOpen(true)}>
                    Tạo mới
                </Button>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>ID</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Tiêu đề</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Mô tả</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Trạng thái</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Số màn</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Thứ tự</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Tạo lúc</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Cập nhật lúc</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Tạo bởi</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Cập nhật bởi</TableCell>
                            <TableCell align="left" sx={{whiteSpace:"nowrap"}}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topics.map(topic => (
                            <TopicRow key={topic.id} topic={topic} onEdit={handleEdit} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </main>
        </div>
    );
};

export default TopicManager;