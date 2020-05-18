import React from 'react';
import {useSelector} from 'react-redux';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';

const ContactListItem = props => {
    const favoriteContacts = useSelector(state=>state.contacts.favoriteContacts);
    const TouchComp = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
    let imagePath = props.imageUri === '' ? require('../assets/default-user.png') : {uri:'file://' + props.imageUri}
    return (
        <TouchComp onPress={()=>{props.navigation.navigate({routeName:'EditContacts',params:{
            id:props.id,
            isFavorite : favoriteContacts.find(contact => contact.id === props.id) ? true : false
        }})}}>
            <View style={styles.listView}>
                <Image source={ imagePath} style={{ width: 50, height: 50, borderWidth:1, borderRadius:50 }} />
                <View style={styles.textView}>
                    <Text style={styles.textSyle}>{props.contactName}</Text>
                </View>
            </View>
        </TouchComp>
    )
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 50,
        marginVertical: 10,
        alignContent: 'center'
    },
    textView: {
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    textSyle: {
        fontSize: 18
    }
});

export default ContactListItem;
