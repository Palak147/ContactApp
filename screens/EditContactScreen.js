import React, { useState, useEffect, useCallback, useReducer, } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Button, Text, View, Dimensions, Alert } from 'react-native';
import { HeaderButtons, Item, HiddenItem } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors'
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, createContact, updateContact, deleteContact } from '../store/actions/contacts';
import ContactImagePicker from '../components/ContactImagePicker';

const FORM_INPUT_UPDATE = 'UPDATE';
const INPUT_BLUR = 'INPUTBLUR';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };

        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            ...state,
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    } else if (action.type === INPUT_BLUR) {
        const updatedTouchedInputs = {
            ...state.touchedInputs,
            [action.input]: true
        };
        return {
            ...state,
            touchedInputs: updatedTouchedInputs
        }
    }
    return state;
}
const EditContactScreen = props => {

    const id = props.navigation.getParam('id');
    const contact = useSelector(state => state.contacts.contacts.find(contact => contact.id === id));
    const [selectedImage, setSelectedImage] = useState(contact ? contact.imageUri : null);
    const [isEditable, setIsEditable] = useState(contact ? false : true);
    const [isSaveDisable, setIsSaveDisable] = useState(contact ? true : false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: contact ? contact.name : '',
            mobile: contact ? contact.mobile : '',
            landline: contact ? contact.landline : '',
        },
        inputValidities: {
            name: contact ? true : false,
            mobile: contact ? true : false,
            landline: contact ? true : false,
        },
        formIsValid: contact ? true : false,
        touchedInputs: {
            name: contact ? true : false,
            mobile: contact ? true : false,
            landline: contact ? true : false,
        }
    });

    const editHandler = useCallback(() => {
        setIsEditable(true);
        setIsSaveDisable(false);
    }, []);

    useEffect(() => {
        props.navigation.setParams({ edit: editHandler })
    }, [editHandler]);

    const deleteHandler = useCallback(() => {
        dispatch(deleteContact(id));
        props.navigation.goBack();
    }, [dispatch, id]);

    useEffect(() => {
        props.navigation.setParams({ delete: deleteHandler })
    }, [deleteHandler]);


    const favoriteContacts = useSelector(state => state.contacts.favoriteContacts);
    const isFavoriteContact = favoriteContacts.some(contact => contact.id === id);
    useEffect(() => {
        props.navigation.setParams({ isFavorite: isFavoriteContact })
    }, [isFavoriteContact]);



    const submitHandler = () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check errors in the form.', [{ text: 'Okay', style: 'default' }])
            return;
        }
        if (contact) {
            dispatch(updateContact(id, formState.inputValues.name, formState.inputValues.mobile, formState.inputValues.landline, selectedImage));
        }
        else {
            dispatch(createContact(formState.inputValues.name, formState.inputValues.mobile, formState.inputValues.landline, selectedImage));
        }
        props.navigation.goBack();
    };

    const imageTakenHandler = (image) => {
        setSelectedImage(image);
    }

    const toggleFavoriteHandler = useCallback(() => {
        if (contact) {
            dispatch(toggleFavorite(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
    }, [toggleFavoriteHandler]);

    const textChangedHandler = (inputIdentifier, text) => {
        let isValid = false
        if (text.trim().length > 0) {
            isValid = true;
        }
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: text,
            isValid: isValid,
            input: inputIdentifier
        })
    }
    const lostFocusHandler = (inputIdentifier) => {
        dispatchFormState({
            type: INPUT_BLUR,
            input: inputIdentifier
        })
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <ContactImagePicker style={styles.imageView} imageUri={selectedImage} onImageTaken={imageTakenHandler} />
                <View style={styles.formView}>
                    <View style={styles.formControl}>
                        <Text>Name</Text>
                        <View style={styles.inputAndErrorView}>
                            <TextInput
                                style={styles.inputStyle}
                                value={formState.inputValues.name}
                                onChangeText={textChangedHandler.bind(this, 'name')}
                                editable={isEditable}
                                keyboardType='default'
                                autoCorrect={false}
                                onBlur={lostFocusHandler.bind(this, 'name')} />
                            {!formState.inputValidities.name && formState.touchedInputs.name && <Text style={styles.errorStyle}>Please enter name!</Text>}
                        </View>
                    </View>
                    <View style={styles.formControl}>
                        <Text>Mobile</Text>
                        <View style={styles.inputAndErrorView}>
                            <TextInput
                                style={styles.inputStyle}
                                value={formState.inputValues.mobile}
                                onChangeText={textChangedHandler.bind(this, 'mobile')}
                                editable={isEditable}
                                keyboardType='number-pad'
                                onBlur={lostFocusHandler.bind(this, 'mobile')}
                            />
                            {!formState.inputValidities.mobile && formState.touchedInputs.mobile && <Text style={styles.errorStyle}>Please enter mobile number!</Text>}

                        </View>
                    </View>
                    <View style={styles.formControl}>
                        <Text>Landline</Text>
                        <View style={styles.inputAndErrorView}>
                            <TextInput
                                style={styles.inputStyle}
                                value={formState.inputValues.landline}
                                onChangeText={textChangedHandler.bind(this, 'landline')}
                                editable={isEditable}
                                keyboardType='number-pad'
                                onBlur={lostFocusHandler.bind(this, 'landline')} />
                            {!formState.inputValidities.landline && formState.touchedInputs.landline && <Text style={styles.errorStyle}>Please enter landline number!</Text>}

                        </View>

                    </View>
                  
                </View>
                <View style={styles.buttonStyle}>
                        <Button title="Save" color={Colors.primary} disabled={isSaveDisable} onPress={submitHandler}></Button>
                    </View>

                {/* </ScrollView> */}

            </View>
        </TouchableWithoutFeedback>
    )
}

EditContactScreen.navigationOptions = (navData) => {
    const toggleFavorite = navData.navigation.getParam('toggleFav');
    const editFn = navData.navigation.getParam('edit');
    const deleteFn = navData.navigation.getParam('delete');
    const isFav = navData.navigation.getParam('isFavorite');
    return {
        headerTitle: navData.navigation.getParam('id') ? 'Update Contact' : 'Add New Contact',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title='Favorite' iconName={isFav ? "md-star" : "md-star-outline"} onPress={toggleFavorite}></Item>
                <View style={navData.navigation.getParam('id') ? { flexDirection: 'row' } : { flex: 0, height: 0, width: 0 }}>
                    <Item title='Edit' iconName="md-create" onPress={editFn}></Item>
                    <Item title="Delete" iconName="md-trash" onPress={deleteFn}></Item>
                </View>
            </HeaderButtons>
        )
    }
}
const styles = StyleSheet.create({
    imageView: {
        height: Dimensions.get('window').height / 3,
        backgroundColor: 'red'
    },
    formView: {
        height: Dimensions.get('window').height / 2,
        //backgroundColor: 'yellow'
    },
    formControl: {

        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        alignItems: 'center',
        marginHorizontal: 20
    },
    buttonStyle: {
        height:Dimensions.get('window').height/6,
        width: '100%',
        //margin:0,
        //backgroundColor: 'orange'
    },
    inputStyle: {
        borderWidth: 2,
        height: 40,
        borderColor: Colors.inputBorderColor,
        elevation: 2
    },
    errorStyle: {
        color: 'red'
    },
    inputAndErrorView: {
        flexDirection: "column",
        width: '80%',
    },
    labelStyle: {
        width: '20%'
    }
});

export default EditContactScreen;
