import { useEffect, useState } from "react";
import type { questType } from "../types/questType";
import { Button, Chip, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import questApiService from "../service/apis/questApiService";

function createData(data:questType) {
    return {
        id: data.id,
        topicId: data.topicId.id,
        title: data.title,
        decs: data.description,
        status: data.status,
        questType: data.questType,
        orderIndex: data.indexOrder,
        createBy: data.createdBy.username,
        updatedBy: data.updatedBy.username,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
}

const QuestManager = () => {
  const [questList, setQuestList] = useState<questType[]>([]);

  const rows = questList.map(item => createData(item));

  const getQuestList = async () => {
    try {
      const res = await questApiService.getAll();
      if (res.success && res.data) {
        setQuestList(res.data);
      }
    } catch (err) {
      alert("Lỗi khi lấy dữ liệu " + err);
    }
  };

  useEffect(() => {
    getQuestList();
  }, []);

  return (
    <div className="min-h-screen text-gray-800">
      <main className="p-6 md:p-8 lg:p-7">
        <h1 className="text-4xl font-bold mb-2">Quản lý màn chơi</h1>

        <div className="flex w-full items-center mb-5 mt-5 text-sm bg-amber-50 rounded-xl overflow-hidden">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ID chương</TableCell>
                  <TableCell align="left">Tiêu đề</TableCell>
                  <TableCell align="left">Mô tả</TableCell>
                  <TableCell align="left">Trạng thái</TableCell>
                  <TableCell align="left">Kiểu màn chơi</TableCell>
                  <TableCell align="left">Thứ tự</TableCell>
                  <TableCell align="left">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        Không có dữ liệu
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(row => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.topicId}</TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.decs}</TableCell>
                      <TableCell align="left">
                        <Switch checked={row.status} />
                      </TableCell>
                      <TableCell align="left">
                        <Chip label={row.questType == 'lesson' ? 'Bài học' : 
                          row.questType == 'questions' ? 'Trắc nghiệm' :
                          row.questType == 'visualization' ? 'Minh hoạ' : 'Không rõ'} 
                          color={row.questType == 'lesson' ? 'primary' : 
                          row.questType == 'questions' ? 'secondary' :
                          row.questType == 'visualization' ? 'success' : 'error'} size="medium" />
                      </TableCell>
                      <TableCell align="left">{row.orderIndex}</TableCell>
                      <TableCell align="left">
                        <Button variant="contained" size="small" sx={{marginLeft:0.5, marginRight:0.5}}>
                          Chi tiết
                        </Button>
                        <Button variant="outlined" size="small" sx={{marginLeft:0.5, marginRight:0.5}}>
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </div>
  );
};


export default QuestManager;