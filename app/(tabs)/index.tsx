import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

const professionals = [
  {
    id: 1,
    name: 'Dr. Ana Silva',
    specialty: 'Dentista',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500',
  },
  {
    id: 2,
    name: 'João Santos',
    specialty: 'Eletricista',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
  },
  {
    id: 3,
    name: 'Maria Oliveira',
    specialty: 'Fisioterapeuta',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
  },
  {
    id: 4,
    name: 'Filipe Costa',
    specialty: 'Programador Web',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1536148935331-408321065b18?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500',
  },
];

const categories = [
  { id: 1, name: 'Saúde', icon: '🏥' },
  { id: 2, name: 'Casa', icon: '🏠' },
  { id: 3, name: 'Beleza', icon: '💅' },
  { id: 4, name: 'Educação', icon: '📚' },
  { id: 5, name: 'Tecnologia', icon: '💻' },
];

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Usuário! 👋</Text>
        <Text style={styles.subtitle}>Encontre os melhores profissionais</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {categories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.professionalsContainer}>
        <Text style={styles.sectionTitle}>Profissionais em Destaque</Text>
        {professionals.map(professional => (
          <TouchableOpacity key={professional.id} style={styles.professionalCard}>
            <Image source={{ uri: professional.image }} style={styles.professionalImage} />
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>{professional.name}</Text>
              <Text style={styles.professionalSpecialty}>{professional.specialty}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{professional.rating}</Text>
              </View>
            </View>
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