import { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Platform,
  TextInput
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppointmentModalProps {
  isVisible: boolean;
  onClose: () => void;
  professional: any;
}

export function AppointmentModal({ isVisible, onClose, professional }: AppointmentModalProps) {
  const { user } = useAuth();
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      if (value) {
        const parsedValue = JSON.parse(value);
        setLoggedUser(parsedValue);
      }
    });
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
 
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            professional_id: professional.id,
            user_id: loggedUser.id,
            date: date.toISOString(),
            description,
            status: 'pending' // pending, confirmed, cancelled, completed
          }
        ])
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
      onClose();
      setDescription('');
      setDate(new Date());
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      Alert.alert('Erro', 'Não foi possível realizar o agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agendar com {professional.name}</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Data e Hora</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleString()}</Text>
            </TouchableOpacity>
{/* 
            {showDatePicker && (

            )} */}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição do Serviço</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o serviço que você precisa..."
            />
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Valor do Serviço</Text>
            <Text style={styles.price}>R$ {professional.price.toFixed(2)}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Agendando...' : 'Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  priceContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#1a73e8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});