import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut, Star } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();
  const { user } = useAuth();
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const hasReloaded = useRef(false);


  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchProfessionals();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('area')
        .select('*');

      if (error) {
        throw error;
      }

      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', (error as any).message);
    }
  }

  async function fetchUser() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      AsyncStorage.setItem('user', JSON.stringify(data));

      setLoggedUser(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', (error as any).message);
    }
  }

  async function fetchProfessionals() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'professional');

      if (error) {
        throw error;
      }

      setProfessionals(data as any);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', (error as any).message);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {loggedUser?.name}! 👋</Text>
        <Text style={styles.subtitle}>Encontre os melhores profissionais</Text>
      </View>

        <TouchableOpacity onPress={signOut} style={{ position: 'absolute', right: 20, top: 60 }}>
            <LogOut size={24} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sair</Text>
        </TouchableOpacity>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {categories.map((category: any) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.professionalsContainer}>
        <Text style={styles.sectionTitle}>Profissionais em Destaque</Text>
        {professionals.map((professional: any) => (
          <TouchableOpacity key={professional.id} style={styles.professionalCard}>
            <Image 
              source={{ 
                uri: professional.image || 'https://via.placeholder.com/100'
              }} 
              style={styles.professionalImage} 
            />
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>{professional.name}</Text>
              <Text style={styles.professionalSpecialty}>{professional.specialty}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{professional.rating || '0.0'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a73e8',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesList: {
    flexGrow: 0,
  },
  categoryCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  professionalsContainer: {
    padding: 20,
  },
  professionalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionalImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  professionalInfo: {
    flex: 1,
    padding: 16,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  professionalSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});