import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable
} from 'react-native'
import { Link, router, useFocusEffect } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../context/AuthContext'
import coordonnees from './coordonnees.json'
import MapView, { Marker, Circle, Polyline } from 'react-native-maps'

import * as Location from 'expo-location'

const entrepots = [
  {
    id: 1,
    nom: 'Entrepôt A',
    latitude: 45.7654316961701,
    longitude: -74.02165192959383
  },
  {
    id: 2,
    nom: 'Entrepôt B',
    latitude: 45.684974050158196,
    longitude: -73.92450686974308
  },
  {
    id: 3,
    nom: 'Entrepôt C',
    latitude: 45.673340295888416,
    longitude: -73.90098926368779
  },
  {
    id: 4,
    nom: 'Entrepôt D',
    latitude: 45.69468698136044,
    longitude: -73.9202153357914
  },
  {
    id: 5,
    nom: 'Entrepôt E',
    latitude: 45.678018075477574,
    longitude: -73.93446322851102
  }
]
export default function App () {
  const { user } = useAuth()
  const [maison, setMaison] = useState(null)
  const [selectionne, setSelectionne] = useState(null)
  // NOUVELLE CHOSE
  // documentation de Expo
  // https://docs.expo.dev/versions/latest/sdk/location/
  useEffect(() => {
    async function GetAdresse () {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission refusée')
        return
      }
      const resultat = await Location.geocodeAsync(user.adresse) // Prend l'adresse et la converti en latitude et longitude.
      if (resultat.length > 0) {
        setMaison({
          latitude: resultat[0].latitude,
          longitude: resultat[0].longitude
        })
      }
    }
    GetAdresse()
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.liste}>
        {entrepots.map(e => (
          <Pressable
            key={e.id}
            style={selectionne === e.id ? styles.boutonActif : styles.bouton}
            onPress={() => setSelectionne(e.id)}
          >
            <Text>{e.nom}</Text>
          </Pressable>
        ))}
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.7,
          longitude: -73.95,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15
        }}
      >
        {maison && (
          <Marker coordinate={maison} title='Ma maison'>
            <Image
              source={require('../images/maison.jpeg')}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        )}
        {entrepots.map(e => (
          <Marker
            key={e.id}
            coordinate={{ latitude: e.latitude, longitude: e.longitude }}
            title={e.nom}
            onPress={() => setSelectionne(e.id)}
          >
            <Image
              source={require('../images/entrepot.jpg')}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        ))}
        {entrepots.map(e => (
          <Circle
            key={e.id}
            center={{ latitude: e.latitude, longitude: e.longitude }}
            radius={5000}
            strokeColor='blue'
            fillColor='rgba(0, 174, 255, 0.38)'
          />
        ))}
        <Polyline coordinates={coordonnees} strokeColor='red' strokeWidth={4} />
      </MapView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  liste: {
    flex: 25
  },
  map: {
    flex: 75,
    width: '100%',
    height: '100%'
  },
  bouton: {
    padding: 6,
    margin: 4,
    backgroundColor: '#ddd',
    borderRadius: 6
  },
  boutonActif: {
    padding: 8,
    margin: 4,
    backgroundColor: '#2563eb',
    borderRadius: 6
  }
})
