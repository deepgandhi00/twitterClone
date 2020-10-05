import DefaultPreference from 'react-native-default-preference';
import { Platform } from 'react-native';

if (Platform.OS === 'android') DefaultPreference.setName('UserInfo');

export const storageMap = {
    OAUTH_TOKEN : "oauth_token",
    OAUTH_TOKEN_SECRET : "oauth_token_secret",
    USER_TOKEN : "userToken",
    USER_SECRET : "userSecret",
    USER_ID : "id",
    USER_NAME : "name",
}

export const storeData = async (oauth_token,oauth_token_secret,userToken,userSecret,id,name) => {
    return Promise.all(
        DefaultPreference.set(storageMap['OAUTH_TOKEN'],oauth_token),
        DefaultPreference.set(storageMap['OAUTH_TOKEN_SECRET'],oauth_token_secret),
        DefaultPreference.set(storageMap['USER_TOKEN'],userToken),
        DefaultPreference.set(storageMap['USER_SECRET'],userSecret),
        DefaultPreference.set(storageMap['USER_ID'],id),
        DefaultPreference.set(storageMap['USER_NAME'],name))
}

export const isLogin = () => {
    return DefaultPreference.get(storageMap['OAUTH_TOKEN']);
}

export const getData = () => {
    return DefaultPreference.getAll();
}