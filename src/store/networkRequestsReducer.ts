import { createSlice } from "@reduxjs/toolkit";
import { NetworkRequest, RequestSize } from "../models/networkRequest";
import { sendingStatus } from "../constants/sendingStatus";

//reducerr for managing the network requests queue

export interface networkRequestsState {
    networkRequests: {small: NetworkRequest[], large: NetworkRequest[]},
    sendingStatus: sendingStatus,
  }

const initialState: networkRequestsState = {
    networkRequests: { small: [], large: [] },
    sendingStatus: sendingStatus.IDLE,
  };

  const networkRequestSlice = createSlice({
    name: 'networkRequests',
    initialState: initialState,
    reducers: {
        addNetworkRequest(state, action: {payload: NetworkRequest}) {
            const size = action.payload.size;

            if (size === RequestSize.Large) {
                state.networkRequests.large.push(action.payload);
            } else {
                state.networkRequests.small.push(action.payload);
            }
        },
        setNetworkRequestAsSent(state, action: {payload: string}) {
            state.networkRequests.large = state.networkRequests.large.map(
                (request) => request.id === action.payload ? { ...request, isSent: true } : request
            );
            state.networkRequests.small = state.networkRequests.small.map(
                (request) => request.id === action.payload ? { ...request, isSent: true } : request
            );
        },
        removeNetworkRequest(state, action: {payload: string}) {
            state.networkRequests.large = state.networkRequests.large.filter(
                (request) => request.id !== action.payload
            );
            state.networkRequests.small = state.networkRequests.small.filter(
                (request) => request.id !== action.payload
            );
        },
        removeAllNetworkRequests(state) {
            state.networkRequests = { small: [], large: [] };
        },
        setSendingStatus(state, action: {payload: sendingStatus}) {
            state.sendingStatus = action.payload;
        },
    }
});

export const { addNetworkRequest, removeNetworkRequest,
    removeAllNetworkRequests, setSendingStatus, setNetworkRequestAsSent } = networkRequestSlice.actions;

export default networkRequestSlice.reducer;
