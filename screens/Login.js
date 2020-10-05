import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { generateAuthStringWithout } from '../common/Utils'
import LoadingScreen from '../CommonComponents/LoadingScreen'
import {storeData} from '../common/DefaulPreferencesHelper'

const Login = ({ navigation, route }) => {
    const [response, setResponse] = useState(0);
    const [oauth_token, setOAuthToken] = useState("");
    const [oauth_token_secret, setOAuthTokenSecret] = useState("");
    const [isOAuthObtained, setOAuthObtained] = useState(false);
    const [loginAuthToken, setLoginAuthToken] = useState("");
    const [loginAuthVerifier, setLoginAuthVerifier] = useState("");
    const [userAuthToken, setUserAuthToken] = useState("");
    const [userAuthTokenSecret, setUserAuthTokenSecret] = useState("");
    const [userId, setUserId] = useState("");
    const [screenName, setScreenName] = useState("");

    const http_method = "POST";
    const requestTokenUrl = "https://api.twitter.com/oauth/request_token";

    const fetchToken = async () => {

        const headerValue = generateAuthStringWithout(http_method, requestTokenUrl);
        console.log(headerValue);

        await axios.post(requestTokenUrl, null, {
            headers: {
                'Authorization': headerValue
            }
        }).then((res) => {
            console.log(res.data);
            var responseString = res.data.toString().split("&");
            console.log(responseString.length);
            console.log(responseString);
            for (var i = 0; i < responseString.length; i++) {
                var pair = responseString[i].split("=");
                if (pair[0] === 'oauth_token') {
                    setOAuthToken(pair[1]);
                }

                if (pair[0] === 'oauth_token_secret') {
                    setOAuthTokenSecret(pair[1]);
                }
            }
            setResponse(200);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        fetchToken();
    }, []);

    const getAccessToken = async () => {
        setResponse(0);
        const headerValue = generateAuthStringWithout(http_method, "https://api.twitter.com/oauth/access_token?oauth_token=" + loginAuthToken + "&oauth_verifier=" + loginAuthVerifier);
        console.log(headerValue);
        await axios.post("https://api.twitter.com/oauth/access_token?oauth_token=" + loginAuthToken + "&oauth_verifier=" + loginAuthVerifier, null, {
            headers: {
                'Authorization': headerValue
            }
        })
            .then((res) => {
                var pairs = res.data.split("&");
                var userToken, userSecret, id, name;
                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i].split("=");
                    switch (pair[0]) {
                        case 'oauth_token':
                            userToken = pair[1];
                            break;

                        case 'oauth_token_secret':
                            userSecret = pair[1];
                            break;

                        case 'user_id':
                            id = pair[1];
                            break;

                        case 'screen_name':
                            name = pair[1];
                            break;
                    }
                }

                storeAndNavigate(userToken,userSecret,id,name);
            }).catch((err) => console.log(err));
    }

    const storeAndNavigate = (userToken, userSecret, id, name) => {
        storeData(oauth_token,oauth_token_secret,userToken,userSecret,id,name)
        .then((values) => {
            if(values){
                console.log(values);
                navigation.navigate('main');
            } else {
                console.log(values);
            }
        })
        .catch(error => console.log(error));
    }

    const _onLoad = (state) => {
        console.log(state);
        if (state.url.includes("https://openapis.000webhostapp.com") || state.url.includes("https://localhost.com")) {
            var params = state.url.split("?")[1].split("&");
            for (var i = 0; i < params.length; i++) {
                var pair = params[i].split("=");
                if (pair[0] === 'oauth_token') {
                    setLoginAuthToken(pair[1]);
                }
                if (pair[0] === 'oauth_verifier') {
                    setLoginAuthVerifier(pair[1]);
                }
            }
            getAccessToken();
        }
    }

    return (
        response === 0 ?
            <LoadingScreen /> :
            <View style={styles.mainContainer}>
                <WebView
                    onNavigationStateChange={_onLoad}
                    source={{ uri: "https://api.twitter.com/oauth/authorize?oauth_token=" + oauth_token }}
                    style={styles.webView} />
            </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    webView: {
        flex: 1,
    }
})

export default Login;