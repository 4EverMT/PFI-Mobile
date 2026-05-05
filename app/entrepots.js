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
import MapView, { Marker } from 'react-native-maps'

import * as Location from 'expo-location';

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

  // NOUVELLE CHOSE
  useEffect(() => {
    async function geocoder () {
      const resultat = await Location.geocodeAsync(user.adresse)
      if (resultat.length > 0) {
        setMaison({
          latitude: resultat[0].latitude,
          longitude: resultat[0].longitude
        })
      }
    }
    geocoder()
  }, [])
  return (
    <View style={styles.container}>
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
            
          >
            <Image
              source={require('../images/entrepot.jpg')}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%'
  }
})
