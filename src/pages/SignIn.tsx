import {
  IconButton,
  InputAdornment,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Input,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, type FormEvent } from "react";
import authApiService from "../service/apis/authApiService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

type SnackbarState = {
  open:boolean,
  message:string
}

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<SnackbarState>({open:false, message:""});
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClick = (text:string) => {
    setState({open:true, message:text});
  };

  const handleClose = () => {
    setState({open:false, message:""});
  };

  const saveToken = (token:string) => {
      Cookies.set("access_token", token, {
      expires: 7,
      secure: true,
      sameSite: "strict"
    });
  }

  const handleLogin = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const account = formData.get("account") as string;
    const password = formData.get("passwords") as string;
    console.log({ account, password });
    if(account == ""){
      handleClick("Tài khoản không được để trống");
      setLoading(false);
      return;
    }

    if(account.length < 4){
      handleClick("Tài khoản không được ít hơn 4 kí tự");
      setLoading(false);
      return;
    }

    if(password == ""){
      handleClick("Mật khẩu không được để trống");
      setLoading(false);
      return;
    }

    if(password.length < 4){
      handleClick("Mật khẩu không được ít hơn 4 kí tự");
      setLoading(false);
      return;
    }

    const res = await authApiService.login(account,password);
    handleClick(res.message);
    if(res.success){
      if(res.token){
        saveToken(res.token)
      }
      navigate("/main/dashboard")
    }
    setLoading(false);
  }

  return (
    <section className="p-10 rounded-lg bg-(--block-light-color) shadow-[6px_6px_7px_6px_rgba(0,0,0,0.1)]">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={state.open}
        onClose={handleClose}
        message={state.message}
      />
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex justify-center">
          <h1 className="uppercase text-2xl font-bold bg-linear-to-r from-slate-400 to-slate-700 bg-clip-text text-transparent">
            Đăng nhập quản trị viên
          </h1>
        </div>

        <TextField
          id="account-input"
          name="account"
          label="Tên tài khoản"
          variant="standard"
          fullWidth
        />

        <FormControl variant="standard" fullWidth>
          <InputLabel htmlFor="password-input">Mật khẩu</InputLabel>
          <Input
            id="password-input"
            type={showPassword ? "text" : "password"}
            name="passwords"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <div className="flex justify-center mt-4">
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              color: "var(--text-light-color)",
              backgroundImage:
                "linear-gradient(to right, #94a3b8, #334155)",
              backgroundSize: "200% 200%",
              backgroundPosition: "left",
              transition: "all 0.5s ease-in-out",
              "&:hover": {
                backgroundPosition: "right",
                backgroundImage:
                  "linear-gradient(to right, #94a3b8, #334155)",
              },
            }}
          >
            Đăng nhập
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SignIn;
