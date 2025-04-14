import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar as CalendarIcon, Clock } from 'lucide-react-native';

export default function Appointments() {
  const appointments = [
    {
      id: 1,
      professional: 'Dr. Ana Silva',
      service: 'Consulta Odontológica',
      date: '15 Mar',
      time: '14:30',
      status: 'confirmed',
    },
    {
      id: 2,
      professional: 'João Santos',
      service: 'Manutenção Elétrica',
      date: '17 Mar',
      time: '10:00',
      status: 'pending',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
          
          {appointments.map(appointment => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.professionalName}>{appointment.professional}</Text>
                <View style={[
                  styles.statusBadge,
                  appointment.status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusText}>
                    {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.serviceName}>{appointment.service}</Text>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.detailItem}>
                  <CalendarIcon size={16} color="#666" />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.newAppointmentButton}>
          <Text style={styles.newAppointmentText}>Novo Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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