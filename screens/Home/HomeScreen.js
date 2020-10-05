import React, { useState, useEffect } from 'react';
import {
  RefreshControl,
} from 'react-native';
import TweetCard from './components/TweetCard';
import axios from 'axios';
import { generateAuthStringWith } from '../../common/Utils';
import { FlatList } from 'react-native-gesture-handler';
import ItemSepreator from '../../CommonComponents/ItemSepreator';

const HomeScreen = ({navigation}) => {
  const [tweets, setTweets] = useState(null);
  const [isRefreshing, setRefreshing] = useState(false);
  const [lastId, setLastId] = useState(null);
  const requestUrl = "https://api.twitter.com/1.1/statuses/home_timeline.json";
  const http_method = "GET";

  const getRecentTweets = () => {
    generateAuthStringWith(http_method, requestUrl)
      .then((headerValue) => {
        console.log(headerValue);
        axios.get(requestUrl, {
          headers: {
            'Authorization': headerValue
          }
        })
          .then((response) => {
            console.log(response.data.length);
            setRefreshing(false);
            setTweets(response.data);
          })
          .catch((error) => {
            setRefreshing(false);
            console.log(error);
          })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const loadMore = () => {
    console.log(tweets[tweets.length - 1].id);
    const url = requestUrl + "?since_id="+tweets[tweets.length - 1].id_str;
    console.log(url);
    generateAuthStringWith(http_method, requestUrl,{"since_id":tweets[tweets.length - 1].id_str})
      .then((headerValue) => {
        console.log(headerValue);
        axios.get(url, {
          headers: {
            'Authorization': headerValue
          }
        })
          .then((response) => {
            console.log("response length",response.data.length);
            setRefreshing(false);
            setTweets([...tweets,...response.data]);
          })
          .catch((error) => {
            setRefreshing(false);
            console.log(error);
          })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    setRefreshing(true);
    getRecentTweets();
  }, {})

  return (
    <FlatList
      data={tweets}
      ItemSeparatorComponent={() => <ItemSepreator />}
      renderItem={({ item }) => {
        if (item.extended_entities) {
          return (
            <TweetCard
              tweet = {item}
              navigation={navigation} />
          )
        } else {
          return (
            <TweetCard
              tweet = {item}
              navigation={navigation} />
          )
        }
      }}
      keyExtractor={(item) => item.id_str}
      refreshControl={
        <RefreshControl
          onRefresh={() => getRecentTweets()}
          refreshing={isRefreshing} />
      }
      refreshing={isRefreshing}
      onEndReached = {loadMore} />
  )
}

export default HomeScreen;