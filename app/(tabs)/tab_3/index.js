import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  ScrollView
} from 'react-native'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { Link, router, useFocusEffect } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'

const index = () => {
  return (
    <SQLiteProvider databaseName='produits.db'>
      <Content />
    </SQLiteProvider>
  )
}

const RadioGroup = ({ options, selected, onSelect }) => (
  <View style={styles.radioGroup}>
    {options.map(option => (
      <Pressable
        key={option.id}
        style={styles.radioOption}
        onPress={() => onSelect(option.id)}
      >
        <View style={styles.circle}>
          {selected === option.id && <View style={styles.dot} />}
        </View>
        <Text style={styles.radioLabel}>{option.label}</Text>
      </Pressable>
    ))}
  </View>
)

const Content = () => {
  const db = useSQLiteContext()
  const { user, setUser } = useAuth()

  const [mdp, setMdp] = useState(user.mdp || '')
  const [adresse, setAdresse] = useState(user.adresse || '')
  const [langue, setLangue] = useState(user.langue || 'fr') //langue du radio button

  const options = [
    { id: 'fr', label: 'Français' },
    { id: 'en', label: 'English' } //pour le radio button
  ]

  const handleSave = async () => {
    if (!mdp.trim()) {
      Alert.alert('Erreur', 'Le mot de passe ne peut pas être vide.')
      return
    }

    try {
      await db.runAsync(
        'UPDATE client SET mdp = ?, adresse = ?, langue = ? WHERE nom = ?',
        [mdp, adresse, langue, user.nom]
      )

      if (setUser) {
        setUser({ ...user, mdp, adresse, langue })
      }

      Alert.alert('Succès', 'Profil mis à jour.')
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.')
      console.error(e)
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mon profil</Text>

      <Text style={styles.label}>Nom</Text>
      <View style={styles.readOnly}>
        <Text style={styles.readOnlyText}>{user.nom}</Text>
      </View>

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={mdp}
        onChangeText={setMdp}
        secureTextEntry
        placeholder='Mot de passe'
      />

      <Text style={styles.label}>Adresse</Text>
      <TextInput
        style={styles.input}
        value={adresse}
        onChangeText={setAdresse}
        placeholder='Adresse'
      />

      <Text style={styles.label}>Langue</Text>
      <RadioGroup options={options} selected={langue} onSelect={setLangue} />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/entrepots')}>
        <Text style={styles.buttonText}>Entrepôt</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 8 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  readOnly: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5'
  },
  readOnlyText: { fontSize: 16, color: '#888' },

  radioGroup: { flexDirection: 'row', gap: 20, marginTop: 8 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#2563eb' },
  radioLabel: { fontSize: 16 },
  button: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
})

export default index
