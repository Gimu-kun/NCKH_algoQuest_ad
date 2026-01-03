import { Box, Button, Divider, Grid, IconButton, Modal, Stack, TextField, Typography, Paper, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo } from "react";
import { UploadFileOutlined, DeleteOutline, ContentCopy } from "@mui/icons-material";
import lessonApiService from "../service/apis/lessonApiService";
import LatexToolBtnGroup from "../components/ui/LatexToolBtnGroup";
import FormatAndLatexRender from "./FormatAndLatexRender";
import type { RefType } from "../types/lessonType";

const AddSectionModal = ({ open, onClose, lessonId, parentId, currentLevel }: any) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [refs, setRefs] = useState<RefType[]>([]);

    const getYoutubeId = (url: string): string | null => {
        if (!url) return null;

        const regex =
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const youtubePreviewId = useMemo(() => {
        const videoRef = refs.find(r => r.type === "video");
        return videoRef ? getYoutubeId(videoRef.url) : null;
    }, [refs]);

    const imagePreviewUrls = useMemo(() => {
        return images.map(file => URL.createObjectURL(file));
    }, [images]);

    const insertText = (text: string) => {
        const textarea = document.getElementById("section-input") as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = content.substring(0, start) + text + content.substring(end);
        setContent(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };


    const handleSubmit = async () => {
        if (!title.trim()) return alert("Vui lòng nhập tiêu đề!");

        setLoading(true);

        console.log(refs)
        const sectionData = {
            title,
            content,
            level: currentLevel,
            refs: refs.filter(r => r.url.trim() !== "")
        };

        const res = await lessonApiService.addSection(
            lessonId,
            sectionData,
            images,
            parentId
        );

        setLoading(false);

        if (res.success) {
            setTitle("");
            setContent("");
            setImages([]);
            setRefs([]);
            onClose(true);
        }
    };

    const addRef = () => {
        setRefs([...refs, { type: "video", url: "" }]);
    };

    const updateRef = (index: number, key: keyof RefType, value: string) => {
        const newRefs = [...refs];
        newRefs[index][key] = value as any;
        setRefs(newRefs);
    };

    const removeRef = (index: number) => {
        setRefs(refs.filter((_, i) => i !== index));
    };


    // --- LOGIC RENDER THÔNG MINH ---
    const SmartPreview = ({ text }: { text: string }) => {
        if (!text) return null;

        // Regex tìm cấu pháp #picN{mô tả} hoặc chỉ #picN
        // Ví dụ: #pic1{Hình tam giác đều}
        const parts = text.split(/(#pic\d+(?:\{.*?\})?)/g);

        return (
            <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}>
                {parts.map((part, index) => {
                    // 1. XỬ LÝ MỎ NEO ẢNH (#pic)
                    const picMatch = part.match(/#pic(\d+)(?:\{(.*?)\})?/);
                    if (picMatch) {
                        const imgIndex = parseInt(picMatch[1]) - 1;
                        const caption = picMatch[2] || `Ảnh minh họa ${picMatch[1]}`;
                        const imageUrl = imagePreviewUrls[imgIndex];

                        return imageUrl ? (
                            <Box key={index} sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img
                                    src={imageUrl}
                                    alt={caption}
                                    style={{ width: '400px', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}
                                >
                                    {caption}
                                </Typography>
                            </Box>
                        ) : (
                            <Box key={index} sx={{ color: 'error.main', p: 1, border: '1px dashed red', textAlign: 'center' }}>
                                [Lỗi: Chưa tải ảnh cho #pic{picMatch[1]}]
                            </Box>
                        );
                    }

                    // 2. XỬ LÝ MỎ NEO MỤC CON ([CHILD_N])
                    const childMatch = part.match(/\[CHILD_(\d+)\]/);
                    if (childMatch) {
                        return (
                            <Box key={index} sx={{ my: 3, p: 2, border: '2px dashed #1976d2', bgcolor: '#e3f2fd', textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="button" color="primary" sx={{ letterSpacing: 1.5, fontWeight: 'bold' }}>
                                    [ VỊ TRÍ MỤC CON SỐ {childMatch[1]} ]
                                </Typography>
                            </Box>
                        );
                    }

                    return <FormatAndLatexRender key={index} content={part} />;
                })}
            </Box>
        );
    };

    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '95%', maxWidth: 1300, bgcolor: 'white', borderRadius: 4, p: 4, maxHeight: '95vh', overflowY: 'auto'
            }}>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight="bold" color="primary">Biên tập nội dung mục</Typography>
                    <IconButton onClick={() => onClose()}><CloseIcon /></IconButton>
                </Stack>

                <Grid container spacing={4}>
                    {/* CỘT NHẬP LIỆU */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Tiêu đề mục" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />

                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Công cụ soạn thảo:</Typography>
                        <LatexToolBtnGroup insertLatex={insertText} />

                        <TextField
                            id="section-input" fullWidth multiline rows={15}
                            placeholder="Mẹo: Gõ #pic1{Mô tả ảnh} để chèn ảnh kèm chú thích."
                            value={content} onChange={e => setContent(e.target.value)}
                            sx={{ mt: 1, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
                        />

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                            <Button variant="contained" component="label" startIcon={<UploadFileOutlined />}>
                                Tải ảnh lên
                                <input type="file" hidden multiple accept="image/*" onChange={e => setImages([...images, ...Array.from(e.target.files || [])])} />
                            </Button>
                            <Typography variant="caption" color="text.secondary">Tải ảnh lên để lấy mã neo (#pic1, #pic2...)</Typography>
                        </Stack>
                        <Divider sx={{ my: 3 }} />
                        {youtubePreviewId && (
                            <Box
                                sx={{
                                    mb: 3,
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    border: "1px solid #e0e0e0"
                                }}
                            >
                                <iframe
                                    width="100%"
                                    height="360"
                                    src={`https://www.youtube.com/embed/${youtubePreviewId}`}
                                    title="YouTube video preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </Box>
                        )}
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            Tài liệu & Video tham khảo
                        </Typography>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {refs.map((ref, index) => (
                                <Paper key={index} sx={{ p: 2, bgcolor: "#fafafa" }} variant="outlined">
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Loại"
                                                SelectProps={{ native: true }}
                                                value={ref.type}
                                                onChange={e => updateRef(index, "type", e.target.value)}
                                            >
                                                <option value="video">Video</option>
                                                <option value="doc">Tài liệu</option>
                                            </TextField>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 8 }}>
                                            <TextField
                                                fullWidth
                                                label="URL"
                                                placeholder="https://..."
                                                value={ref.url}
                                                onChange={e => updateRef(index, "url", e.target.value)}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 1 }}>
                                            <IconButton color="error" onClick={() => removeRef(index)}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}

                            <Button variant="outlined" onClick={addRef}>
                                + Thêm tài liệu / video
                            </Button>
                        </Stack>

                        {/* DANH SÁCH ẢNH ĐÃ TẢI */}
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            {images.map((_, i) => (
                                <Box key={i} sx={{ position: 'relative', width: 80, textAlign: 'center' }}>
                                    <img src={imagePreviewUrls[i]} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
                                    <Typography variant="caption" fontWeight="bold" display="block">#pic{i + 1}</Typography>

                                    <Stack direction="row" sx={{ position: 'absolute', top: 2, right: 2 }} spacing={0.5}>
                                        <Tooltip title="Chèn mã neo">
                                            <IconButton size="small" sx={{ bgcolor: 'white', p: 0.2 }} onClick={() => insertText(`#pic${i + 1}{Nhập mô tả ảnh}`)}>
                                                <ContentCopy fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton size="small" color="error" sx={{ bgcolor: 'white', p: 0.2 }} onClick={() => setImages(images.filter((_, idx) => idx !== i))}>
                                            <DeleteOutline fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            ))}
                            {images.length === 0 && <Typography variant="body2" color="text.disabled">Chưa có ảnh nào được tải lên</Typography>}
                        </Box>
                    </Grid>

                    {/* CỘT XEM TRƯỚC */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" color="secondary" sx={{ mb: 1, fontWeight: 'bold' }}>XEM TRƯỚC KẾT QUẢ:</Typography>
                        <Paper variant="outlined" sx={{ p: 4, height: 650, overflowY: 'auto', bgcolor: '#fff', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800, mb: 2 }}>{title || "Tiêu đề mục"}</Typography>
                            <Divider sx={{ mb: 3 }} />

                            {content.includes("[CHILD_HERE]") ? (
                                <>
                                    <SmartPreview text={content.split("[CHILD_HERE]")[0]} />
                                    <Box sx={{ my: 4, p: 3, border: '2px dashed #1976d2', bgcolor: '#e3f2fd', textAlign: 'center', borderRadius: 2 }}>
                                        <Typography variant="button" color="primary" sx={{ letterSpacing: 1.5 }}>
                                            [ KHU VỰC HIỂN THỊ MỤC CON ]
                                        </Typography>
                                    </Box>
                                    <SmartPreview text={content.split("[CHILD_HERE]")[1]} />
                                </>
                            ) : (
                                <SmartPreview text={content} />
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                <Stack direction="row" justifyContent="flex-end" mt={4} spacing={2}>
                    <Button onClick={() => onClose()} size="large">Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={loading} size="large" sx={{ minWidth: 150 }}>
                        {loading ? "Đang xử lý..." : "Lưu bài viết"}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default AddSectionModal;