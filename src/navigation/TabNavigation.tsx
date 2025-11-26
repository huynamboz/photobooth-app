import { ROUTE_NAME } from '@/constants';
import HomeScreen from '@/pages/Home';
import SettingsScreen from '@/pages/Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Home as HomeIcon, Settings as SettingsIcon } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
            [ROUTE_NAME.HOMESCREEN]: HomeIcon,
            [ROUTE_NAME.SETTINGS]: SettingsIcon,
          };
          const IconComponent = iconMap[route.name] ?? HomeIcon;
          return <IconComponent color={color} size={size} />;
        },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen
        name={ROUTE_NAME.HOMESCREEN}
        component={HomeScreen}
        options={{ title: 'Trang chủ' }}
      />
      <Tab.Screen
        name={ROUTE_NAME.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
