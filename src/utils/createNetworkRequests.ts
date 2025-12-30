import { NetworkRequest, RequestSize } from "../models/networkRequest"
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
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

  // Copy to a temporary location first
    const tempPath = `${FileSystem.documentDirectory}${uuid.v4()}_temp.jpg`;
    await FileSystem.copyAsync({
        from: asset.localUri!,
        to: tempPath
    });

    // Compress the image using ImageManipulator
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        tempPath,
        [], // No transformations, just compression
        {
            compress: 0.7, // Compress to 70% quality
            format: ImageManipulator.SaveFormat.JPEG,
        }
    );

    // Move compressed image to final location
    const destPath = `${FileSystem.documentDirectory}${uuid.v4()}.jpg`;
    await FileSystem.moveAsync({
        from: manipulatedImage.uri,
        to: destPath
    });

    // Clean up temporary file if it still exists
    try {
        await FileSystem.deleteAsync(tempPath, { idempotent: true });
    } catch (error) {
        // Ignore cleanup errors
    }

    return destPath;
  };

const createBigNetworkRequest = async (id: string, url: string, numberOfTask: number) => {
    const newPath = await copyAssetToFile();
    return new NetworkRequest(id, url, {
        uri: newPath
    }, numberOfTask, new Date(), RequestSize.Large);
}

export { createSmallNetworkRequest, createBigNetworkRequest }
