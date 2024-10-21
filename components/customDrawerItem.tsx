import { Feather } from "@expo/vector-icons";
import { DrawerItem } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import { Href, router } from "expo-router";


interface CustomDrawerItemProps {
    label: string;
    path_name: string;
    route_path: Href<string>;
    is_active: boolean;
}

const CustomDrawerItem = (props: CustomDrawerItemProps) => {
    return (
        <DrawerItem
            icon={({ color, size }) => (
                <Feather name="list" color={props.is_active ? "#fff" : "#000"} size={size} />
            )}
            label={props.label}
            labelStyle={[styles.navItemLabel, { color: props.is_active ? "#fff" : "#000" }]}
            style={{ backgroundColor: props.is_active ? "#333" : "#fff" }}
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
