import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "otus",
  age: 23,
  visiable: true,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    changeVisible: (state) => {
      state.visiable = !state.visiable;
      return state;
    },
    changeAge: (state, action: PayloadAction<number>) => {
      state.age = action.payload;
      return state;
    },
    changeName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      return state;
    },
  },
});

export const profileReducer = profileSlice.reducer;

export const { changeVisible, changeAge, changeName } = profileSlice.actions;
