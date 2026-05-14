// MATHIS TEIXEIRA && VINCENT LEVESQUE
// PFI MOBILE
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
import i18n from '../../../context/i18n'
import { getLocales } from 'expo-localization'
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
  const [langue, setLangue] = useState(user.langue || 'fr')

  const options = [
    { id: 'fr', label: 'Français' },
    { id: 'en', label: 'English' },
    { id: 'auto', label: 'Auto' }
  ]

  const handleSave = async () => {
    if (!mdp.trim()) {
      Alert.alert(i18n.t('vraiErreur'), i18n.t('erreurMdp'))
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
      if (langue === 'en') {
        i18n.locale = 'en'
      } else if (langue === 'fr') {
        i18n.locale = 'fr'
      } else {
        i18n.locale = getLocales()[0].languageCode
      }

      Alert.alert(i18n.t('succes'), i18n.t('succesProfil'))
    } catch (e) {
      Alert.alert(i18n.t('vraiErreur'), i18n.t('erreurProfil'))
      console.error(e)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{i18n.t('monProfil')}</Text>

      <Text style={styles.label}>{i18n.t('nomLabel')}</Text>
      <View style={styles.readOnly}>
        <Text style={styles.readOnlyText}>{user.nom}</Text>
      </View>

      <Text style={styles.label}>{i18n.t('mdpLabel')}</Text>
      <TextInput
        style={styles.input}
        value={mdp}
        onChangeText={setMdp}
        secureTextEntry
        placeholder={i18n.t('mdpPlaceholder')}
      />

      <Text style={styles.label}>{i18n.t('adresseLabel')}</Text>
      <TextInput
        style={styles.input}
        value={adresse}
        onChangeText={setAdresse}
        placeholder={i18n.t('adressePlaceholder')}
      />

      <Text style={styles.label}>{i18n.t('langueLabel')}</Text>
      <RadioGroup options={options} selected={langue} onSelect={setLangue} />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{i18n.t('sauvegarder')}</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push('/entrepots')}
      >
        <Text style={styles.buttonText}>{i18n.t('entrepot')}</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          router.replace('/(tabs)/../')
        }}
      >
        <Text style={styles.buttonText}>{i18n.t('deconnexion')}</Text>
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
