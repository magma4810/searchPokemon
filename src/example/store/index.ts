import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { profileReducer } from "./profile.slice";
import { messagesReducer } from "./messages.slice";

const rootReducer = combineReducers({
  profile: profileReducer,
  messages: messagesReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type StoreApp = ReturnType<typeof rootReducer>;
