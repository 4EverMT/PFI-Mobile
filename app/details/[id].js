import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  TextInput
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

async function initDB(db) {
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
  bananini: require('../../images/bananini.png'),
  Placeholder:   require('../../images/Placeholder.png')
}

export default function Details() {
  return (
    <SQLiteProvider databaseName='produits.db' onInit={initDB}>
      <Content />
    </SQLiteProvider>
  )
}

function Content() {
  const { id, titre, prix, image } = useLocalSearchParams()
  const db = useSQLiteContext()
  const { user } = useAuth()

  const [nouveauTitre, setNouveauTitre] = useState(titre)
  const [nouveauPrix, setNouveauPrix] = useState(prix)

  //fonction bd
  async function modifierProduit() {
    const prixNumber = parseFloat(nouveauPrix)
    if (!nouveauTitre.trim()) {
      Alert.alert('Erreur', 'Le titre ne peut pas être vide.')
      return
    }
    if (isNaN(prixNumber) || prixNumber < 0) {
      Alert.alert('Erreur', 'Le prix doit être un nombre valide.')
      return
    }
    try {
      await db.runAsync(
        'UPDATE produit SET titre = ?, prix = ? WHERE num = ?',
        [nouveauTitre.trim(), prixNumber, Number(id)]
      )
      Alert.alert('Succès', 'Produit modifié !', [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de modifier le produit.')
      console.error(e)
    }
  }

  async function supprimerProduit() {
    Alert.alert('Confirmer', 'Voulez-vous vraiment supprimer ce produit ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          await db.runAsync('DELETE FROM produit WHERE num = ?', [Number(id)])
          router.back()
        }
      }
    ])
  }

  async function ajouterAuPanier() {
    try {
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

  //admin
  if (user?.admin == 1) {
    return (
      <View style={styles.container}>
        <Image source={IMAGES[image]} style={styles.image} />

        <Text style={styles.label}>Titre</Text>
        <TextInput
          style={styles.input}
          value={nouveauTitre}
          onChangeText={setNouveauTitre}
          placeholder='Titre du produit'
        />

        <Text style={styles.label}>Prix ($)</Text>
        <TextInput
          style={styles.input}
          value={String(nouveauPrix)}
          onChangeText={setNouveauPrix}
          placeholder='Prix'
          keyboardType='decimal-pad'
        />

        <Pressable style={styles.pressableModifier} onPress={modifierProduit}>
          <Text style={styles.textPressable}>Enregistrer les modifications</Text>
        </Pressable>

        <Pressable style={styles.pressableSupprimer} onPress={supprimerProduit}>
          <Text style={styles.textPressable}>Supprimer le produit</Text>
        </Pressable>

        <Pressable style={styles.pressableAnnuler} onPress={() => router.back()}>
          <Text style={styles.textPressable}>Annuler</Text>
        </Pressable>
      </View>
    )
  }

  //pas admin
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
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  pressableAjouter: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  pressableModifier: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  pressableAnnuler: {
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  textPressable: { color: 'white', fontSize: 16 },
  pressableSupprimer: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
})
