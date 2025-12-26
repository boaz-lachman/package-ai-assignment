import { createSlice } from "@reduxjs/toolkit";
import { NetworkRequest, RequestSize } from "../models/networkRequest";
import { sendingStatus } from "../constants/sendingStatus";

//reducerr for managing the network requests queue

export interface networkRequestsState {
    networkRequests: {small: NetworkRequest[], large: NetworkRequest[]},
    sendingStatus: sendingStatus,
  }

const initialState: networkRequestsState = {
    networkRequests: {small: [], large: []},
    sendingStatus: sendingStatus.IDLE,
  };

const networkRequestSlice = createSlice({
    name: 'networkRequests',
    initialState: initialState,
    reducers: {
        addNetworkRequest(state: networkRequestsState,action: {payload: NetworkRequest}) {
            const newRequest = action.payload;
            const requests = state.networkRequests;
            
            if(newRequest.size === RequestSize.Large) {
                requests.large.push(newRequest);
            }
            else {
                requests.small.push(newRequest);
            }
            state.networkRequests = requests;
        },
        removeNetworkRequest(state: networkRequestsState, action: {payload: String}){
            const requests = {large: state.networkRequests.large.filter((request) => request.id !== action.payload),
                small: state.networkRequests.small.filter((request) => request.id !== action.payload)
            };
            state.networkRequests = requests;
        },
        removeAllNetworkRequests(state: networkRequestsState) {
            state.networkRequests ={small: [], large: []};
        },
        setSendingStatus(state: networkRequestsState, action: {payload: sendingStatus}) {
            state.sendingStatus = action.payload;
        },
        
    }

});

export const {addNetworkRequest, removeNetworkRequest, removeAllNetworkRequests, setSendingStatus} = networkRequestSlice.actions;

export default networkRequestSlice.reducer;