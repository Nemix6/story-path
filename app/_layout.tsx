import { usePathname } from "expo-router"
import React, { useEffect } from "react"
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { View, StyleSheet, Text } from "react-native"
import CustomDrawerItem from "@/components/customDrawerItem"
import { Drawer } from "expo-router/drawer"


const CustomDrawerContent = (props: any) => {
    const path_name = usePathname()

    useEffect(() => {
        console.log(path_name)
    }, [path_name]);

    return (
        // wraps the drawer content and allows it to be scrollable. It passes the props to the drawer content
       <DrawerContentScrollView {...props}>
            <View style={styles.infoContainer}>
                <View style={styles.infoDetailsContainer}>
                    <Text style={styles.appTitle}>Drawer Tabs</Text>
                </View>
            </View>

            <CustomDrawerItem label="Home" path_name={path_name} route_path="/" is_active={path_name === "/"} />
            <CustomDrawerItem label="About" path_name={path_name} route_path="/about" is_active={path_name === "/about"} />
            <CustomDrawerItem label="Profile" path_name={path_name} route_path="/profile" is_active={path_name === "/profile"} />
            <CustomDrawerItem label="Settings" path_name={path_name} route_path="/settings" is_active={path_name === "/settings"} />

       </DrawerContentScrollView>
    );
}

export default function Layout() {
    return (
        <Drawer drawerContent={(props: any) => <CustomDrawerContent {...props} />} screenOptions={{headerShown: false}}>
            <Drawer.Screen name="index" options={{headerShown: true, headerTitle: "Home"}}  />
            <Drawer.Screen name="about" options={{headerShown: true, headerTitle: "About"}} />
            <Drawer.Screen name="profile" options={{headerShown: true, headerTitle: "Profile"}} />
        </Drawer>
    );
}


const styles = StyleSheet.create({
    // navItemLabel: {
    //   marginLeft: -20,
    //   fontSize: 18,
    // },
    infoContainer: {
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderBottomColor: "#ccc",
      borderBottomWidth: 1,
      marginBottom: 10,
    },
    infoDetailsContainer: {
      marginTop: 25,
      marginLeft: 10,
    },
    appTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    }
  });
  