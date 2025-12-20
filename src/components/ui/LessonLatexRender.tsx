import { Box, Typography } from "@mui/material";
import { InlineMath } from "react-katex";

type LessonProps = {
    content: string,
    images: File[]
}

type LessonListProps = {
    content: string,
    images: string[]
}

export const LessonLatexRender = ({ content, images }: LessonProps) => {
    const parts = content.split(/(\$.*?\$|#pic\d+)/g);

    return parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            return <InlineMath key={index} math={math} />;
        }

        if (part.startsWith('#pic')) {
            const picIndex = parseInt(part.replace('#pic', ''), 10) - 1;
            const imageFile = images[picIndex];

            if (imageFile) {
                const imageUrl = URL.createObjectURL(imageFile);
                return (
                    <Box
                        key={index}
                        component="span"
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', my: 2 }}
                    >
                        <img
                            src={imageUrl}
                            alt={`content-pic-${picIndex}`}
                            style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
                        />
                        <Typography variant="caption" color="textSecondary" display="block">
                            Ảnh {picIndex + 1}
                        </Typography>
                    </Box>
                );
            }
            return <span key={index} style={{ color: 'red' }}>[Thiếu ảnh {picIndex + 1}]</span>;
        }
        return <span key={index}>{part}</span>;
    });
};

export const LessonListLatexRender = ({ content, images }: LessonListProps) => {
    console.log(images)
    const parts = content.split(/(\$.*?\$|#pic\d+)/g);

    return parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            return <InlineMath key={index} math={math} />;
        }

        if (part.startsWith('#pic')) {
            const picIndex = parseInt(part.replace('#pic', ''), 10) - 1;
            const imageUrl = images[picIndex];
            console.log(import.meta.env.VITE_HOST_URL+imageUrl)
            if (imageUrl) {
                return (
                    <Box
                        key={index}
                        component="span"
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', my: 2 }}
                    >
                        <img
                            src={import.meta.env.VITE_HOST_URL+imageUrl}
                            alt={`content-pic-${picIndex}`}
                            style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
                        />
                        <Typography variant="caption" color="textSecondary" display="block">
                            Ảnh {picIndex + 1}
                        </Typography>
                    </Box>
                );
            }
            return <span key={index} style={{ color: 'red' }}>[Thiếu ảnh {picIndex + 1}]</span>;
        }
        return <span key={index}>{part}</span>;
    });
};

