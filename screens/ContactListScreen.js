import React, {useEffect} from 'react';
import { StyleSheet, View, Text,FlatList, Dimensions } from 'react-native';
import { Container, Content, Header, Left, Icon, Body, Button, Title } from 'native-base';
import ContactListItem from '../components/ContactListItem';
import { useSelector, useDispatch } from 'react-redux';
import {fetchContacts} from '../store/actions/contacts'

const ContactListScreen = props => {
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchContacts())
    },dispatch);

    const displayContactList  = useSelector(state=>state.contacts.contacts); 
    displayContactList.sort((a, b) => a.name.localeCompare(b.name));
   

   
    const renderContactItem = itemData =>{
       // console.log(`Image path of ${itemData.item.name} is ${itemData.item.imageUri}`);

        return(
            <ContactListItem id={itemData.item.id} imageUri={itemData.item.imageUri} contactName={itemData.item.name} navigation={props.navigation} imageUri={itemData.item.imageUri}/>
        )
    }
    return (
        <Container>
            <Header>
                <Left style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button transparent onPress={() => {
                        props.navigation.toggleDrawer();
                    }}>
                        <Icon name="menu" />
                    </Button>
                </Left>
                <Body>
                    <Title style={{ textAlign: 'center' }}>Contact List</Title>
                </Body>
            </Header>
            
                <View>
                <FlatList style={{height:Dimensions.get('window').height * 0.9}} data={displayContactList} renderItem={renderContactItem}  />
                </View>
                <View style={{position:"absolute", right:10, bottom:10}}>
                <View>
                    <Button transparent onPress={() => props.navigation.navigate('EditContacts')}>
                        <Icon size={50} name="add"></Icon>
                    </Button>
                </View>
                </View>
        </Container>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    }
});

export default ContactListScreen;
