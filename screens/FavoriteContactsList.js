import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Content, Header, Left, Icon,Button, Body,Title } from 'native-base';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import ContactListItem from '../components/ContactListItem';

const FavoriteContactsList = props => {
    const favoriteContacts = useSelector(state => state.contacts.favoriteContacts);
    const renderContactItem = itemData =>{
        return(
            <ContactListItem imageUri={itemData.item.imageUri} contactName={itemData.item.name} navigation={props.navigation} />
        )
    }
    favoriteContacts.sort((a, b) => a.name.localeCompare(b.name));
    return (
        <Container>
            <Header>
                <Left style={{flexDirection:'row', alignItems:'center'}}>
                    <Button transparent onPress={() => {
                        props.navigation.toggleDrawer();
                    }}>
                        <Icon name="menu" />
                    </Button>
                </Left>
                <Body style={{flex:1}}>
                    <Title style={{textAlign:'center'}}>Favorite Contact List</Title>
                </Body>
            </Header>
           <FlatList data={favoriteContacts} renderItem={renderContactItem}/>
        </Container>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default FavoriteContactsList;
