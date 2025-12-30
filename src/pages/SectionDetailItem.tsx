import { Box, Typography } from "@mui/material";
import SmartContentDetailRender from "./SmartContentDetailRender";

// --- ITEM TỪNG MỤC (CHẾ ĐỘ CHỈ XEM) ---
const SectionDetailItem = ({ section }: { section: any }) => {
    return (
        <Box sx={{ 
            ml: section.level > 1 ? 3 : 0, 
            pl: section.level > 1 ? 2 : 0, 
            borderLeft: section.level > 1 ? '2px solid #eceff1' : 'none',
            mb: 4 
        }}>
            <Typography 
                variant={section.level === 1 ? "h5" : "h6"} 
                color="primary.main" 
                fontWeight="bold" 
                gutterBottom
            >
                {section.title}
            </Typography>
            <SmartContentDetailRender section={section} />
        </Box>
    );
};

export default SectionDetailItem;