import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkRequestsReducer from "./networkRequestsReducer";
import { isDev } from "../config";

// Create a transform to handle Date objects
const dateTransform = createTransform(
    // Transform state on its way to being serialized and persisted
    (inboundState: any) => {
      // Convert Date objects to ISO strings in networkRequests arrays
      if (!inboundState || !inboundState.networkRequests) {
        return inboundState;
      }

      return {
        ...inboundState,
        networkRequests: {
          small: inboundState.networkRequests.small.map((request: any) => ({
            ...request,
            createdAt: request.createdAt instanceof Date
              ? request.createdAt.toISOString()
              : request.createdAt
          })),
          large: inboundState.networkRequests.large.map((request: any) => ({
            ...request,
            createdAt: request.createdAt instanceof Date
              ? request.createdAt.toISOString()
              : request.createdAt
          }))
        }
      };
    },
    // Transform state being rehydrated
    (outboundState: any) => {
      // Convert ISO strings back to Date objects in networkRequests arrays
      if (!outboundState || !outboundState.networkRequests) {
        return outboundState;
      }

      return {
        ...outboundState,
        networkRequests: {
          small: outboundState.networkRequests.small.map((request: any) => ({
            ...request,
            createdAt: request.createdAt
              ? (request.createdAt instanceof Date ? request.createdAt : new Date(request.createdAt))
              : new Date()
          })),
          large: outboundState.networkRequests.large.map((request: any) => ({
            ...request,
            createdAt: request.createdAt
              ? (request.createdAt instanceof Date ? request.createdAt : new Date(request.createdAt))
              : new Date()
          }))
        }
      };
    },
    // Define which reducers this transform applies to
    { whitelist: ['networkRequests'] }
  );

  const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    transforms: [dateTransform]
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
