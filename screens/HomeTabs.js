import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactsScreen from './ContactsScreen';
import GroupsScreen from './GroupsScreen';
import ProfileScreen from './ProfileScreen'; // Impor ProfileScreen
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Groups') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'; // Tambahkan ikon untuk Profile
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#1e1e1e',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarActiveTintColor: '#4caf50',
        tabBarInactiveTintColor: '#bbb',
        headerStyle: {
          backgroundColor: '#1e1e1e',
          shadowColor: 'transparent',
        },
        headerTitleStyle: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: 'Contacts',
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          title: 'Groups',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} // Menambahkan tab Profile
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
