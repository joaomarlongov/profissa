import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Settings, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {

  const { user } = useAuth();
  const [loggedUser, setLoggedUser] = useState<any>(null);

  const menuItems = [
    { icon: Settings, label: 'Configurações' },
    { icon: CreditCard, label: 'Pagamento' },
    { icon: Bell, label: 'Notificações' },
    { icon: HelpCircle, label: 'Ajuda' },
  ];

  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      if (value) {
        const parsedValue = JSON.parse(value);
        setLoggedUser(parsedValue);
      }
    });
  }, []);



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: loggedUser?.image }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{loggedUser?.name}</Text>
        <Text style={styles.email}>exemplo@gmail.com</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <item.icon size={24} color="#1a73e8" />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a73e8',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '500',
  },
});