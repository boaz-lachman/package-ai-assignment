import { NetworkRequest, RequestSize } from "../models/networkRequest";
import axiosRetry from 'axios-retry';
import axios from 'axios';
import FormData from 'form-data';
import { Platform } from "react-native";
import NetInfo from '@react-native-community/netinfo';

//default timeout for request is 8 seconds
axios.defaults.timeout = 8000;

// Batch processing configuration
const BATCH_SIZE = 10; // Number of requests per batch
const MAX_CONCURRENT = 5; // Maximum concurrent requests within a batch
const BATCH_DELAY_MS = 100; // Delay between batches (rate limiting)

axiosRetry(axios, { retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
  // attach callback to each retry to handle logging or tracking
  onRetry: (retryCount, err) => console.log(`Retrying request: ${err.message}`),
  // Specify conditions to retry on, this is the default
  // which will retry on network errors or idempotent requests (5xx)
  retryCondition: async (error) => {
    // Check network connectivity first
    const netInfo = await NetInfo.fetch();

    // Don't retry if no connectivity
    if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      return false;
    }

    // Use default retry condition for other errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

// Utility function to split array into chunks
const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Utility function to create a delay
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Process a batch of requests with controlled concurrency
const processBatchWithConcurrency = async (
  batch: NetworkRequest[],
  maxConcurrent: number,
  onSuccess: (request: NetworkRequest) => void,
  onFailure: (request: NetworkRequest) => void
): Promise<void> => {
  const concurrentChunks = chunkArray(batch, maxConcurrent);
  
  for (const chunk of concurrentChunks) {
    const promises = chunk.map(request => 
      createPostRequest(request, onSuccess, onFailure)
    );
    
    await Promise.allSettled(promises);
  }
};

//all functions recieve the network request and stemming from it onSuccess onFailure and onFinish actions for sending the network actions

const postAllRequests = async (networkRequests: {small: NetworkRequest[], large: NetworkRequest[]},
    onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest) => void, onFinish: () => void) => {
    await postAllRequestsFromAType(networkRequests.small, onSuccess, onFailure); //first try to send all the small requests simoltanously
    await postAllRequestsFromAType(networkRequests.large, onSuccess, onFailure); //then try to send all the large requests simoltanously
    onFinish();
}

const postAllRequestsFromAType = async (networkRequests: NetworkRequest[], onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest)=> void) : Promise<boolean> => {
   const networkRequestsFiltered = networkRequests.filter((request) => !request.isSent);
   
   if (networkRequestsFiltered.length === 0) {
     return true;
   }

    try {
        // Split requests into batches
        const batches = chunkArray(networkRequestsFiltered, BATCH_SIZE);
        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];
          await processBatchWithConcurrency(batch, MAX_CONCURRENT, onSuccess, onFailure);
          if (i < batches.length - 1) {
            await delay(BATCH_DELAY_MS);
          }
        }
        
        return true;
    } catch(error) {
      console.error(error);
      //do nothing
    }
    return false;
}

const postRequest = async (networkRequest: NetworkRequest, onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest) => void, onFinish: () => void) => {
    await createPostRequest(networkRequest, onSuccess, onFailure);
    onFinish();
}

const createPostRequest = (networkRequest: NetworkRequest, onSuccess: (request: NetworkRequest) => void, onFailure: (request: NetworkRequest) => void) => {
    if (networkRequest.size === RequestSize.Small) {
       return axios.post(networkRequest.url, networkRequest.data).then(() => onSuccess(networkRequest)).catch((e) => {
        onFailure(networkRequest)
        throw e;
       })
    }
    else {
        const formData = new FormData();
        formData.append('image', {
            uri: Platform.OS === 'android' ? networkRequest.data.uri : networkRequest.data.uri.replace('file://', ''),
            name: `image.jpeg`,
            type: 'image/jpeg', // it may be necessary in Android.
          });
        return axios.post(networkRequest.url, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(() => onSuccess(networkRequest)).catch(() => {
            onFailure(networkRequest);
        });
    }
}

export { postRequest, postAllRequests };
