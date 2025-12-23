import { Box, Button, Chip, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import formatDate from "../service/utils/dataFormat";
import { useState } from "react";
import type { topicType } from "../types/topicType";

type TopicRowProps = {
    topic: topicType;
    onAddQuest:(id: string, title: string) => void;
    onEdit: (id: string) => void;
};

const TopicRow = ({ topic, onEdit, onAddQuest }: TopicRowProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{whiteSpace:"nowrap"}}>{topic.id}</TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>
                    <Chip label={topic.status ? "Hoạt động" : "Tạm ngưng"} color={topic.status ? "success" : "error"} size="medium" />
                </TableCell>
                <TableCell>{topic.quests.length}</TableCell>
                <TableCell>{topic.indexOrder}</TableCell>
                <TableCell>{formatDate(topic.createdAt.toString())}</TableCell>
                <TableCell>{formatDate(topic.updatedAt.toString())}</TableCell>
                <TableCell>{topic.createdBy.username}</TableCell>
                <TableCell>{topic.updatedBy.username}</TableCell>
                <TableCell>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => onAddQuest(topic.id, topic.title)}>
                        Thêm màn chơi
                    </Button>
                    <br/>
                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="contained" color="secondary" onClick={() => onEdit(topic.id)}>
                        Cập nhật 
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={12} sx={{ p: 0, bgcolor: "#f3f4f6" }}>
                    <Collapse in={open}>
                        <Box m={1}>
                            <Typography variant="h6">Màn chơi</Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">ID</TableCell>
                                        <TableCell align="left">Kiểu</TableCell>
                                        <TableCell align="left">Tiêu đề</TableCell>
                                        <TableCell align="left">Mô tả</TableCell>
                                        <TableCell align="left">Trạng thái</TableCell>
                                        <TableCell align="left">Thứ tự</TableCell>
                                        <TableCell align="left">Tạo lúc</TableCell>
                                        <TableCell align="left">Cập nhật lúc</TableCell>
                                        <TableCell align="left">Tạo bởi</TableCell>
                                        <TableCell align="left">Cập nhật bởi</TableCell>
                                        <TableCell align="left">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topic.quests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                Không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        topic.quests.map(q => (
                                            <TableRow key={q.id}>
                                                <TableCell sx={{whiteSpace:"nowrap"}}>{q.id}</TableCell>
                                                <TableCell>{q.questType}</TableCell>
                                                <TableCell>{q.title}</TableCell>
                                                <TableCell>{q.description}</TableCell>
                                                <TableCell>
                                                    <Chip label={q.status ? "Hoạt động" : "Tạm ngưng"} color={q.status ? "success" : "error"} size="medium" />
                                                </TableCell>
                                                <TableCell>{q.indexOrder}</TableCell>
                                                <TableCell>{formatDate(q.createdAt.toString())}</TableCell>
                                                <TableCell>{formatDate(q.updatedAt.toString())}</TableCell>
                                                <TableCell>{q.createdBy.username}</TableCell>
                                                <TableCell>{q.updatedBy.username}</TableCell>
                                                <TableCell>
                                                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="contained" onClick={() => onEdit(topic.id)}>
                                                        Chi tiết
                                                    </Button>
                                                    <br/>
                                                    <Button sx={{marginBottom:1, fontSize:12, whiteSpace:"nowrap"}} size="small" variant="contained" color="error" onClick={() => onEdit(topic.id)}>
                                                        Xoá màn
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default TopicRow;