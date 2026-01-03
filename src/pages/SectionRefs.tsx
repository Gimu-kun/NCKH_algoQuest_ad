import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { getYoutubeEmbedUrl } from "../service/utils/videoUtils";

const SectionRefs = ({ refs }: { refs?: any[] }) => {
    console.log(refs)
    if (!refs || refs.length === 0) return null;
  
    const videos = refs.filter(r => r.type === "video");
    const docs = refs.filter(r => r.type === "doc");
  
    return (
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
  
        {/* VIDEO */}
        {videos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              🎥 Video tham khảo
            </Typography>
  
            <Stack spacing={2}>
              {videos.map((v, i) => {
                const embedUrl = getYoutubeEmbedUrl(v.url);
                if (!embedUrl) return null;
  
                return (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      paddingTop: "56.25%",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                  >
                    <iframe
                      src={embedUrl}
                      title={`video-${i}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}
  
        {/* TÀI LIỆU */}
        {docs.length > 0 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              📄 Tài liệu đính kèm
            </Typography>
  
            <Stack spacing={1}>
              {docs.map((d, i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {d.url}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    href={d.url}
                    target="_blank"
                  >
                    Mở
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };
  
  export default SectionRefs;