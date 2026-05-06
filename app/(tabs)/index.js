import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
  TextInput
} from 'react-native'
import { Link, router, useFocusEffect } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../../context/AuthContext'

const IMAGES = {
  tungtung: require('../../images/tungtung.webp'),
  bombardiro: require('../../images/bombardiro_crocodilo.png'),
  'six-seven': require('../../images/six-seven.png'),
  vaca: require('../../images/vaca.png'),
  tralalero: require('../../images/Tralalero_Tralala.png'),
  ballerina: require('../../images/Ballerina.png'),
  bananini: require('../../images/bananini.png'),
  Placeholder: require('../../images/Placeholder.png')
}

async function initDB (db) {
  const result = await db.getFirstAsync('PRAGMA user_version')
  const currentVersion = result?.user_version || 0
  if (currentVersion < 2) {
    await db.execAsync(`
    DROP TABLE IF EXISTS produit;
    CREATE TABLE IF NOT EXISTS produit (num INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT, image TEXT, prix REAL);
    INSERT INTO produit (titre, image, prix) VALUES ('Triple T', 'tungtung',333);
    INSERT INTO produit (titre, image, prix) VALUES ('Bombardiro Crocodilo', 'bombardiro',8.47);
    INSERT INTO produit (titre, image, prix) VALUES ('six-seven', 'six-seven',67.67);
    INSERT INTO produit (titre, image, prix) VALUES ('Vacca Saturno Saturnita', 'vaca',17.38);
    INSERT INTO produit (titre, image, prix) VALUES ('Tralalero Tralala', 'tralalero',1325.99);
    INSERT INTO produit (titre, image, prix) VALUES ('Ballerina Cappuccina', 'ballerina',6.98);
    INSERT INTO produit (titre, image, prix) VALUES ('Chimpanzini Bananini', 'bananini',0.57);
    PRAGMA user_version = 2;
    `)
  }
}

const Maison = ({ maison, onSupprimer }) => {
  

  return (
    <View style={styles.maisonConteneur}>
      <Pressable
        style={styles.pressableItem}
        onPress={() =>
          router.push({
            pathname: '/details/[id]',
            params: {
              id: maison.num,
              titre: maison.titre,
              prix: maison.prix,
              image: maison.image
            }
          })
        }
      >
        <Image source={IMAGES[maison.image]} style={styles.imageMaison} />
        <Text style={styles.titreMaison}>
          {maison.titre} : {maison.prix}$
        </Text>
      </Pressable>
    </View>
  )
}

const AfficherFlatList = ({ produit }) => {
  return (
    <FlatList
      data={produit}
      renderItem={({ item }) => <Maison maison={item} />}
      keyExtractor={item => item.num.toString()}
    />
  )
}

const HomePage = () => {
  return (
    <SQLiteProvider databaseName='produits.db' onInit={initDB}>
      <Content />
    </SQLiteProvider>
  )
}

const FormAjouter = ({ db, onAjouter }) => {
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')

  async function ajouterArticle () {
    if (!nom.trim() || !prix) return
    await db.runAsync(
      'INSERT INTO produit (titre, image, prix) VALUES (?, ?, ?)',
      [nom.trim(), 'Placeholder', parseFloat(prix)] // image placeholder par défaut
    )
    setNom('')
    setPrix('')
    onAjouter() // rafraîchit la liste
  }

  return (
    <View style={styles.formConteneur}>
      <Text style={styles.formTitre}>Ajouter un produit</Text>

      <Text style={styles.formLabel}>Titre</Text>
      <TextInput
        style={styles.formInput}
        value={nom}
        onChangeText={setNom}
        placeholder='Nom du produit'
        placeholderTextColor='#999'
      />

      <Text style={styles.formLabel}>Prix ($)</Text>
      <TextInput
        style={styles.formInput}
        value={prix}
        onChangeText={setPrix}
        placeholder='0.00'
        placeholderTextColor='#999'
        keyboardType='decimal-pad' //forcer des chiffres
      />

      <Pressable
        style={({ pressed }) => [
          styles.formBouton,
          pressed && styles.formBoutonPressed
        ]}
        onPress={ajouterArticle}
      >
        <Text style={styles.formBoutonTexte}>+ Ajouter</Text>
      </Pressable>
    </View>
  )
}

function Content () {
  const db = useSQLiteContext()
  const [produits, setProduits] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    chargerProduits()
  }, [])

  useFocusEffect(
    useCallback(() => {
      chargerProduits()
    }, [])
  )

  async function chargerProduits () {
    const rows = await db.getAllAsync('SELECT * FROM produit')
    setProduits(rows)
  }

  return (
    <View style={styles.container}>
      <View style={styles.titreConteneur}>
        <Text style={styles.titreTexte}>Produits</Text>
      </View>
       {/* Formulaire visible seulement pour l'admin */}
      {user?.admin == 1 && (
        <FormAjouter db={db} onAjouter={chargerProduits} />
      )}
      <AfficherFlatList produit={produits} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 25
  },
  maisonConteneur: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 5,
    height: 160
  },
  titreConteneur: {
    backgroundColor: '#00008b',
    paddingTop: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titreTexte: {
    color: '#F3F3F3',
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },

  touchableBtn: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5
  },

  pressableBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  to_button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 5,
    margin: 5
  },
  titreMaison: {
    color: '#000000',
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
    flexShrink: 1
  },
  imageMaison: {
    width: 150,
    height: 150,
    paddingRight: 10
  },
  pressableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  supprimerBtn: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5
  },
  supprimerTexte: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  formConteneur: {
    backgroundColor: '#F0F4FF',
    borderBottomWidth: 2,
    borderBottomColor: '#00008b',
    padding: 16
  },
  formTitre: {
    fontSize: 16,
    fontWeight: '800',
    color: '#00008b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111',
    marginBottom: 10
  },
  formBouton: {
    backgroundColor: '#00008b',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4
  },
  formBoutonPressed: {
    backgroundColor: '#000066'
  },
  formBoutonTexte: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1
  }
})

export default HomePage
