var jsSHA = require('jssha');
import { getData, storageMap } from './DefaulPreferencesHelper';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const consumer_key = "ydFV2nowAT60oQ8RZZz1MYCVo";
const consumer_secret = "5X05N5HeCYxdcU34Hu9OUCmy2MJ2lrj9urXTFlGDZ7poz80pFn";

var randomString = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function percentEncode(str) {
    return encodeURIComponent(str).replace(/[!*()']/g, (character) => {
        return '%' + character.charCodeAt(0).toString(16);
    });
};

function hmac_sha1(string, secret) {
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(secret, "TEXT");
    shaObj.update(string);
    let hmac = shaObj.getHMAC("B64");
    return hmac;
};

function genSortedParamStr(params) {
    // Merge oauth params & request params to single object
    // Sort alphabetically
    let paramObjKeys = Object.keys(params);
    let len = paramObjKeys.length;
    paramObjKeys.sort();
    // Interpolate to string with format as key1=val1&key2=val2&...
    let paramStr = percentEncode(paramObjKeys[0]) + '=' + percentEncode(params[paramObjKeys[0]]);
    for (var i = 1; i < len; i++) {
        paramStr += '&' + percentEncode(paramObjKeys[i]) + '=' + percentEncode(params[paramObjKeys[i]]);
    }
    return paramStr;
};

function generateCommonHeaders() {
    const nonce = randomString(11);
    const timestamp = (Date.parse(new Date) / 1000).toString();
    console.log(timestamp);
    const headers = {
        // include_entities : true,
        oauth_consumer_key: consumer_key,
        oauth_nonce: nonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_version: '1.0',
    }

    return headers;
}

export const generateAuthStringWithout = (htppMethod, requestUrl, params) => {
    const commonHeaders = generateCommonHeaders();

    const merged = { ...commonHeaders, ...params };

    const base_string = htppMethod + '&' + percentEncode(requestUrl) + '&' + percentEncode(genSortedParamStr(merged));

    const signature = hmac_sha1(base_string, consumer_secret + '&' + '');

    return 'OAuth ' +
        'oauth_consumer_key="' + consumer_key + '",' +
        'oauth_nonce="' + commonHeaders.oauth_nonce + '",' +
        'oauth_signature="' + percentEncode(signature) + '",' +
        'oauth_signature_method="HMAC-SHA1",' +
        'oauth_timestamp="' + commonHeaders.oauth_timestamp + '",' +
        'oauth_version="1.0"';
}

export const generateAuthStringWith = async (htppMethod, requestUrl, params) => {
    return new Promise((resolve,reject) => {
        getData()
        .then((tokens) => {
            const commonHeaders = generateCommonHeaders();
            const merged = { ...commonHeaders, ...params ,...{oauth_token : tokens[storageMap['USER_TOKEN']]}};
            
            const base_string = htppMethod + '&' + percentEncode(requestUrl) + '&' + percentEncode(genSortedParamStr(merged));
            console.log("base String ",base_string);
            const signature = hmac_sha1(base_string, consumer_secret + '&' + tokens[storageMap['USER_SECRET']]);

            resolve('OAuth ' +
            'oauth_consumer_key="' + consumer_key + '",' +
            'oauth_token="' + tokens[storageMap['USER_TOKEN']] + '",' +
            'oauth_nonce="' + commonHeaders.oauth_nonce + '",' +
            'oauth_signature="' + percentEncode(signature) + '",' +
            'oauth_signature_method="HMAC-SHA1",' +
            'oauth_timestamp="' + commonHeaders.oauth_timestamp + '",' +
            'oauth_version="1.0"');
        })
        .catch((error) => reject(error));
    });
}