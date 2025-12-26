import { NetworkRequest, RequestSize } from "../models/networkRequest"
import { Image } from 'react-native';
import tigerImage from '../../assets/tiger.jpg';

//for creating dummy requests to test architecture

const createSmallNetworkRequest = ( id: string, url: string,) => {
    return new NetworkRequest(id, url, {
        'driver': 'Boaz Lachman',
        'status': 'delivering',
        'shift': 'night Shift'
    }, new Date(), RequestSize.Small);
}

const createBigNetworkRequest = (id: string,url: string) => {
    return new NetworkRequest(id, url, {
        uri: Image.resolveAssetSource(tigerImage).uri
    }, new Date(), RequestSize.Large);
}

    
export {createSmallNetworkRequest, createBigNetworkRequest}