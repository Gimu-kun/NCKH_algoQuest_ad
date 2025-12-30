import { Box, Typography } from "@mui/material";
import FormatAndLatexRender from "./FormatAndLatexRender";
import SectionDetailItem from "./SectionDetailItem";

// --- RENDER NỘI DUNG THÔNG MINH (CHẾ ĐỘ CHỈ XEM) ---
const SmartContentDetailRender = ({ section }: { section: any }) => {
    const { content, images, children } = section;
    const imageUrls = images?.map((img: any) => img.url) || [];

    if (!content) return null;

    const parts = content.split(/(#pic\d+(?:\{.*?\})?|\[CHILD_\d+\])/g);

    return (
        <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}>
            {parts.map((part:any, index:number) => {
                // 1. Xử lý ảnh #pic
                const picMatch = part.match(/#pic(\d+)(?:\{(.*?)\})?/);
                if (picMatch) {
                    const imgIdx = parseInt(picMatch[1]) - 1;
                    const url = import.meta.env.VITE_HOST_URL + imageUrls[imgIdx];
                    return url ? (
                        <Box key={index} sx={{ my: 3, textAlign: 'center' }}>
                            <img src={url} style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                            <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                {picMatch[2] || `Hình ${picMatch[1]}`}
                            </Typography>
                        </Box>
                    ) : null;
                }

                // 2. Xử lý mục con [CHILD_N]
                const childMatch = part.match(/\[CHILD_(\d+)\]/);
                if (childMatch) {
                    const childIdx = parseInt(childMatch[1]) - 1;
                    const child = children && children[childIdx];
                    return child ? (
                        <SectionDetailItem key={index} section={child} />
                    ) : null;
                }

                return <FormatAndLatexRender key={index} content={part} />;
            })}
            {!content.includes("[CHILD_") && children?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {children.map((child: any) => (
                        <SectionDetailItem key={child.id} section={child} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SmartContentDetailRender;