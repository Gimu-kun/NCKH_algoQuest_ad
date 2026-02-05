import { Alert, Button, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { useEffect, useState } from "react";
import topicApiService from "../service/apis/topicApiService";
import type { topicType } from "../types/topicType";
import AddTopicModal from "./AddTopicModal";
import TopicRow from "./TopicRow";
import AddQuestToTopicModal from "./AddQuestToTopicModal";




const TopicManager = () => {
    const [topics, setTopics] = useState<topicType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [isQuestModalOpen, setQuestModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<{id: string, title: string} | null>(null);

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

    // Hàm mở modal thêm quest
    const handleOpenAddQuest = (id: string, title: string) => {
        setSelectedTopic({ id, title });
        setQuestModalOpen(true);
    };

    const handleCloseQuestModal = (message?: string, success?: boolean) => {
        setQuestModalOpen(false);
        if (success) {
            showSnackbar(message || "Thao tác thành công", "success");
            fetchTopics(); // Load lại để cập nhật số lượng màn chơi
        } else if (message) {
            showSnackbar(message, "error");
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
                            <TopicRow
                                key={topic.id} 
                                topic={topic} 
                                onEdit={handleEdit} 
                                onAddQuest={handleOpenAddQuest} // Truyền thêm callback này
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddQuestToTopicModal 
                open={isQuestModalOpen}
                topicId={selectedTopic?.id || null}
                topicTitle={selectedTopic?.title || ""}
                onClose={handleCloseQuestModal}
            />
            </main>
        </div>
    );
};

export default TopicManager;