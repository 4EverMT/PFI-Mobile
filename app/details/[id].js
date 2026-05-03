import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

const IMAGES = {
  'tungtung':     require('../../images/tungtung.webp'),
  'bombardiro':   require('../../images/bombardiro_crocodilo.png'),
  'six-seven':    require('../../images/six-seven.png'),
  'vaca':         require('../../images/vaca.png'),
  'tralalero':    require('../../images/Tralalero_Tralala.png'),
  'ballerina':    require('../../images/Ballerina.png'),
  'bananini':     require('../../images/bananini.png'),
}

export default function Details() {
  const { id, titre, prix, image } = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <Image source={IMAGES[image]} style={styles.image} />
      <Text style={styles.titre}>{titre}</Text>
      <Text style={styles.prix}>{prix} $</Text>
      <Pressable style={styles.pressableAjouter}><Text style={styles.textPressable}>Ajouter au panier</Text></Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  image: { width: 250, height: 250, marginBottom: 20 },
  titre: { fontSize: 24, fontWeight: 'bold' },
  prix: { fontSize: 20, color: 'green' },
  pressableAjouter:{backgroundColor:'blue'},
  textPressable:{color:'white'}
})