import { Text, StyleSheet, View } from 'react-native'
import {  } from 'react-native-web'
const index = () => {
  return (
    <View style={styles.container}>
      <Text>Panier Vide</Text>
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
export default index


