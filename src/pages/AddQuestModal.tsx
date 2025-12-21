import { Divider, FormControl, Input, InputLabel, NativeSelect, CircularProgress, Backdrop, TextareaAutosize, Button, Grid, Stack, TextField, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import topicApiService from "../service/apis/topicApiService";
import 'katex/dist/katex.min.css';
import { AddBoxOutlined, DeleteOutline } from "@mui/icons-material";
import type { TopicSelectType } from "../types/topicType";

type Props = {
    isEdit: boolean;
    editingId: string | null;
    onClose: (message?: string, success?: boolean) => void;
};

const AddQuestModal = ({ isEdit, onClose }: Props) => {
    //#region Biến toàn cục
    const [topicSelectorLs, setTopicSelectorLs] = useState<TopicSelectType[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [refVideo, setRefVideo] = useState<string>("");

    //biến trạng thái ẩn/hiện các khối chính
    const [lessonFormState, setLessonFormState] = useState<boolean>(false)
    const [refFormState, setRefFormState] = useState<boolean>(false)
    const [quizFormState, setQuizFormState] = useState<boolean>(false)
    const [visualFormState, setVisualFormState] = useState<boolean>(false)

    //biến trạng thái xác định kiểu minh hoạ đang chọn
    const [activeVisual, setActiveVisual] = useState<string>("null")
    //#endregion
    //#region Hàm khởi tạo nội dung
    const getTopicList = async () => {
        try {
            const res = await topicApiService.getAll();
            if (res.success && res.data) {
                let topicArr: Array<TopicSelectType> = res.data.map(item => {
                    return {
                        id: item.id,
                        title: item.title,
                        status: item.status
                    }
                }).filter(item => item.status == true)
                setTopicSelectorLs(topicArr);
            }
        } catch {
            alert("Lỗi khi lấy dữ liệu");
        }
    }

    useEffect(() => {
        setLoading(true);
        getTopicList();
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [])
    //#endregion

    const handleSubmit = () => {

    }

    return (
        <section className="fixed w-screen  inset-0 flex items-center justify-center bg-black/20 z-10">
            <Backdrop open={loading} sx={{ zIndex: 100 }}>
                <CircularProgress />
            </Backdrop>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-5 rounded-xl w-min-1/2 h-9/10 overflow-y-auto"
            >
                <h2 className="text-xl font-bold text-center mb-3">
                    {isEdit ? "Cập nhật chủ đề" : "Thêm mới chủ đề"}
                </h2>
                {/*-------------- Các trường chung ----------------*/}
                <FormControl sx={{ mr: 2 }}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native" shrink={Boolean(topicSelectorLs)}>
                        Chọn chương
                    </InputLabel>
                    <NativeSelect
                        defaultValue={"null"}>
                        <option key={"null"} value={"null"} disabled>Chọn chương</option>
                        {
                            topicSelectorLs.length != 0 && topicSelectorLs.map(
                                item => <option key={item.id} value={item.id}>{item.title}</option>
                            )
                        }
                    </NativeSelect>
                </FormControl>
                <Input
                    name="title-input"
                    placeholder="Điền tiêu đề (ít nhất 4 kí tự)"
                    //defaultValue={editingRow?.title}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Input
                    name="desc-input"
                    placeholder="Điền mô tả tổng quát"
                    //defaultValue={editingRow?.description}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <Divider sx={{ mt: 2, mb: 2 }} textAlign="left">Phần thưởng</Divider>
                <Grid size={3} container spacing={2} mt={1} mb={1} >
                    <TextField
                        label="Kinh nghiệm"
                        type="number"
                        defaultValue={0}
                        inputProps={{ min: 1, max: 10 }}
                    />
                    <TextField
                        label="Số gỗ"
                        type="number"
                        defaultValue={0}
                        inputProps={{ min: 1, max: 10 }}
                    />
                    <TextField
                        label="Số đá"
                        type="number"
                        defaultValue={0}
                        inputProps={{ min: 1, max: 10 }}
                    />
                </Grid>
                <Stack>
                    <Collapse in={refFormState}>
                        {/*-------------- Các trường tài liệu tham khảo ----------------*/}
                        <Divider sx={{ mt: 2, mb: 2, color: "purple", fontWeight: 700 }} textAlign="left">Điền thông tin tài liệu tham khảo</Divider>
                        <FormControl fullWidth>
                            {
                                refVideo != "" &&
                                <Stack flex={"row"} alignItems={"center"}>
                                    <iframe
                                        width="560"
                                        height="315"
                                        src="https://www.youtube.com/embed/VwRGw_Ip9Yo"
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen>
                                    </iframe>
                                </Stack>
                            }
                            <Input
                                name="ref-video"
                                placeholder="Điền link video tham khảo"
                                onChange={(e) => { setRefVideo(e.target.value) }}
                                //defaultValue={editingRow?.title}
                                fullWidth
                                sx={{ mt: 2, mb: 1 }}
                            />
                            <Input
                                name="ref-doc"
                                placeholder="Điền link tài liệu tham khảo"
                                onChange={(e) => { setRefVideo(e.target.value) }}
                                //defaultValue={editingRow?.title}
                                fullWidth
                                sx={{ mt: 2, mb: 1 }}
                            />
                            <Button sx={{ mb: 2, width: "100%" }} color="error" variant="contained" component="label" onClick={() => { setRefFormState(false) }}>
                                <DeleteOutline /> Xoá khối
                            </Button>
                        </FormControl>
                    </Collapse>
                    <Collapse in={quizFormState}>
                        {/*-------------- Các trường kiểu bài tập trắc nghiệm ----------------*/}
                        <Divider sx={{ mt: 2, mb: 2, color: "purple", fontWeight: 700 }} textAlign="left">Điền thông tin trắc nghiệm</Divider>
                        <FormControl fullWidth>
                            <Button sx={{ mb: 2, width: "100%" }} color="error" variant="contained" component="label" onClick={() => { setQuizFormState(false) }}>
                                <DeleteOutline /> Xoá khối
                            </Button>
                        </FormControl>
                    </Collapse>
                    <Collapse in={visualFormState}>
                        {/*-------------- Các trường kiểu minh hoạ trực quan ----------------*/}
                        <Divider sx={{ mt: 2, mb: 2, color: "purple", fontWeight: 700 }} textAlign="left">Điền thông tin minh hoạ trực quan</Divider>
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native" shrink={Boolean(topicSelectorLs)}>
                                Chọn chủ đề minh hoạ
                            </InputLabel>
                            <NativeSelect defaultValue={"null"} onChange={(e) => { setActiveVisual(e.target.value) }}>
                                <option key={"null"} value={"null"} disabled>Chủ đề minh hoạ</option>
                                <option key={"V-1"} value={"V-1"}>Độ phức tạp thuật toán</option>
                                <option key={"V-2"} value={"V-2"}>CRUD danh sách liên kết đơn</option>
                                <option key={"V-3"} value={"V-3"}>Bubble sort</option>
                                <option key={"V-4"} value={"V-4"}>Minh hoạ hàng chờ (FIFO)</option>
                                <option key={"V-5"} value={"V-5"}>Minh hoạ ngăn xếp (FILO)</option>
                                <option key={"V-6"} value={"V-6"}>Cây nhị phân</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl fullWidth>
                            <Input
                                name="complex-title-input"
                                placeholder="Điền đề bài"
                                //defaultValue={editingRow?.title}
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                            <Collapse in={activeVisual != "null"}>
                                <Divider sx={{ mt: 2, mb: 2, color: "purple", fontWeight: 700 }} textAlign="left">Dữ liệu chi tiết</Divider>
                                {
                                    activeVisual == "V-1" &&
                                    <>
                                        <Input
                                            name="complex-var-input"
                                            placeholder="Điền tham chiếu (n) - mặc định int"
                                            //defaultValue={editingRow?.title}
                                            fullWidth
                                            sx={{ mt: 2, mb: 2 }}
                                        />
                                        <TextareaAutosize
                                            id="complex-display-code"
                                            aria-label="empty textarea"
                                            placeholder="Điền code mẫu"
                                            value={""}
                                            onChange={() => {}}
                                            style={{ width: "100%", minHeight: 100, padding: 10, border: "1px solid #000000", borderRadius: 5 }}
                                        />
                                    </>
                                }
                                {
                                    activeVisual == "V-2" &&
                                    <>
                                        <Input
                                            name="linklist-template-input"
                                            placeholder="Nhập dãy giá trị trong danh sách mặc định [value1,value2,...]"
                                            //defaultValue={editingRow?.title}
                                            fullWidth
                                            sx={{ mt: 2, mb: 2 }}
                                        />

                                    </>
                                }
                                {
                                    activeVisual == "V-3" &&
                                    <>
                                        <Input
                                            name="bbsort-template-input"
                                            placeholder="Nhập dãy giá trị mảng mặc định [value1,value2,...]"
                                            //defaultValue={editingRow?.title}
                                            fullWidth
                                            sx={{ mt: 2, mb: 2 }}
                                        />

                                    </>
                                }
                                {
                                    activeVisual == "V-4" &&
                                    <>
                                        <Input
                                            name="fifo-template-input"
                                            placeholder="Nhập dãy giá trị hàng chờ mặc định [value1,value2,...]"
                                            //defaultValue={editingRow?.title}
                                            fullWidth
                                            sx={{ mt: 2, mb: 2 }}
                                        />

                                    </>
                                }
                                {
                                    activeVisual == "V-5" &&
                                    <>
                                        <Input
                                            name="filo-template-input"
                                            placeholder="Nhập dãy giá trị ngăn xếp mặc định [value1,value2,...]"
                                            //defaultValue={editingRow?.title}
                                            fullWidth
                                            sx={{ mt: 2, mb: 2 }}
                                        />

                                    </>
                                }
                                {
                                    activeVisual == "V-6" &&
                                    <>
                                        <Input
                                            name="bntree-template-input"
                                            placeholder="Nhập dãy giá trị cây mặc định kiểu value(left,right) (vd: 1(2(4,5),3))"
                                            //defaultValue={editingRow?.title}
                                            fullWidth
                                            sx={{ mt: 2, mb: 2 }}
                                        />

                                    </>
                                }
                            </Collapse>
                            <Button sx={{ mt: 2, mb: 2, width: "100%" }} color="error" variant="contained" component="label" onClick={() => { setVisualFormState(false) }}>
                                <DeleteOutline /> Xoá khối
                            </Button>
                        </FormControl>
                    </Collapse>
                    {!lessonFormState && <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setLessonFormState(true) }}><AddBoxOutlined />Thêm thông tin bài học</Button>}
                    {!refFormState && <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setRefFormState(true) }}><AddBoxOutlined /> Thêm tài liệu tham khảo</Button>}
                    {!quizFormState && <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setQuizFormState(true) }}><AddBoxOutlined /> Thêm danh sách bài tập</Button>}
                    {!visualFormState && <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setVisualFormState(true) }}><AddBoxOutlined /> Thêm minh hoạ trực quan</Button>}
                </Stack>
                <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="outlined" color="error" onClick={() => { onClose() }}>
                        Đóng
                    </Button>
                    <Button variant="contained" type="submit">
                        {isEdit ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </Stack>
            </form>
        </section>
    )
}

export default AddQuestModal;