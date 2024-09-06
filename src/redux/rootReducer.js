import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userReducer";
// import settingReducer from './slices/settingReducer';

const rootReducer = combineReducers({
  userReducer: userReducer,
  // settingReducer: settingReducer,
});

export { rootReducer };
