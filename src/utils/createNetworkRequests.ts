import { NetworkRequest, RequestSize } from "../models/networkRequest"
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

//for creating dummy requests to test architecture

const createSmallNetworkRequest = ( id: string, url: string,) => {
    return new NetworkRequest(id, url, {
        'driver': 'Boaz Lachman',
        'status': 'delivering',
        'shift': 'night Shift'
    }, new Date(), RequestSize.Small);
}

//copy asset to local ddevice to avoid file not found exception in build apk
const copyAssetToFile = async () => {
    const asset = Asset.fromModule(require('../../assets/tiger.jpg'));

    await asset.downloadAsync();
  
  // Copy to a permanent location
    const destPath = `${FileSystem.documentDirectory}tiger.jpg`; 
    FileSystem.copyAsync({
        from: asset.localUri!,
        to: destPath
    });
    
    return destPath;
  };

const createBigNetworkRequest = async (id: string,url: string) => {
    const newPath = await copyAssetToFile();
    return new NetworkRequest(id, url, {
        uri: newPath
    }, new Date(), RequestSize.Large);
}

    
export {createSmallNetworkRequest, createBigNetworkRequest}