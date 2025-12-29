import { NetworkRequest, RequestSize } from "../models/networkRequest"
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { randomDriverNames, randomImageNames, randomImages } from "../constants/networkRequestRandomValues";
import { getRandomItem } from "./randomiser";
import uuid from 'react-native-uuid';
//for creating dummy requests to test architecture

const createSmallNetworkRequest = (id: string, url: string, numberOfTask: number) => {
    const randomDriverName: string = getRandomItem(randomDriverNames)

    return new NetworkRequest(id, url, {
        'driver': randomDriverName,
        'status': 'delivering',
        'shift': 'night Shift'
    }, numberOfTask, new Date(), RequestSize.Small);
}

//copy asset to local ddevice to avoid file not found exception in build apk
const copyAssetToFile = async () => {
    const randomImage: string = getRandomItem(randomImages)
    const asset = Asset.fromModule(randomImage);

    await asset.downloadAsync();

  // Copy to a permanent location
    const destPath = `${FileSystem.documentDirectory}${uuid.v4()}.jpg`;
    FileSystem.copyAsync({
        from: asset.localUri!,
        to: destPath
    });

    return destPath;
  };

const createBigNetworkRequest = async (id: string, url: string, numberOfTask: number) => {
    const newPath = await copyAssetToFile();
    return new NetworkRequest(id, url, {
        uri: newPath
    }, numberOfTask, new Date(), RequestSize.Large);
}

export { createSmallNetworkRequest, createBigNetworkRequest }
