import {ImageBackground, StyleSheet, Text, View, TextInput, Pressable} from "react-native";
import{Link, router } from 'expo-router'
import React, { useState } from 'react';
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
const image = require('../images/background_pfi.jpg');
async function initDB(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS client (
      nom TEXT PRIMARY KEY,
      mdp TEXT,
      admin INTEGER,
      adresse TEXT,
      langue TEXT
    );
    INSERT OR IGNORE INTO client (nom, mdp, admin, adresse, langue) 
      VALUES ('user', 'password', 0, '191 rue Lebleu, OrangeVille', 'Francais');
    INSERT OR IGNORE INTO client (nom, mdp, admin, adresse, langue) 
      VALUES ('admin', 'password', 1, '192 rue Lebleu, OrangeVille', 'Anglais');
  `);
}
function Page() {
  return (
      <SQLiteProvider databaseName="produits.db" onInit={initDB}>
        <Content />
      </SQLiteProvider>
  );
}
function Content(){
  const [nom, setNom] = useState('');
  const [mdp, setMdp] = useState('');
  const db = useSQLiteContext()
  async function verifier(nom,mdp){
  const existeDansDb = await db.getFirstAsync('SELECT * FROM client WHERE nom = ? AND mdp = ?',[nom,mdp]);
  if(existeDansDb != null)
    router.push('/(tabs)');
  else
    return console.log('erreur');
}
  return(  
<View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>SHOP-A Brainrot</Text>
        <TextInput
        value={nom}
        onChangeText={(val) => setNom(val)}
        /> 
        <TextInput
        value={mdp}
        onChangeText={(val) => setMdp(val)}
        />
        <Pressable onPress={() => verifier(nom.toLocaleLowerCase(), mdp)}>
          <Text>Soumettre</Text>
        </Pressable>
        <Text style={styles.text}> Mathis Teixeira & Vincent Levesque</Text>
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "black",
    fontSize: 42,
    textAlign: "center",
    backgroundColor: "white"
  },
    text: {
    color: "black",
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "white"
  },
});

export default Page



