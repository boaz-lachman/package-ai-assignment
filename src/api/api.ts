import { NetworkRequest, RequestSize } from "../models/networkRequest";
import axiosRetry from 'axios-retry';
import axios from 'axios';
import FormData from 'form-data';
import { Platform } from "react-native";

axiosRetry(axios, { retries: 3,
    retryDelay: axiosRetry.exponentialDelay, 
  // attach callback to each retry to handle logging or tracking
  onRetry: (retryCount,err) => console.log(`Retrying request: ${err.message}`),
  // Specify conditions to retry on, this is the default
  // which will retry on network errors or idempotent requests (5xx)
  //retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error)
});


//all functions recieve the network request and stemming from it onSuccess onFailure and onFinish actions for sending the network actions


const postAllRequests = async (networkRequests: {small: NetworkRequest[], large: NetworkRequest[]}, 
    onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest) => void, onFinish: Function) => {
    await postAllRequestsFromAType(networkRequests.small, onSuccess, onFailure); //first try to send all the small requests simoltanously
    await postAllRequestsFromAType(networkRequests.large, onSuccess, onFailure); //then try to send all the large requests simoltanously
    onFinish();
}

const postAllRequestsFromAType = async (networkRequests: NetworkRequest[], onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest)=> void) : Promise<boolean> => {
   
    let axiosRequests = networkRequests.map((request) => createPostRequest(request, onSuccess, onFailure));
    try {
    const result = await Promise.all(axiosRequests);
    if(result) {
        return true;
    }
    } catch(e) {
      
    }
    return false;
}

const postRequest = async (networkRequest: NetworkRequest, onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest) => void, onFinish: Function) => {
    await createPostRequest(networkRequest, onSuccess, onFailure);
    onFinish();
}

const createPostRequest = (networkRequest: NetworkRequest, onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest) => void) => {
    if(networkRequest.size === RequestSize.Small) {
       return axios.post(networkRequest.url, networkRequest.data).then(() => onSuccess(networkRequest)).catch((e) => {
        onFailure(networkRequest)
        throw e;
       })
    }
    else {
        const formData = new FormData();
        formData.append('image', {
            uri: Platform.OS === 'android' ? networkRequest.data.uri :networkRequest.data.uri.replace('file://', ''),
            name: `image.jpeg`,
            type: 'image/jpeg', // it may be necessary in Android. 
          });
        return axios.post(networkRequest.url, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => onSuccess(networkRequest)).catch((e) => {
            onFailure(networkRequest)});
    }
}

export {postRequest, postAllRequests};