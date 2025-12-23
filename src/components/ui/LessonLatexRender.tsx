import { Box, Typography } from "@mui/material";
import { InlineMath } from "react-katex";

type UnifiedRenderProps = {
    content: string;
    // Chấp nhận mảng chứa cả File (đang upload) hoặc string (đã lưu)
    images: (File | string)[];
}

export const LessonLatexRender = ({ content, images }: UnifiedRenderProps) => {
    // Regex tách nội dung dựa trên công thức $...$ hoặc ký hiệu #pic1, #pic2...
    const parts = content.split(/(\$.*?\$|#pic\d+)/g);

    return parts.map((part, index) => {
        // 1. Xử lý Latex
        if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            return <InlineMath key={index} math={math} />;
        }

        // 2. Xử lý Hình ảnh
        if (part.startsWith('#pic')) {
            const picIndex = parseInt(part.replace('#pic', ''), 10) - 1;
            const imageData = images[picIndex];
            if (imageData) {
                let imageUrl = "";
                if (imageData instanceof File) {
                    imageUrl = URL.createObjectURL(imageData);
                } else if (typeof imageData === 'string') {
                    imageUrl = import.meta.env.VITE_HOST_URL + imageData;
                }
                console.log(imageUrl)
                return (
                    <Box
                        key={index}
                        component="span"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            textAlign: 'center', 
                            my: 2 
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt={`content-pic-${picIndex}`}
                            style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
                            // Giải phóng bộ nhớ nếu là Blob URL khi ảnh unmount
                            onLoad={() => {
                                if (imageData instanceof File) URL.revokeObjectURL(imageUrl);
                            }}
                        />
                        <Typography variant="caption" color="textSecondary" display="block">
                            Ảnh {picIndex + 1}
                        </Typography>
                    </Box>
                );
            }
            return <span key={index} style={{ color: 'red' }}>[Thiếu ảnh {picIndex + 1}]</span>;
        }

        // 3. Xử lý văn bản thường
        return <span key={index}>{part}</span>;
    });
};