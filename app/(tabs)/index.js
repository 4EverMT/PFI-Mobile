import React, { useState, useEffect } from 'react'
import { StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable } from 'react-native'
import { Link, router } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'


async function initDB (db) {
  const result = await db.getFirstAsync('PRAGMA user_version')
  const currentVersion = result?.user_version || 0
  if (currentVersion < 1) {
    await db.execAsync(`
    DROP TABLE IF EXISTS produit;
    CREATE TABLE IF NOT EXISTS produit (num INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT, image TEXT, prix REAL);
    INSERT INTO produit (titre, image, prix) VALUES ('Triple T', '../../images/tungtung.webp',333);
    INSERT INTO produit (titre, image, prix) VALUES ('Bombardiro Crocodilo', '../../images/bombardiro_crocodilo.png',8.47);
    INSERT INTO produit (titre, image, prix) VALUES ('six-seven', '../../images/six-seven.png',67.67);
    INSERT INTO produit (titre, image, prix) VALUES ('Vacca Saturno Saturnita', '../../images/vaca.png',17.38);
    INSERT INTO produit (titre, image, prix) VALUES ('Tralalero Tralala', '../../images/Tralalero_Tralala.png',1325.99);
    INSERT INTO produit (titre, image, prix) VALUES ('Ballerina Cappuccina', '../../images/Ballerina.png',6.98);
    INSERT INTO produit (titre, image, prix) VALUES ('Chimpanzini Bananini', '../../images/bananini.png',0.57);
    PRAGMA user_version = 1;
    `)
  }
}
  



const Maison = ({ maison }) => {
  return (
    <View style={styles.maisonConteneur}>
      <Image source={maison.image} style={styles.imageMaison} />
      <Text style={styles.titreMaison}>{maison.titre}     :     {maison.prix}$</Text>
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
    <SQLiteProvider databaseName="produits.db" onInit={initDB}>
      <Content />
    </SQLiteProvider>
  )
}

function Content() {
  const db = useSQLiteContext();
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    chargerProduits();
  }, []);

  async function chargerProduits() {
    const rows = await db.getAllAsync('SELECT * FROM produit');
    setProduits(rows);
  }

  return (
    <View style={styles.container}>
    <View style={styles.titreConteneur}>
      <Text style={styles.titreTexte}>Produits</Text>
    </View>
    <AfficherFlatList produit={produits} />
  </View>
  );
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
  justifyContent: 'center',
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
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
    flexShrink: 1
  },
  imageMaison: {
    width: 150,
    height: 150,
    paddingRight: 10
  }
})


export default HomePage



