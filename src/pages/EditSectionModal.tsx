import { Box, Button, Divider, Grid, IconButton, Modal, Stack, TextField, Typography, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo, useEffect } from "react";
import { UploadFileOutlined, DeleteOutline, Save } from "@mui/icons-material";
import lessonApiService from "../service/apis/lessonApiService";
import LatexToolBtnGroup from "../components/ui/LatexToolBtnGroup";
import FormatAndLatexRender from "./FormatAndLatexRender";

const EditSectionModal = ({ open, onClose, section }: any) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [newImages, setNewImages] = useState<File[]>([]); 
    const [loading, setLoading] = useState(false);

    const newImagePreviewUrls = useMemo(() => {
        return newImages.map(file => URL.createObjectURL(file));
    }, [newImages]);

    const oldImageUrls = useMemo(() => {
        return section?.images?.map((img: any) => img.url) || [];
    }, [section]);

    useEffect(() => {
        if (section && open) {
            setTitle(section.title || "");
            setContent(section.content || "");
            setNewImages([]);
        }
    }, [section, open]);

    const insertText = (text: string) => {
        const textarea = document.getElementById("edit-section-input") as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = content.substring(0, start) + text + content.substring(end);
        setContent(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const handleUpdate = async () => {
        if (!title.trim()) return alert("Vui lòng nhập tiêu đề!");
        setLoading(true);
        const res = await lessonApiService.updateSection(section.id, { title, content }, newImages);
        setLoading(false);
        if (res.success) onClose(true);
        else alert(res.message);
    };

    // --- LOGIC RENDER PREVIEW CẬP NHẬT ---
    const SmartPreview = ({ text }: { text: string }) => {
        if (!text) return null;
        
        // Regex bắt: #picN{caption}, #picN, hoặc [CHILD_N]
        const parts = text.split(/(#pic\d+(?:\{.*?\})?|\[CHILD_\d+\])/g);

        return (
            <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}>
                {parts.map((part, index) => {
                    // 1. Xử lý ảnh (#pic)
                    const picMatch = part.match(/#pic(\d+)(?:\{(.*?)\})?/);
                    if (picMatch) {
                        const imgIdx = parseInt(picMatch[1]) - 1;
                        const caption = picMatch[2] || `Ảnh minh họa ${picMatch[1]}`;
                        
                        // Ưu tiên ảnh mới chọn, nếu không có thì lấy ảnh cũ từ server
                        const url = newImages.length > 0 
                            ? newImagePreviewUrls[imgIdx] 
                            : (oldImageUrls[imgIdx] ? import.meta.env.VITE_HOST_URL + oldImageUrls[imgIdx] : null);

                        return url ? (
                            <Box key={index} sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img src={url} alt={caption} style={{ width: '400px', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Typography variant="subtitle2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary', textAlign: 'center' }}>{caption}</Typography>
                            </Box>
                        ) : <Box key={index} sx={{ color: 'error.main', p: 1, border: '1px dashed red', textAlign: 'center' }}>[Thiếu ảnh cho {part}]</Box>;
                    }

                    // 2. Xử lý mục con ([CHILD_N])
                    const childMatch = part.match(/\[CHILD_(\d+)\]/);
                    if (childMatch) {
                        return (
                            <Box key={index} sx={{ my: 3, p: 2, border: '2px dashed #1976d2', bgcolor: '#e3f2fd', textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="button" color="primary" sx={{ fontWeight: 'bold' }}>
                                    [ VỊ TRÍ MỤC CON SỐ {childMatch[1]} ]
                                </Typography>
                            </Box>
                        );
                    }

                    // 3. Văn bản, Latex & Định dạng
                    return <FormatAndLatexRender key={index} content={part} />;
                })}
            </Box>
        );
    };

    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '95%', maxWidth: 1300, bgcolor: 'white', borderRadius: 4, p: 4, maxHeight: '95vh', overflowY: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight="bold" color="primary">Chỉnh sửa nội dung</Typography>
                    <IconButton onClick={() => onClose()}><CloseIcon /></IconButton>
                </Stack>

                <Grid container spacing={4}>
                    <Grid size={{xs:12, md:6}}>
                        <TextField fullWidth label="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
                        <LatexToolBtnGroup insertLatex={insertText} />
                        <TextField id="edit-section-input" fullWidth multiline rows={12} value={content} onChange={e => setContent(e.target.value)} sx={{ mt: 1, '& .MuiInputBase-root': { fontFamily: 'monospace' } }} />

                        {/* QUẢN LÝ ẢNH TRONG MODAL EDIT */}
                        <Box sx={{ mt: 3, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fafafa' }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Hình ảnh minh họa:</Typography>
                            <Button variant="outlined" component="label" startIcon={<UploadFileOutlined />} sx={{ mb: 2 }}>
                                Tải ảnh mới (Thay thế toàn bộ ảnh cũ)
                                <input type="file" hidden multiple accept="image/*" onChange={e => setNewImages(Array.from(e.target.files || []))} />
                            </Button>

                            {newImages.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {newImages.map((_, i) => (
                                        <Box key={i} sx={{ position: 'relative', border: '2px solid #2196f3', p: 0.5, borderRadius: 1 }}>
                                            <img src={newImagePreviewUrls[i]} width={60} height={60} style={{ objectFit: 'cover' }} />
                                            <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(33, 150, 243, 0.8)', color: 'white', textAlign: 'center', fontSize: '10px' }}>#pic{i+1}</Typography>
                                            <IconButton size="small" sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white' }} onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))}><DeleteOutline fontSize="small" color="error" /></IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {oldImageUrls.map((url: string, i: number) => (
                                        <Box key={i} sx={{ position: 'relative', border: '1px solid #ccc', p: 0.5, borderRadius: 1 }}>
                                            <img src={import.meta.env.VITE_HOST_URL + url} width={60} height={60} style={{ objectFit: 'cover' }} />
                                            <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', textAlign: 'center', fontSize: '10px' }}>#pic{i+1}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{xs:12, md:6}}>
                        <Typography variant="subtitle2" color="secondary" gutterBottom fontWeight="bold">XEM TRƯỚC:</Typography>
                        <Paper variant="outlined" sx={{ p: 4, height: 600, overflowY: 'auto', borderRadius: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">{title || "Tiêu đề"}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <SmartPreview text={content} />
                        </Paper>
                    </Grid>
                </Grid>

                <Stack direction="row" justifyContent="flex-end" mt={4} spacing={2}>
                    <Button onClick={() => onClose()}>Hủy</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleUpdate} disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default EditSectionModal;