import { ActivityIndicator } from 'react-native-paper';
import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const LoadingScreen = () => {
    return(
        <View style={styles.mainContainer}>
            <ActivityIndicator/>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
    }
})

export default LoadingScreen;