import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../../context/AuthContext';

async function initDB (db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS panier (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      client   TEXT    NOT NULL,
      produit  INTEGER NOT NULL,
      quantite INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (client)  REFERENCES client(nom),
      FOREIGN KEY (produit) REFERENCES produit(num)
    );
  `)
}

const IMAGES = {
  tungtung: require('../../images/tungtung.webp'),
  bombardiro: require('../../images/bombardiro_crocodilo.png'),
  'six-seven': require('../../images/six-seven.png'),
  vaca: require('../../images/vaca.png'),
  tralalero: require('../../images/Tralalero_Tralala.png'),
  ballerina: require('../../images/Ballerina.png'),
  bananini: require('../../images/bananini.png')
}

export default function Details () {
  return (
    <SQLiteProvider databaseName='produits.db' onInit={initDB}>
      <Content />
    </SQLiteProvider>
  )
}

function Content () {
  const { id, titre, prix, image } = useLocalSearchParams()
  const db = useSQLiteContext()
  const { user } = useAuth();

  async function ajouterAuPanier () {
    try {
      // Vérifie si le produit est déjà dans le panier
      const existe = await db.getFirstAsync(
        'SELECT * FROM panier WHERE client = ? AND produit = ?',
        [user.nom, Number(id)]
      )

      if (existe) {
       
        await db.runAsync(
          'UPDATE panier SET quantite = quantite + 1 WHERE client = ? AND produit = ?',
          [user.nom, Number(id)]
        )
      } else {
        //insert si existe pas
        await db.runAsync(
          'INSERT INTO panier (client, produit, quantite) VALUES (?, ?, ?)',
          [user.nom, Number(id), 1]
        )
      }

      Alert.alert('Succès', `"${titre}" a été ajouté au panier !`)
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'ajouter au panier.")
      console.error(e)
    }
  }

  return (
    <View style={styles.container}>
      <Image source={IMAGES[image]} style={styles.image} />
      <Text style={styles.titre}>{titre}</Text>
      <Text style={styles.prix}>{prix} $</Text>
      <Pressable style={styles.pressableAjouter} onPress={ajouterAuPanier}>
        <Text style={styles.textPressable}>Ajouter au panier</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  image: { width: 250, height: 250, marginBottom: 20 },
  titre: { fontSize: 24, fontWeight: 'bold' },
  prix: { fontSize: 20, color: 'green' },
  pressableAjouter: { backgroundColor: 'blue', padding: 12, borderRadius: 8, marginTop: 20 },
  textPressable: { color: 'white', fontSize: 16 }
})