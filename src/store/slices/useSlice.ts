import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserGeneral {
  id: string,
  username: string,
  fullname: string,
  role: boolean
}

const initialState: UserGeneral = {
  id: 'U-123',
  username: 'abcd',
  fullname: 'lehieunghiem',
  role: true
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init:(state, action: PayloadAction<UserGeneral>)=>{
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.fullname = action.payload.fullname;
        state.role = action.payload.role;
    }
  },
})

export const { init } = userSlice.actions

export default userSlice.reducer