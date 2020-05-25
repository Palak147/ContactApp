import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Button, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';


const ContactImagePicker = props => {
  const [pickedImage, setPickedImage] = useState(props.imageUri ? 'file://'+ props.imageUri:null);
  console.log(`printing picked image name: ${pickedImage}`);
  const takeImageHandler = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const imageUri = response.uri;
        setPickedImage(imageUri)
        props.onImageTaken(imageUri);
      }
    });
  }
  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <View style={styles.buttonView}>
            <Icon.Button name='md-camera' backgroundColor='transparent' color='black'  onPress={takeImageHandler}></Icon.Button>
          </View>
        ) : (
            <Image style={styles.imageStyle} source={{ uri: pickedImage }} resizeMode='stretch' />
          )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  imageView: {
    width:Dimensions.get('window').width
  },
  imagePicker: {
    alignItems: "center"
  },
  imagePreview: {
    height: Dimensions.get('window').height/3,
    justifyContent: "center",
    alignContent: "center",
    borderColor: '#ccc',

  },
  imageStyle: {
    width:Dimensions.get('window').width,
    height: Dimensions.get('window').height/3,
  },
  buttonView:{
    justifyContent:'center',
    alignItems:"center",
    alignContent:'center',
    borderWidth:1,
    width:70,
    height:70,
    borderRadius:35,
    overflow:'hidden'
  },
});

export default ContactImagePicker;
