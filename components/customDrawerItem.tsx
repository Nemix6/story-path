import { Feather } from "@expo/vector-icons";
import { DrawerItem } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import { Href, Link, router } from "expo-router";


interface CustomDrawerItemProps {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    route_path: any;
    is_active: boolean;
}

const CustomDrawerItem = (props: CustomDrawerItemProps) => {
    return (
        <DrawerItem
                icon={({ color, size }) => (
                    <Feather name={props.icon} color={props.is_active ? "#fff" : "#000"} size={size} />
                )}
                label={props.label}
                labelStyle={[styles.navItemLabel, { color: props.is_active ? "#fff" : "#000" }]}
                style={{ backgroundColor: props.is_active ? "#fc6f03" : "#fff" }}
                onPress={() => router.push(props.route_path)}
        />
    )
}

export default CustomDrawerItem;

const styles = StyleSheet.create({
    navItemLabel: {
        marginLeft: -20,
        fontSize: 18,
    },
});
