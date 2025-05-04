import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, MapPin } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { AppointmentModal } from '../components/modal/AppointmentModal';

interface Area {
  id: number;
  name: string;
  icon: string;
}

interface Professional {
  id: string;
  name: string;
  email: string;
  specialty: string;
  price: number;
  distance?: number;
  area_id: number;
}

export default function Search() {
  const [search, setSearch] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchProfessionals();
  }, [selectedArea, search]);

  async function fetchAreas() {
    try {
      const { data, error } = await supabase
        .from('area')
        .select('*')
        .order('name');

      if (error) throw error;
      setAreas(data);
    } catch (error) {
      console.error('Erro ao buscar áreas:', (error as any).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfessionals() {
    try {
      setLoading(true);
      let query = supabase
        .from('users')
        .select(`*`)
        .eq('role', 'professional');

      if (selectedArea) {
        query = query.eq('area_id', selectedArea);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map((prof: any) => ({
        ...prof,
        price: parseFloat(prof.price || '0'),
        name: prof.name || 'Sem nome',
      }));

      setProfessionals(formattedData);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', (error as any).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar profissionais..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <TouchableOpacity 
            style={[
              styles.categoryChip,
              !selectedArea && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedArea(null)}
          >
            <Text 
              style={[
                styles.categoryText,
                !selectedArea && styles.activeCategoryText,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          {areas.map((area) => (
            <TouchableOpacity 
              key={area.id} 
              style={[
                styles.categoryChip,
                selectedArea === area.id && styles.activeCategoryChip,
              ]}
              onPress={() => setSelectedArea(area.id)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedArea === area.id && styles.activeCategoryText,
                ]}
              >
                {area.icon} {area.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.results}>
        <Text style={styles.resultsTitle}>
          Profissionais {selectedArea ? `em ${areas.find(a => a.id === selectedArea)?.name}` : 'Disponíveis'}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 20 }} />
        ) : professionals.length === 0 ? (
          <Text style={styles.noResults}>Nenhum profissional encontrado</Text>
        ) : (
          professionals.map((professional) => (
            <TouchableOpacity key={professional.id} 
            style={styles.resultCard}
            onPress={() => {
              setSelectedProfessional(professional);
              setIsModalVisible(true);
            }}>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{professional.name}</Text>
                <Text style={styles.resultSpecialty}>{professional.specialty}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#666" />
                <Text style={styles.locationText}>{professional.distance}</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>A partir de</Text>
                <Text style={styles.price}>
                  R$ {professional.price.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}

      {selectedProfessional && (
        <AppointmentModal
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedProfessional(null);
          }}
          professional={selectedProfessional}
        />
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#1a73e8',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  results: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
});