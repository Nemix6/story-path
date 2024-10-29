import { router, usePathname } from "expo-router"
import React, { useEffect } from "react"
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { View, StyleSheet, Text, Image } from "react-native"
import CustomDrawerItem from "@/components/customDrawerItem"
import { Drawer } from "expo-router/drawer"
import Icon from 'react-native-vector-icons/Feather';
import { FontAwesome5 } from "@expo/vector-icons"
import { UserProvider } from "@/components/UserContext"
import { useUser } from "@/components/UserContext"

const CustomDrawerContent = (props: any) => {
    const path_name = usePathname()
    const { username,photoState } = useUser()

    useEffect(() => {
        console.log(path_name)
    }, [path_name]);

    return (
        // wraps the drawer content and allows it to be scrollable. It also passes the props to the drawer content
       <DrawerContentScrollView {...props}>
            <View style={styles.infoContainer}>
                <View style={styles.infoDetailsContainer}>
                    <FontAwesome5 name="book-reader" size={40} color="#fc6f03" style={styles.icon} />
                    <Text style={styles.appTitle}>StoryPath</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                {photoState.uri ? (
                    <Image source={{ uri: photoState.uri }} style={styles.photoCircleImage} resizeMode="cover" />
                ) : (
                    <Icon name="user" size={30} color="#000" style={styles.icon} />
                )}
                <View style={styles.userDetailsContainer}>
                    <Text style={styles.appText}>Current User:</Text>
                    <Text style={styles.appText}>{username || "No User"}</Text>
                </View>
            </View>
            
            <CustomDrawerItem label="Welcome" icon={"home"} route_path="/" is_active={path_name === "/"} />
            <CustomDrawerItem label="Profile" icon={"user"} route_path="/profile" is_active={path_name === "/profile"} />
            <CustomDrawerItem label="Projects" icon={"book-open"} route_path="/projectLists" is_active={path_name === "/projectLists"} />
            <CustomDrawerItem label="About" icon={"info"} route_path="/about" is_active={path_name === "/about"} />

       </DrawerContentScrollView>
    );
}

export default function Layout() {
    return (
        <UserProvider>
            <Drawer screenOptions={{headerShown: false}} drawerContent={(props: any) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="index" options={{headerShown: true, headerTitle: "Home"}} />
                <Drawer.Screen name="profile" options={{headerShown: true, headerTitle: "Profile"}} />
                <Drawer.Screen name="projectLists" options={{headerShown: true, headerTitle: "Projects"}} />
                <Drawer.Screen name="about" options={{headerShown: true, headerTitle: "About"}} />
            </Drawer>
        </UserProvider>
    );
}


const styles = StyleSheet.create({

    infoContainer: {
        flexDirection: "row", // aligns items horizontally
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderBottomColor: "#ccc",
      borderBottomWidth: 1,
      marginBottom: 0,
      alignItems: "center", // aligns items vertically
    },
    infoDetailsContainer: {
      marginTop: 25,
      marginLeft: 10,
        flexDirection: "row",
    },
    appTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: "#fc6f03",
    },

    userDetailsContainer: {
        marginTop: 1,
        marginLeft: 10,
    },

    appText: {
        fontSize: 18,
        },

    photoCircleImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    icon: {
        marginRight: 14,
    },
  });
  