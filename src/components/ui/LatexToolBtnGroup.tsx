import { Box, Button, Tooltip } from "@mui/material";
import { InlineMath } from "react-katex";

const LatexToolBtnGroup = ({insertLatex}:{insertLatex:(latex:string)=>void;}) => {
    const latexSymbols = [
        // Nhóm cấu trúc
        { label: '\\frac{a}{b}', latex: '\$\\frac{a}{b}$', tooltip: 'Phân số' },
        { label: '\\sqrt{a}', latex: '\$\\sqrt{a}$', tooltip: 'Căn bậc hai' },
        { label: '\\sqrt[n]{a}', latex: '\$\\sqrt[n]{a}$', tooltip: 'Căn bậc n' },
        { label: 'a^{b}', latex: '$a^{b}$', tooltip: 'Số mũ' },
        { label: 'a_{b}', latex: '$a_{b}$', tooltip: 'Chỉ số dưới' },

        // Nhóm toán tử và quan hệ
        { label: '±', latex: '\$\\pm$', tooltip: 'Cộng trừ' },
        { label: '×', latex: '\$\\times$', tooltip: 'Dấu nhân' },
        { label: '÷', latex: '\$\\div$', tooltip: 'Dấu chia' },
        { label: '≠', latex: '\$\\neq$', tooltip: 'Khác' },
        { label: '≈', latex: '\$\\approx$', tooltip: 'Xấp xỉ' },
        { label: '≤', latex: '\$\\le$', tooltip: 'Nhỏ hơn hoặc bằng' },
        { label: '≥', latex: '\$\\ge$', tooltip: 'Lớn hơn hoặc bằng' },

        // Nhóm logic và tập hợp
        { label: '⇒', latex: '\$\\Rightarrow$', tooltip: 'Suy ra' },
        { label: '⇔', latex: '\$\\Leftrightarrow$', tooltip: 'Tương đương' },
        { label: '∈', latex: '\$\\in$', tooltip: 'Thuộc tập hợp' },
        { label: '⊂', latex: '\$\\subset$', tooltip: 'Tập hợp con' },

        // Nhóm giải tích / cao cấp
        { label: '\\sum', latex: '\$\\sum_{i=1}^{n}{a}$', tooltip: 'Tổng' },
        { label: '\\int', latex: '\$\\int_{a}^{b}{c}$', tooltip: 'Tích phân' },
        { label: '\\infty', latex: '\$\\infty$', tooltip: 'Vô cùng' },
        { label: '\\pi', latex: '\$\\pi$', tooltip: 'Số Pi' },
        { label: '\\Delta', latex: '\$\\Delta$', tooltip: 'Delta (biệt thức)' },
        { label: '\\alpha', latex: '\$\\alpha$', tooltip: 'Alpha' },
    ];

    return (
        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {latexSymbols.map((symbol, index) => (
                <Tooltip key={index} title={symbol.tooltip}>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            minWidth: '40px',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            borderColor: '#ccc',
                            color: '#333'
                        }}
                        onClick={() => insertLatex(symbol.latex)}
                    >
                        <InlineMath math={symbol.label} />
                    </Button>
                </Tooltip>
            ))}
        </Box>
    );
};

export default LatexToolBtnGroup;