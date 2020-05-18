import { TOGGLE_FAVORITE, CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACT, FETCH_CONTACTS } from '../actions/contacts';
import Contact from '../../models/Contact';

const initialState = {
  contacts: [],
  favoriteContacts: []
};


const contactReducer = (state = initialState, action) => {
 // console.log('Initialising state');
 // console.log(`${state.contacts}`);
  //console.log(`${state.favoriteContacts}`);
  switch (action.type) {
    case FETCH_CONTACTS:
      return {
        ...state,
        contacts: action.contacts.map(contact => new Contact(contact.id.toString(), contact.name, contact.mobile, contact.landline, contact.imageUri))
      }
    case CREATE_CONTACT:
      const cId = Date.now().toString();
      //console.log('Writing data in reducer');
      //console.log(action.contactData.name)
      const newContact = new Contact(
        cId,
        action.contactData.name,
        action.contactData.mobile,
        action.contactData.landline,
        action.contactData.newPath);
      return {
        ...state,
        contacts: state.contacts.concat(newContact)
      };
    case UPDATE_CONTACT:
     // console.log('Performing reducer code');
      const contactIndex = state.contacts.findIndex(contact => contact.id === action.contactId);
      const updatedContact = new Contact(   
        action.contactId,
        action.contactData.name,
        action.contactData.mobile,
        action.contactData.landline,
        action.contactData.newPath);
     // console.log(`updated contact ${updatedContact.id} ${updatedContact.name} ${updatedContact.mobile} ${updatedContact.landline} ${updatedContact.imageUri}`)
      const updatedContacts = [...state.contacts];

      //console.log(`Before updation : ${updatedContacts[contactIndex]}`);
      //console.log(`Index ${contactIndex}`);
      updatedContacts[contactIndex] = updatedContact;
      //console.log(`After updation : ${updatedContacts[contactIndex]}`);
      const updatedFavoriteContacts = [...state.favoriteContacts];
      //console.log(`favorite contacts before updation : ${updatedFavoriteContacts}`);
      const favoriteContactIndex = state.favoriteContacts.findIndex(
        contact => contact.id === action.contactId);
      //console.log(`favorite contact index : ${favoriteContactIndex}`);
      if (favoriteContactIndex > -1) {
       // console.log(`Before updation : ${updatedFavoriteContacts[favoriteContactIndex]}`);
        updatedFavoriteContacts[favoriteContactIndex] = updatedContact;
        //console.log(`After updation : ${updatedFavoriteContacts[favoriteContactIndex]}`);
      }
      return {
        ...state,
        contacts: updatedContacts,
        favoriteContacts: updatedFavoriteContacts
      }
    case DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.contactId),
        favoriteContacts:state.favoriteContacts.filter(contact => contact.id !== action.contactId)
      }
    case TOGGLE_FAVORITE:
        existingIndex = state.favoriteContacts.findIndex(
        contact => contact.id === action.contactId);
      if (existingIndex >= 0) {
        const updatedFavContacts = [...state.favoriteContacts];
        updatedFavContacts.splice(existingIndex, 1);
        return { ...state, favoriteContacts: updatedFavContacts };
      } else {
        const contact = state.contacts.find(contact => contact.id === action.contactId);
        return { ...state, favoriteContacts: state.favoriteContacts.concat(contact) };
      }

    default:
      return state;
  }
}


export default contactReducer;