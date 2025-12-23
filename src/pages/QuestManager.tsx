import { useEffect, useState } from "react";
import type { questType } from "../types/questType";
import { Alert, Backdrop, Button, Chip, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import questApiService from "../service/apis/questApiService";
import formatDate from "../service/utils/dataFormat";
import AddQuestModal from "./AddQuestModal";
import ManagerQuestContentModal from "./ManagerQuestContentModal";

function createData(data: questType) {
    return {
        id: data.id,
        topicId: data?.topicId?.id,
        title: data.title,
        decs: data.description,
        status: data.status,
        questType: data.questType,
        orderIndex: data.indexOrder,
        createBy: data.createdBy.username,
        updatedBy: data.updatedBy.username,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
}

const QuestManager = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isContentModalOpen, setContentModalOpen] = useState(false);
    const [questList, setQuestList] = useState<questType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [selectingQuest, setSelectingQuest] = useState<string>("")

    const rows = questList.map(item => createData(item));
    const isEdit = Boolean(editingId);

    const getQuestList = async () => {
        try {
            const res = await questApiService.getAll();
            if (res.success && res.data) {
                setQuestList(res.data);
            }
        } catch (err) {
            alert("Lỗi khi lấy dữ liệu " + err);
        }
    };

    const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setModalOpen(true);
    };

    const handleCloseModal = (message?: string, success: boolean = true) => {
        setEditingId(null);
        setModalOpen(false);
        getQuestList();

        if (message) {
            showSnackbar(message, success ? "success" : "error");
        }
    };

    useEffect(() => {
        getQuestList();
    }, []);

    return (
        <div className="min-h-screen text-gray-800">
            {isModalOpen && 
                <AddQuestModal
                    editingId={editingId}
                    isEdit={isEdit}
                    onClose={handleCloseModal}
                />
            }

            <Backdrop open={isContentModalOpen} sx={{ zIndex: 100 }}>
                <Stack sx={{ maxHeight: "90%", overflowY: "auto", width: "80%" }}>
                    <ManagerQuestContentModal questId={selectingQuest} questName="" onClose={() => setContentModalOpen(false)} />
                </Stack>
            </Backdrop>

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
            <main className="p-6 md:p-8 lg:p-7">
                <Stack direction={"row"} justifyContent={"space-between"} sx={{ padding: 3 }}>
                    <h1 className="text-4xl font-bold">Quản lý màn chơi</h1>
                    <Button variant="contained" sx={{ fontSize: 12 }} onClick={() => setModalOpen(true)}>
                        Tạo mới
                    </Button>
                </Stack>

                <div className="flex w-full items-center mb-5 mt-5 text-sm bg-amber-50 rounded-xl overflow-hidden">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>ID chương</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Tiêu đề</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Mô tả</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Trạng thái</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Kiểu màn chơi</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Thứ tự</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Tạo lúc</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Cập nhật lúc</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Tạo bởi</TableCell>
                                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>Cập nhật bởi</TableCell>
                                    <TableCell align="left">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography color="text.secondary">
                                                Không có dữ liệu
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.id}</TableCell>
                                            <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>{row.topicId}</TableCell>
                                            <TableCell align="left">{row.title}</TableCell>
                                            <TableCell align="left">{row.decs}</TableCell>
                                            <TableCell align="left">
                                                <Chip label={row.status ? "Hoạt động" : "Tạm ngưng"} color={row.status ? "success" : "error"} size="medium" />
                                            </TableCell>
                                            <TableCell align="center">{row.orderIndex}</TableCell>
                                            <TableCell>{formatDate(row.createdAt.toString())}</TableCell>
                                            <TableCell>{formatDate(row.updatedAt.toString())}</TableCell>
                                            <TableCell>{row.createBy}</TableCell>
                                            <TableCell>{row.updatedBy}</TableCell>
                                            <TableCell align="left">
                                                <Button sx={{ marginBottom: 1, fontSize: 12, whiteSpace: "nowrap" }} onClick={()=>{
                                                    setSelectingQuest(row.id),
                                                    setContentModalOpen(true)
                                                }} size="small" variant="outlined">
                                                    Thêm nội dung
                                                </Button>
                                                <br />
                                                <Button sx={{ marginBottom: 1, fontSize: 12, whiteSpace: "nowrap" }} size="small" variant="contained" color="secondary" onClick={() => { handleEdit(row.id) }}>
                                                    Chỉnh sửa
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </main>
        </div>
    );
};


export default QuestManager;