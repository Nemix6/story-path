import { Feather } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

interface TabItemProps {
    name: string;
    label: string;
    icon: keyof typeof Feather.glyphMap;
    isActive: boolean;
}

const CustomTabItem = (props: TabItemProps) => {
    return (
            // <Tabs.Screen name={props.name} options={{
            //     tabBarIcon: ({color}) => <Feather name={props.icon} size={24} color={color} />,
            //     tabBarLabel: props.label,
            //     tabBarLabelStyle: { color: props.isActive ? "#fff" : "#000" },
            //     headerTitle: props.label
            // }} />
            <TouchableOpacity>
                <Feather name={props.icon} size={24} color={props.isActive ? "#000" : "#fff"} />
                <Text style={{ color: props.isActive ? "#000" : "#fff" }}>{props.label}</Text>
            </TouchableOpacity>
    );
}

export default CustomTabItem;