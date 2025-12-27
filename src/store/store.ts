import { configureStore  } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkRequestsReducer from "./networkRequestsReducer";
import { isDev } from "../config";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
  };

const persistedReducer = persistReducer(persistConfig, networkRequestsReducer);

export const configStore = configureStore({
    reducer: persistedReducer,
    devTools: isDev,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        });
    }
})


export const persistor = persistStore(configStore);