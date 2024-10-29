import { Feather } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs, usePathname } from "expo-router";
import CustomTabItem from "@/components/customTabItem";
import { PointsProvider } from "@/components/PointsContext";

const _layout = () => {
    return (
        <PointsProvider>
            <Tabs screenOptions={{headerLeft: () => <DrawerToggleButton tintColor='#000' />}}>
                <Tabs.Screen name="[project_id]" options={{
                    tabBarIcon: ({ color }) => <Feather name="briefcase" size={24} color={color} />,
                    tabBarLabel: 'Project Home',
                    headerTitle: 'Project Home'
                }}/>

                <Tabs.Screen name="map" options={{
                    tabBarIcon: ({ color }) => <Feather name="map" size={24} color={color} />,
                    tabBarLabel: 'Map',
                    headerTitle: 'Map'
                }}/>

                <Tabs.Screen name="qrScanner" options={{
                    tabBarIcon: ({ color }) => <Feather name="camera" size={24} color={color} />,
                    tabBarLabel: 'QR Code Scanner',
                    headerTitle: 'QR Code Scanner'
                }}
                />
            </Tabs>
        </PointsProvider>
    );
}

export default _layout;