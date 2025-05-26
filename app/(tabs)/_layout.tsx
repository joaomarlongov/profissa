import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { Home, Search, Calendar, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const [loggedUser, setLoggedUser] = useState<any>(null);

  const checkUser = async () => {
      try {
        const value = await AsyncStorage.getItem('user');
        if (value) {
          const parsedValue = JSON.parse(value);
          setLoggedUser(parsedValue);
        } else {
          setLoggedUser(null);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
  };

  useEffect(() => {
    checkUser();
    // Add event listener for when the app comes to foreground
    const unsubscribe = () => {
      checkUser();
    };

    // Check user status every time the component mounts or updates
    const interval = setInterval(checkUser, 500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarActiveTintColor: '#1a73e8',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: loggedUser ? 'Início' : '' ,
          tabBarIcon: !loggedUser ? () => null : ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: loggedUser ? 'Buscar' : '',
          tabBarIcon: !loggedUser ? () => null : ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: loggedUser ? 'Agenda' : '',
          tabBarIcon: !loggedUser ? () => null : ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: loggedUser ? 'Perfil' : '',
          tabBarIcon: !loggedUser ? () => null : ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}