import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar as CalendarIcon, Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, set } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';


export default function Appointments() {
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setLoggedUser(parsedUser);
          await fetchAppointments(parsedUser.id);
        } else {
          setLoggedUser(null);
        }
      } catch (error) {
        console.error('Erro ao recuperar o usuário:', error);
      }
    };

    fetchUserAndAppointments();
  }, []);

  async function fetchAppointments(userId: string) {
    try {
      setLoading(true);
  
      const { data, error } = await supabase
        .from('user_appointments')
        .select('*')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true });
  
      if (error) throw error;
  
  
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }
  

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  }

  function formatTime(dateString: string) {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm");
    } catch {
      return '--:--';
    }
  }

  function getStatusText(status: string) {
    const statusMap = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Concluído'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  function getStatusStyle(status: string) {
    const statusStyles = {
      confirmed: styles.confirmedBadge,
      pending: styles.pendingBadge,
      cancelled: styles.cancelledBadge,
      completed: styles.completedBadge
    };
    return statusStyles[status as keyof typeof statusStyles] || styles.pendingBadge;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {appointments.length > 0 ? 'Próximos Agendamentos' : 'Nenhum agendamento encontrado'}
            </Text>
            
            {appointments.map(appointment => (
              <TouchableOpacity 
                key={appointment.appointment_id} 
                style={styles.appointmentCard}
              >
                <View style={styles.appointmentHeader}>
                  <Text style={styles.professionalName}>
                    {appointment.professional.name}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    getStatusStyle(appointment.status)
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(appointment.status)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.serviceName}>
                  {appointment.description}
                </Text>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailItem}>
                    <CalendarIcon size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {formatDate(appointment.appointment_date)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {formatTime(appointment.appointment_date)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelledBadge: {
    backgroundColor: '#ffebee',
  },
  completedBadge: {
    backgroundColor: '#e8f5e9',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: '#e6f4ea',
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  newAppointmentButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newAppointmentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});