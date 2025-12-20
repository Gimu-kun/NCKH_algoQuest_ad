import {Backdrop, Box, Button, Collapse, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from "react";
import formatDate from "../service/utils/dataFormat";
import lessonApiService from "../service/apis/lessonApiService";
import AddLessonModal from "./AddLessonModal";
import { LessonListLatexRender } from "../components/ui/LessonLatexRender";

const Row = (props: { row: any }) => {
    const {row} = props;
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row"><b>{row.id}</b></TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>{formatDate(row.updatedAt)}</TableCell>
                <TableCell>{row.createdBy.username}</TableCell>
                <TableCell>{row.createdBy.username}</TableCell>
                <TableCell>
                    <Button sx={{marginLeft:1}} size="small" variant="contained" color="secondary">Sửa</Button>
                    <Button sx={{marginLeft:1}} size="small" variant="outlined" color="error">Xoá</Button>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom component="div" color="primary">
                                Chi tiết bài học
                            </Typography>
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
                                <LessonListLatexRender content={row.content} images={row.lessonImgs.map((item:any)=>item.url)}/>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Hình ảnh minh họa ({row.lessonImgs.length}):</Typography>
                                <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                    {row.lessonImgs.map((img: any) => (
                                        <Box key={img.id} sx={{ textAlign: 'center' }}>
                                            <img 
                                                src={import.meta.env.VITE_HOST_URL+img.url}
                                                alt="lesson" 
                                                style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }} 
                                            />
                                            <Typography variant="caption" display="block">Thứ tự: {img.indexOrder}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const LessonManager = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [lessons, setLessons] = useState<any[]>([]);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const fetchLessons = async () => {
        try {
            const res = await lessonApiService.getAll();
            if (res.success && res.data) {
                setLessons(res.data);
            }
        } catch {
            alert("Lỗi khi lấy dữ liệu");
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [isModalOpen]);

    return (
        <Box sx={{ p: 3 }}>
            <Backdrop open={isModalOpen} sx={{ zIndex: 100 }}>
                <Stack sx={{maxHeight:"90%",overflowY:"auto"}}>
                    <AddLessonModal
                        onClose={handleCloseModal}
                    />
                </Stack>
            </Backdrop>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Quản lý bài học</Typography>
                <Button variant="contained" onClick={()=>{setModalOpen(true)}}>Thêm bài học mới</Button>
            </Stack>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table aria-label="collapsible table">
                    <TableHead sx={{ backgroundColor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell width="50px" />
                            <TableCell>ID</TableCell>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Tạo lúc</TableCell>
                            <TableCell>Cập nhật lúc</TableCell>
                            <TableCell>Người tạo</TableCell>
                            <TableCell>Người cập nhật</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessons.map((lesson) => (
                            <Row key={lesson.id} row={lesson} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default LessonManager;