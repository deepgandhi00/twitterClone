import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import Autolink from 'react-native-autolink';
import axios from 'axios'
import { generateAuthStringWith } from '../../../common/Utils'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';

const likesUrl = "https://api.twitter.com/1.1/favorites/create.json";
const unLikeUrl = "https://api.twitter.com/1.1/favorites/destroy.json";
const http_method = "POST";

const addRemoveLike = (isLiked, tweetId, setLiked) => {
    isLiked ?
        generateAuthStringWith(http_method, unLikeUrl, { "id": tweetId })
            .then((unLikeheader) => {
                axios.post(unLikeUrl + "?id=" + tweetId, null, {
                    headers: {
                        'Authorization': unLikeheader,
                        "content-type": "application/json"
                    }
                })
                    .then((response) => {
                        setLiked(false);
                    })
                    .catch((error) => console.log(error))
            })
            .catch((error) => console.log(error))
        :
        generateAuthStringWith(http_method, likesUrl, { "id": tweetId })
            .then((likeHeader) => {
                axios.post(likesUrl + "?id=" + tweetId, null, {
                    headers: {
                        'Authorization': likeHeader,
                        "content-type": "application/json"
                    }
                })
                    .then((response) => {
                        setLiked(true);
                    })
                    .catch((error) => console.log(error.response))
            })
            .catch((error) => console.log(error));
}

const TweetCard = (props) => {

    const { tweet,navigation } = props
    const [isLiked, setLiked] = useState(tweet.favorited);
    return (
        <TouchableRipple
            onPress={() => navigation.navigate('details',{tweet : tweet})}>
            <View style={styles.mainContainer}>
                <Image source={{ uri: tweet.user.profile_image_url }} style={styles.profileImage} />
                <View style={styles.tweetContainer}>
                    <View style={styles.userStyle}>
                        <Text style={styles.userDisplayName}>{tweet.user.name}</Text>
                        {
                            tweet.user.verified ?
                                <Image source={require('../../../assets/images/verify_badge.png')} style={styles.verifyBadge} /> : null
                        }
                        <Text style={styles.userUniqueName}>{'@' + tweet.user.screen_name}</Text>
                    </View>
                    <Autolink
                        text={tweet.text.indexOf("https://t.co/") === -1 ? tweet.text : tweet.text.substring(0, tweet.text.indexOf("https://t.co/") - 1)}
                        hashtag="twitter"
                        mention="twitter"
                        style={styles.tweetText}
                    />
                    {
                        tweet.extended_entities ? <Image source={{ uri: tweet.extended_entities.media[0].media_url }} style={styles.image} /> : null
                    }
                    <View style={styles.actionContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <Image source={require('../../../assets/images/retweet.png')} style={styles.actionIcon} />
                            <Text>{tweet.retweet_count}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableWithoutFeedback
                                onPress={() => addRemoveLike(isLiked, tweet.id_str, setLiked)}>
                                <Image
                                    source={isLiked ? require('../../../assets/images/likes_filled.png') : require('../../../assets/images/likes_outline.png')}
                                    style={styles.actionIcon} />
                            </TouchableWithoutFeedback>
                            <Text>{tweet.favorite_count}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Image source={require('../../../assets/images/share.png')} style={styles.actionIcon} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        paddingHorizontal: 8,
        paddingVertical: 16,
        backgroundColor: "white"
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 60,
    },
    tweetContainer: {
        flex: 1,
        marginEnd: 8,
        marginStart: 8,
    },
    userStyle: {
        flexDirection: "row",
        alignItems: "center"
    },
    userDisplayName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000000",
    },
    verifyBadge: {
        width: 12,
        height: 12,
        marginStart: 4,
    },
    userUniqueName: {
        marginStart: 4,
        color: "#C2CCD5"
    },
    tweetText: {

    },
    image: {
        width: "95%",
        height: 150,
        borderRadius: 20,
        marginTop: 16
    },
    actionContainer: {
        flexDirection: "row",
        marginTop: 16,
        justifyContent: "space-between"
    },
    actionIcon: {
        width: 20,
        height: 20,
        resizeMode: "cover",
        marginEnd: 4,
    }
});

export default TweetCard;