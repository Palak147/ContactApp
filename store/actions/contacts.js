import * as FileSystem from 'react-native-fs';
import { insertContact, loadContacts, updateContactDetails, removeContact } from '../../helper/db';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const FETCH_CONTACTS = 'FETCH_CONTACTS';
export const CREATE_CONTACT = 'CREATE_CONTACT';
export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const DELETE_CONTACT = 'DELETE_CONTACT';


export const toggleFavorite = (id) => {
    return {
        type: TOGGLE_FAVORITE,
        contactId: id
    }
}

export const createContact = (name, mobile, landline, imageUri) => {
    return async dispatch => {
         //console.log(`image Uri: ${imageUri}`);
        let newPath= '';
        if(imageUri!==null)
        {
            const fileName = imageUri.split('/').pop();
            newPath= FileSystem.DocumentDirectoryPath + '/' + fileName;
            await FileSystem.moveFile(imageUri, newPath);
        }

        console.log(newPath);
        insertContact(name, mobile, landline, newPath)
            .then(() => console.log('Contact added to the database'))
            .catch((error) => {
                console.log(error);
            });
        dispatch({
            type: CREATE_CONTACT,
            contactData: {
                name, mobile, landline, newPath
            }
        })
    };

}

export const updateContact = (id, name, mobile, landline, imageUri) => {
    return dispatch => {
        // console.log(`image Uri: ${imageUri}`);
        //console.log(name);
        const fileName = imageUri.split('/').pop();
        //console.log('firing update code');
        //console.log(fileName);
        const newPath = FileSystem.DocumentDirectoryPath + '/' + fileName;
        //console.log(newPath);
        FileSystem.moveFile(imageUri, newPath)
            .then(updateContactDetails(id, name, mobile, landline, newPath))
            .then(() => console.log('Contact updated'))
            .catch((error) => {
                console.log(error);
            });
        dispatch({
            type: UPDATE_CONTACT,
            contactId: id,
            contactData: {
                name, mobile, landline, newPath
            }
        })
    };



}

export const deleteContact = (id) => {
    return dispatch => {
        removeContact(id)
            .then(() => console.log('Contact deleted'))
            .catch((error) => {
                console.log(error);
            });
        dispatch({
            type: DELETE_CONTACT,
            contactId: id,
        })
    };

}

export const fetchContacts = () => {
    return async dispatch => {
        try {
            const dbResult = await loadContacts();
            // var len = result.rows.length;
            // for (let i = 0; i < len; i++) {
            //     let row = result.rows.item(i);
            //     console.log(`Contact name: ${row.name}, Contact Mobile: ${row.mobile}`);
            // }
            let rows = dbResult.rows.raw();
            //console.log(rows);
            dispatch({ type: FETCH_CONTACTS, contacts: rows })
        } catch (err) {
            console.log(err);
        }

    };
}