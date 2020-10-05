import React, { useState, useEffect } from 'react';
import {
    RefreshControl, StyleSheet, View, Image, Text
} from 'react-native';
import Autolink from 'react-native-autolink';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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

const TweetDetails = ({ route, navigation }) => {
    const tweet = route.params.tweet;
    const [isLiked, setLiked] = useState(tweet.favorited);
    console.log(tweet.user.profile_image_url);
    return (
        <View style={styles.mainContainer}>
            <View style={styles.userInfoContainer}>
                <Image
                    source={{ uri: tweet.user.profile_image_url }}
                    style={styles.profileImage} />
                <View>
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userDisplayName}>{tweet.user.name}</Text>
                        {
                            tweet.user.verified ?
                                <Image source={require('../../assets/images/verify_badge.png')} style={styles.verifyBadge} /> : null
                        }
                    </View>
                    <Text style={styles.userUniqueName}>{'@' + tweet.user.screen_name}</Text>
                </View>
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

            <View style={styles.moreInfoContainer}>
                <Text>
                    <Text style={styles.valueText}>{tweet.retweet_count}</Text>
                    <Text style={styles.titleText}> Retweets</Text>
                </Text>
                <Text style={{ marginStart: 8 }}>
                    <Text style={styles.valueText}>{tweet.favorite_count}</Text>
                    <Text style={styles.titleText}> Likes</Text>
                </Text>
            </View>

            <View style={styles.actionContainer}>
                <View style={{ flexDirection: "row" }}>
                    <Image source={require('../../assets/images/retweet.png')} style={styles.actionIcon} />
                    <Text>{tweet.retweet_count}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableWithoutFeedback
                        onPress={() => addRemoveLike(isLiked, tweet.id_str, setLiked)}>
                        <Image
                            source={isLiked ? require('../../assets/images/likes_filled.png') : require('../../assets/images/likes_outline.png')}
                            style={styles.actionIcon} />
                    </TouchableWithoutFeedback>
                    <Text>{tweet.favorite_count}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Image source={require('../../assets/images/share.png')} style={styles.actionIcon} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 60,
        marginEnd: 8
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
        marginTop: 24,
        fontSize: 20
    },
    image: {
        width: "100%",
        height: 200,
        marginTop: 16,
        borderRadius: 20
    },
    moreInfoContainer: {
        flexDirection: "row",
        borderTopColor: "#a9a9a9",
        borderBottomColor: "#a9a9a9",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 16,
        paddingVertical: 8
    },
    valueText: {
        fontWeight: "700",
        fontSize: 16
    },
    titleText: {
        fontSize: 16
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

export default TweetDetails;