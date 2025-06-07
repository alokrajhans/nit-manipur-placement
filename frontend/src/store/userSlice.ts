import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  enrollment_number: string | null;
  role: number | null;
}

const initialState: UserState = {
  enrollment_number: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<UserState>) {
      state.enrollment_number = action.payload.enrollment_number;
      state.role = action.payload.role;
    },
    clearUserDetails(state) {
      state.enrollment_number = null;
      state.role = null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
