import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  Stack
} from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import topicApiService from "../service/apis/topicApiService";
import type { editTopicType } from "../types/topicType";

type Props = {
  isEdit: boolean;
  editingId: string | null;
  onClose: (message?: string, success?: boolean) => void;
};

const AddTopicModal = ({ isEdit, editingId, onClose }: Props) => {
  const [editingRow, setEditingRow] = useState<editTopicType | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isEdit && editingId) {
      topicApiService.getById(editingId).then(res => {
        if (res.success && res.data) {
          setEditingRow({
            title: res.data.title,
            description: res.data.description,
            indexOrder: res.data.indexOrder,
            status: res.data.status
          });
          setStatus(res.data.status);
        }
      });
    }
  }, [isEdit, editingId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (!isEdit) {
        const res = await topicApiService.addNew({
        title: fd.get("title-input") as string,
        description: fd.get("desc-input") as string,
        operatorId: user.id
        });
        onClose(res.message, res.success);
    } else if (editingId) {
      const res = await topicApiService.update(editingId, {
        title: fd.get("title-input") as string,
        description: fd.get("desc-input") as string,
        indexOrder: Number(fd.get("order-input")),
        status,
      },user.id);
      onClose(res.message, res.success);
    }
  };

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl w-1/4"
      >
        <h2 className="text-xl font-bold text-center mb-3">
          {isEdit ? "Cập nhật chủ đề" : "Thêm mới chủ đề"}
        </h2>

        <Input
          name="title-input"
          placeholder="Điền tiêu đề (ít nhất 4 kí tự)"
          defaultValue={editingRow?.title}
          fullWidth
        />

        <Input
          name="desc-input"
          placeholder="Điền mô tả chi tiết"
          defaultValue={editingRow?.description}
          fullWidth
          sx={{ mt: 2 }}
        />

        {isEdit && (
          <Input
            name="order-input"
            type="number"
            placeholder="Điền thứ tự chương"
            defaultValue={editingRow?.indexOrder}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}

        {isEdit && (
          <FormControl sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
              }
              label="Hoạt động"
            />
          </FormControl>
        )}

        <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
          <Button color="error" onClick={()=>{onClose()}}>
            Đóng
          </Button>
          <Button variant="contained" type="submit">
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Stack>
      </form>
    </section>
  );
};

export default AddTopicModal;
