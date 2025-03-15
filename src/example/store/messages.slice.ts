import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Message = {
  id: number;
  author: string;
  value: string;
  createdAt: string;
};
const initialState: Message[] = [
  {
    id: 1,
    author: "bot",
    value: "Hello",
    createdAt: new Date().toISOString(),
  },
];

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessages: (state, action: PayloadAction<Message>) => {
      state.push(action.payload);
    },
    deleteMessage: (state, action: PayloadAction<number>) =>
      state.filter((message) => message.id !== action.payload),
    editMessage: (state, action: PayloadAction<Message>) => {
      state.map((message) =>
        message.id !== action.payload.id ? message : action.payload,
      );
    },
  },
});

export const messagesReducer = messagesSlice.reducer;

export const { addMessages, deleteMessage, editMessage } =
  messagesSlice.actions;
