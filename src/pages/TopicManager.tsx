import { Box, Button, Collapse, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useEffect, useState } from "react";
import topicApiService from "../service/apis/topicApiService";
import type { topicType } from "../types/topicType";

function createData(data:topicType) {
    return {
        id: data.id,
        title: data.title,
        decs: data.description,
        status: data.status,
        orderIndex: data.indexOrder,
        questCount: data.quests.length,
        quests: data.quests.map(q => {
            return {
                id: q.id,
                questType: q.questType,
                title: q.title,
                decs: q.description,
                status: q.status,
                orderIndex: q.indexOrder
            }
        }),
        createBy: data.createdBy.username,
        updatedBy: data.updatedBy.username,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="left">{row.title}</TableCell>
        <TableCell align="left">{row.decs}</TableCell>
        <TableCell align="left"><Switch defaultChecked={row.status} /></TableCell>
        <TableCell align="left">{row.questCount}</TableCell>
        <TableCell align="left">{row.orderIndex}</TableCell>
        <TableCell align="left"><Button variant="outlined" size="small">Chỉnh sửa</Button></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 , width:"100%", backgroundColor:"#f3f4f6"}} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Màn chơi
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Kiểu màn chơi</TableCell>
                    <TableCell align="left">Tiêu đề</TableCell>
                    <TableCell align="left">Mô tả</TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left">Thứ tự</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                  row.quests.length == 0 ?
                    <TableRow>
                        <TableCell colSpan={6} align="center">
                            <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu
                            </Typography>
                        </TableCell>
                    </TableRow>
                  :
                  row.quests.map((questRow) => (
                    <TableRow key={questRow.id}>
                      <TableCell component="th" scope="row">
                        {questRow.id}
                      </TableCell>
                      <TableCell>{questRow.questType}</TableCell>
                      <TableCell align="left">{questRow.title}</TableCell>
                      <TableCell align="left">{questRow.decs}</TableCell>
                      <TableCell align="left"><Switch defaultChecked={questRow.status} /></TableCell>
                      <TableCell align="left">{questRow.orderIndex}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


const TopicManager = () => {
    const [topicList, setTopicList] = useState<topicType[]>([]);

    const rows = topicList.map(item => createData(item));

    const getTopicList = async () => {
        try{
            const res = await topicApiService.getAll();
            if(res.success){
                if(res.data){
                    setTopicList(res.data)
                    console.log(res.data)
                }
            }
        }catch(err){
            alert("Lỗi khi lấy dữ liệu"+err);
        }
    };

    useEffect(()=>{
        getTopicList();
    },[]);
    
    return (
        <div className="min-h-screen text-gray-800">
            <main className="p-6 md:p-8 lg:p-7">
                <h1 className="text-4xl font-bold mb-2">Quản lý chủ đề</h1>
                <div className="flex w-full items-center space-x-8 mb-5 mt-5 text-sm bg-amber-50 mt-2 rounded-xl overflow-hidden">
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Tiêu đề</TableCell>
                                <TableCell align="left">Mô tả</TableCell>
                                <TableCell align="left">Trạng thái</TableCell>
                                <TableCell align="left">Số màn hiện có</TableCell>
                                <TableCell align="left">Thứ tự</TableCell>
                                <TableCell align="left">Thao tác</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <Row key={row.id} row={row} />
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </main>
        </div>
    )
}

export default TopicManager;