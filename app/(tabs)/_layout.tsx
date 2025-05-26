import { Tabs } from 'expo-router';
import { Home, Search, Calendar, User } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, StyleSheet, Text, View } from 'react-native';



export default function TabLayout() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const { signIn, signUp } = useAuth();
  
    async function handleSubmit() {
      if (!email || !password) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
      }
      try {
        setLoading(true);
        if (isLogin) {
          await signIn(email, password);
        } else {
          await signUp(email, password);
          Alert.alert('Sucesso', 'Verifique seu email para confirmar o cadastro');
          setIsLogin(true);
        }
      } catch (error) {
        Alert.alert('Erro', (error as any).message);
      } finally {
        setLoading(false);
      }
    }
  const [loggedUser, setLoggedUser] = useState<any>(null);
  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      if (value) {
        const parsedValue = JSON.parse(value);
        setLoggedUser(parsedValue);
      }
    });
  }, []);

  if(!loggedUser) {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{isLogin ? 'Bem-vindo(a) ao Profissa!' : 'Cadastrar'}</Text>
            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />
            <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchButtonText}>
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

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
        name="Login page"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#f5f5f5', height: 50, marginBottom: 16, paddingHorizontal: 16, borderRadius: 8, fontSize: 16 },
  button: { backgroundColor: '#1a73e8', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchButton: { marginTop: 16, alignItems: 'center' },
  switchButtonText: { color: '#1a73e8', fontSize: 14 },
});