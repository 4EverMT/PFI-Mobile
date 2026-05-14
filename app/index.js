// MATHIS TEIXEIRA && VINCENT LEVESQUE
// PFI MOBILE
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  StatusBar
} from "react-native";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite';
import { useAuth } from '../context/AuthContext';
import i18n from '../context/i18n';

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

function Content() {
  const [nom, setNom] = useState('');
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState(false);
  const db = useSQLiteContext();
  const { setUser } = useAuth();

  async function verifier(nom, mdp) {
    setErreur(false);
    const existeDansDb = await db.getFirstAsync(
      'SELECT * FROM client WHERE nom = ? AND mdp = ?',
      [nom, mdp]
    );
    if (existeDansDb != null) {
      setUser(existeDansDb);
      router.push('/(tabs)');
    } else {
      setErreur(true);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={image} resizeMode="cover" style={styles.bgImage}>
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>SHOP-A </Text>
            <Text style={styles.title}>BRAINROT</Text>
          </View>

          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{i18n.t('connexion')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{i18n.t('nom')}</Text>
              <TextInput
                style={styles.input}
                value={nom}
                onChangeText={(val) => setNom(val)}
                placeholder={i18n.t('nomPlaceholder')}
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{i18n.t('mdp')}</Text>
              <TextInput
                style={styles.input}
                value={mdp}
                onChangeText={(val) => setMdp(val)}
                placeholder={i18n.t('mdpPlaceholder')}
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {erreur && (
              <Text style={styles.erreurTexte}>
                {i18n.t('erreur')}
              </Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.bouton,
                pressed && styles.boutonPressed
              ]}
              onPress={() => verifier(nom.toLocaleLowerCase(), mdp)}
            >
              <Text style={styles.boutonTexte}>{i18n.t('bouton')}</Text>
            </Pressable>
          </View>

          
          <Text style={styles.footer}>Mathis Teixeira & Vincent Levesque</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
  },
  erreurTexte: {
    color: '#CC0000',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  bouton: {
    backgroundColor: '#00008B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  boutonPressed: {
    backgroundColor: '#000066',
    transform: [{ scale: 0.98 }],
  },
  boutonTexte: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  footer: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 32,
    letterSpacing: 0.5,
  },
});

export default Page;