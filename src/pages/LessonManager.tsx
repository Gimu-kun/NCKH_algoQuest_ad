import { Backdrop, Box, Button, Collapse, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from "react";
import formatDate from "../service/utils/dataFormat";
import lessonApiService from "../service/apis/lessonApiService";
import AddLessonModal from "./AddLessonModal";
import AddSectionModal from "./AddSectionModal";
import EditSectionModal from "./EditSectionModal";
import type { LessonSectionType, LessonType } from "../types/lessonType";
import FormatAndLatexRender from "./FormatAndLatexRender";

// --- COMPONENT TRỢ GIÚP: RENDER NỘI DUNG THÔNG MINH ---
const SmartContentRender = ({ section, onRefresh, onAddChild }: {
    section: LessonSectionType,
    onRefresh: () => void,
    onAddChild: (parentId: string, level: number) => void
}) => {
    const { content, images, children } = section;
    const imageUrls = images?.map(img => img.url) || [];

    if (!content) return null;

    // Regex tách: #picN{caption}, #picN, hoặc [CHILD_N]
    const parts = content.split(/(#pic\d+(?:\{.*?\})?|\[CHILD_\d+\])/g);

    return (
        <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}>
            {parts.map((part, index) => {
                // 1. Xử lý mỏ neo ảnh #pic
                const picMatch = part.match(/#pic(\d+)(?:\{(.*?)\})?/);
                if (picMatch) {
                    const imgIdx = parseInt(picMatch[1]) - 1;
                    const url = import.meta.env.VITE_HOST_URL + imageUrls[imgIdx];
                    return url ? (
                        <Box key={index} sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={url} style={{ width: '500px', maxWidth: '100%', borderRadius: '8px' }} />
                            <Typography variant="subtitle2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                {picMatch[2] || `Ảnh ${picMatch[1]}`}
                            </Typography>
                        </Box>
                    ) : null;
                }

                // 2. Xử lý mỏ neo mục con [CHILD_N]
                const childMatch = part.match(/\[CHILD_(\d+)\]/);
                if (childMatch) {
                    const childIdx = parseInt(childMatch[1]) - 1;
                    const child = children && children[childIdx];

                    return child ? (
                        <Box key={index} sx={{ my: 2 }}>
                            <SectionItem section={child} onRefresh={onRefresh} onAddChild={onAddChild} />
                        </Box>
                    ) : (
                        <Box key={index} sx={{ p: 1, my: 1, border: '1px dashed #ccc', borderRadius: 1, color: 'text.disabled', textAlign: 'center', fontSize: '0.8rem' }}>
                            [Mục con số {childMatch[1]} chưa khởi tạo]
                        </Box>
                    );
                }

                // XỬ LÝ VĂN BẢN TỔNG HỢP (LATEX + FORMAT)
                return <FormatAndLatexRender key={index} content={part} />;
            })}

            {/* PHÒNG HỜ: Nếu user không đặt mỏ neo [CHILD_N], tự động hiện mục con ở cuối */}
            {!content.includes("[CHILD_") && children && children.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {children.map(child => (
                        <SectionItem key={child.id} section={child} onRefresh={onRefresh} onAddChild={onAddChild} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

// --- COMPONENT CON: HIỂN THỊ TỪNG MỤC NỘI DUNG (SECTION) ---
const SectionItem = ({ section, onRefresh, onAddChild }: {
    section: LessonSectionType,
    onRefresh: () => void,
    onAddChild: (parentId: string, level: number) => void
}) => {
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Xóa mục "${section.title}" và toàn bộ nội dung bên trong?`)) {
            const res = await lessonApiService.deleteSection(section.id);
            if (res.success) onRefresh();
        }
    };

    return (
        <Box sx={{ ml: (section.level - 1) * 2, borderLeft: '2px solid #eee', pl: 2, mb: 4, position: 'relative' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant={section.level === 1 ? "h6" : "subtitle1"} color="primary" fontWeight="bold">
                    {section.title}
                </Typography>

                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" color="info" onClick={() => setEditModalOpen(true)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Thêm mục con">
                        <IconButton size="small" onClick={() => onAddChild(section.id, section.level + 1)}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa mục">
                        <IconButton size="small" color="error" onClick={handleDelete}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <SmartContentRender section={section} onRefresh={onRefresh} onAddChild={onAddChild} />

            <EditSectionModal
                open={editModalOpen}
                section={section}
                onClose={(success: boolean) => {
                    setEditModalOpen(false);
                    if (success) onRefresh();
                }}
            />
        </Box>
    );
};

// --- COMPONENT CON: DÒNG BẢNG BÀI HỌC ---
const Row = ({ row, onRefresh }: { row: LessonType, onRefresh: () => void }) => {
    const [open, setOpen] = useState(false);
    const [sectionModal, setSectionModal] = useState<{ open: boolean, parentId: string | null, level: number }>({
        open: false, parentId: null, level: 1
    });

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:hover': { bgcolor: '#fcfcfc' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{whiteSpace:'nowrap'}}><b>{row.id}</b></TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.topic.title}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>{formatDate(row.updatedAt)}</TableCell>
                <TableCell>{row.createdBy?.username || 'System'}</TableCell>
                <TableCell>{row.updatedBy?.username || 'System'}</TableCell>
                <TableCell sx={{display:'flex'}}>
                    <IconButton>
                        <EditIcon/>
                    </IconButton>
                    <IconButton color="error" onClick={async () => {
                        if (window.confirm("Xóa vĩnh viễn toàn bộ bài học?")) {
                            const res = await lessonApiService.deleteLesson(row.id);
                            if (res.success) onRefresh();
                        }
                    }}><DeleteIcon /></IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2, p: 3, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight="bold">Cấu trúc bài giảng</Typography>
                                <Button variant="contained" size="small" startIcon={<AddIcon />}
                                    onClick={() => setSectionModal({ open: true, parentId: null, level: 1 })}
                                >Thêm mục lớn (H1)</Button>
                            </Stack>
                            <Divider sx={{ mb: 3 }} />
                            {row.sections?.sort((a, b) => a.orderIndex - b.orderIndex).filter(sec => !sec.parentId).map(sec => (
                                <SectionItem key={sec.id} section={sec} onRefresh={onRefresh}
                                    onAddChild={(pid, lvl) => setSectionModal({ open: true, parentId: pid, level: lvl })}
                                />
                            ))}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <AddSectionModal
                open={sectionModal.open} lessonId={row.id} parentId={sectionModal.parentId} currentLevel={sectionModal.level}
                onClose={(success: any) => { setSectionModal({ ...sectionModal, open: false }); if (success) onRefresh(); }}
            />
        </React.Fragment>
    );
};

// --- COMPONENT CHÍNH ---
const LessonManager = () => {
    const [lessons, setLessons] = useState<LessonType[]>([]);

    const [addModalOpen, setAddModalOpen] = useState(false);

    const loadData = async () => {
        const res = await lessonApiService.getAll();
        if (res.success) setLessons(res.data || []);
    };

    useEffect(() => { loadData(); }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Backdrop open={addModalOpen} sx={{ zIndex: 1201 }}>
                <AddLessonModal onClose={(_, success) => { setAddModalOpen(false); if (success) loadData(); }} />
            </Backdrop>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Quản lý bài học</Typography>
                </Box>
                <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>Bài học mới</Button>
            </Stack>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f7f9' }}>
                        <TableRow>
                            <TableCell width="60px" />
                            <TableCell>Mã số</TableCell>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Chương</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Ngày cập nhật</TableCell>
                            <TableCell>Người tạo</TableCell>
                            <TableCell>Người cập nhật</TableCell>
                            <TableCell width="100px">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lessons.map((lesson) => <Row key={lesson.id} row={lesson} onRefresh={loadData} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LessonManager;