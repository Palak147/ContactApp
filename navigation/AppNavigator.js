import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import ContactListScreen from '../screens/ContactListScreen';
import EditContactScreen from '../screens/EditContactScreen';
import FavoriteContactsList from '../screens/FavoriteContactsList';
import Colors from '../constants/Colors';

const ContactNavigator = createStackNavigator({
    Contacts : {
        screen : ContactListScreen,
        navigationOptions:{
          headerShown:false
        }
    },
    EditContacts:{
      screen:EditContactScreen
    },

  },{
    defaultNavigationOptions:{
      headerStyle: {
          backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
                  
      },
      headerTintColor: Platform.OS === 'android' ? 'white' :Colors.primary,
      headerTitleAlign:'left'
  }
  });
  
  const AppNavigator = createDrawerNavigator({
    Contacts : ContactNavigator,
    Favorites : FavoriteContactsList
  },{
    
  })
  export default createAppContainer(AppNavigator);