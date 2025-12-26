import { configureStore  } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkRequestsReducer from "./networkRequestsReducer";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
  };

const persistedReducer = persistReducer(persistConfig, networkRequestsReducer);

export const configStore = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        });
    }
})


export const persistor = persistStore(configStore);