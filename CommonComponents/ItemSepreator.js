import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

const ItemSepreator = () => {
    return (
        <View style={styles.sepreator}>
        </View>
    )
}

const styles = StyleSheet.create({
    sepreator : {
        width : "100%",
        height : 1,
        backgroundColor : "#F2F2F2"
    }
});

export default ItemSepreator;