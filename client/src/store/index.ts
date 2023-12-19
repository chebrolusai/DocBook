import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./slices/login_slice";
import { patientSlice } from "./slices/patient_slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [patientSlice.name]: patientSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch;

export default store;
