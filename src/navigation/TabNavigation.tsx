import { ICON, ROUTE_NAME } from '@/constants';
import HomeScreen from '@/pages/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === ROUTE_NAME.HOMESCREEN) {
            iconName = ICON.HOME;
          }

          return <Icon name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="HomeScreen1" component={HomeScreen} />
      <Tab.Screen name="HomeScreen2" component={HomeScreen} />
      <Tab.Screen name="HomeScreen3" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
