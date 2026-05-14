// MATHIS TEIXEIRA && VINCENT LEVESQUE
// PFI MOBILE
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
  TextInput,
  KeyboardAvoidingView
} from 'react-native'
import { Link, router, useFocusEffect } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../../context/AuthContext';
import i18n from '../../context/i18n'

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
  
    await db.execAsync(`
  DROP TABLE IF EXISTS produit;
  CREATE TABLE IF NOT EXISTS produit (num INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT, image TEXT, prix REAL, description TEXT);
  INSERT INTO produit (titre, image, prix, description) VALUES ('Triple T', 'tungtung', 333, 'Le son du tambour qui résonne dans ta tête... tung tung tung.');
  INSERT INTO produit (titre, image, prix, description) VALUES ('Bombardiro Crocodilo', 'bombardiro', 8.47, 'Mi-bombardier, mi-crocodile. 100% incompréhensible.');
  INSERT INTO produit (titre, image, prix, description) VALUES ('six-seven', 'six-seven', 67.67, 'Six queues, sept têtes. Les maths ne fonctionnent pas ici.');
  INSERT INTO produit (titre, image, prix, description) VALUES ('Vacca Saturno Saturnita', 'vaca', 17.38, 'Une vache orbitale venue des anneaux de Saturne.');
  INSERT INTO produit (titre, image, prix, description) VALUES ('Tralalero Tralala', 'tralalero', 1325.99, 'Il chante, il danse, personne ne comprend pourquoi.');
  INSERT INTO produit (titre, image, prix, description) VALUES ('Ballerina Cappuccina', 'ballerina', 6.98, 'Élégante le matin, caféinée en permanence.');
  INSERT INTO produit (titre, image, prix, description) VALUES ('Chimpanzini Bananini', 'bananini', 0.57, 'Un singe, des bananes, et beaucoup trop d''énergie.');
`)
  
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
              image: maison.image,
              description: maison.description
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
  const [description, setDescription] = useState('');

  async function ajouterArticle () {
    if (!nom.trim() || !prix) return
    await db.runAsync(
      'INSERT INTO produit (titre, image, prix, description) VALUES (?, ?, ?,?)',
      [nom.trim(), 'Placeholder', parseFloat(prix), description.trim()] // image placeholder par défaut
    )
    setNom('')
    setPrix('')
    onAjouter() // rafraîchit la liste
  }

  return (
    <KeyboardAvoidingView style={styles.formConteneur}>
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

      <Text style={styles.formLabel}>Description</Text>
      <TextInput
        style={styles.formInput}
        value={description}
        onChangeText={setDescription}
        placeholder='Description du produit'
        placeholderTextColor='#999'
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
    </KeyboardAvoidingView>
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
       <Text style={styles.titreTexte}>{i18n.t('produits')}</Text>
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
