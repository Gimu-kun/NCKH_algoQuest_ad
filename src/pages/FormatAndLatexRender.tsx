import { LessonLatexRender } from "../components/ui/LessonLatexRender";

// 1. Hàm xử lý định dạng lồng nhau (Màu, đậm, căn lề)
const renderTextWithStyles = (text: string) => {
    let formatted = text;
    formatted = formatted.replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\[color=(.*?)\](.*?)\[\/color\]/g, '<span style="color: $1">$2</span>');
    formatted = formatted.replace(/\[align=(left|center|right)\](.*?)\[\/align\]/g, '<div style="text-align: $1">$2</div>');
    return formatted;
};

// 2. Component trung gian: Vừa Render Định dạng vừa Render Latex
const FormatAndLatexRender = ({ content }: { content: string }) => {
    // Bước 1: Xử lý các thẻ [b], [color], [align] thành HTML string
    const styledHtml = renderTextWithStyles(content);

    // Bước 2: Tách chuỗi HTML đó theo ký tự $ để tìm Latex
    const segments = styledHtml.split(/(\$.*?\$)/g);

    return (
        <span style={{ display: 'inline' }}>
            {segments.map((seg, i) => {
                if (seg.startsWith('$') && seg.endsWith('$')) {
                    // Nếu là Latex, dùng component render chuyên dụng
                    return <LessonLatexRender key={i} content={seg} images={[]} />;
                }
                // Nếu là văn bản (đã có chứa các thẻ <span> <strong> của bước 1)
                return <span key={i} dangerouslySetInnerHTML={{ __html: seg }} />;
            })}
        </span>
    );
};

export default FormatAndLatexRender;