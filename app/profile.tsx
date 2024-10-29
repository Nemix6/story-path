import { SafeAreaView, ScrollView, View, Image, Dimensions, Text, Button, StyleSheet, Platform, Touchable, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { createContext, useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";

const { width, height } = Dimensions.get("window");

const Profile = () => {

    // useEffect(() => {
    //     (async () => {
    //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if (status !== 'granted') {
    //             alert('Sorry, we need camera roll permissions to make this work!');
    //         }
    //     })();
    // }, []);

    // state to hold the photo details
    const { username, setUsername, photoState, setPhotoState } = useUser();

    // function to handle the image picker
    const handleChangePress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1], // 1:1 aspect ratio to keep the image square so it can be turned into a circle
            quality: 1,
        });

        // If the user didn't cancel and an image is selected, update the state
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhotoState(result.assets[0]);
        }
    }

    // function to remove the selected image
    // const handleRemovePress = async () => {
    //     setPhotoState({});
    // }

    // check if the user has selected a photo
    const hasPhoto = Boolean(photoState.uri);

    const Photo = (props: any) => {
        if (hasPhoto) {
            return (
                <View style={styles.photoFullView}>
                    <Image source={{ uri: photoState.uri }} 
                    style={styles.photoCircleImage} 
                    resizeMode="cover"/>
                </View>
            );
        } else {
            return (<View style={styles.photoEmptyView}>
                <Text style={styles.placeholder_text}>Tap to add photo</Text>
            </View>
            );
        }
    }
    
    return (
        <SafeAreaView>
            <View style={styles.profile_container}>
                <View style={styles.container}>
                <FontAwesome5 name="user-circle" size={70} color="#fc6f03" />
                <Text style={styles.profile_text}>Your Profile</Text>
                </View>
            </View>

            <View style={styles.photo_container}>
                <TouchableOpacity onPress={handleChangePress}>
                    <Photo />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <TextInput style={styles.text_input}
                    placeholder="Username" onChange={(e) => setUsername(e.nativeEvent.text)}/>
            </View>
        </SafeAreaView>
        
    );
}

export default Profile;



const styles = StyleSheet.create({
    photo_container : {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        marginTop: 20,
        // alignItems: "center", // THIS CODE SOMEHOW BREAKS THE IMAGE PICKER
    },

    container : {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: "center", // THIS CODE SOMEHOW BREAKS THE IMAGE PICKER
    },

    profile_container : {
        paddingBottom: 20,
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "lightgrey",
    },

    profile_text : {
        color: "#fc6f03",
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 10,
    },

    photoFullView: {
        marginBottom: 20
    },
    photoEmptyView: {
        borderWidth: 3,
        borderRadius: 120,
        borderColor: "#999",
        borderStyle: "dashed",
        width: "50%",
        height: height / 5.5,
        marginBottom: 20,
    },

    photoCircleImage: {
        width: "50%",
        height: height / 5.5,
        borderRadius: 75
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-around"
    },

    placeholder_text : {
        color: "#999",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "40%",
    },

    text_input : {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: "100%",
        color: "gray",
    },
});