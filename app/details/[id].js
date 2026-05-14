// MATHIS TEIXEIRA && VINCENT LEVESQUE
// PFI MOBILE
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  ScrollView
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import i18n from '../../context/i18n'

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
  bananini: require('../../images/bananini.png'),
  Placeholder: require('../../images/Placeholder.png')
}

export default function Details () {
  return (
    <SQLiteProvider databaseName='produits.db' onInit={initDB}>
      <Content />
    </SQLiteProvider>
  )
}

function Content () {
  const { id, titre, prix, image, description } = useLocalSearchParams()
  const db = useSQLiteContext()
  const { user } = useAuth()

  const [nouveauTitre, setNouveauTitre] = useState(titre)
  const [nouveauPrix, setNouveauPrix] = useState(prix)
  const [nouvelleDescription, setNouvelleDescription] = useState(
    description || ''
  )

  async function modifierProduit () {
    const prixNumber = parseFloat(nouveauPrix)
    if (!nouveauTitre.trim()) {
      Alert.alert(i18n.t('vraiErreur'), i18n.t('erreurTitre'))
      return
    }
    if (isNaN(prixNumber) || prixNumber < 0) {
      Alert.alert(i18n.t('vraiErreur'), i18n.t('erreurPrix'))
      return
    }
    try {
      await db.runAsync(
        'UPDATE produit SET titre = ?, prix = ?, description = ? WHERE num = ?',
        [
          nouveauTitre.trim(),
          prixNumber,
          nouvelleDescription.trim(),
          Number(id)
        ]
      )
      Alert.alert(i18n.t('succes'), i18n.t('succesModif'), [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (e) {
      Alert.alert(i18n.t('vraiErreur'), i18n.t('erreurModif'))
      console.error(e)
    }
  }


  async function supprimerProduit() {
Alert.alert(i18n.t('confirmer'), i18n.t('confirmSupprimer'), [
  { text: i18n.t('annuler'), style: 'cancel' },
  { text: i18n.t('supprimer'), style: 'destructive', onPress: async () => {
    await db.runAsync('DELETE FROM produit WHERE num = ?', [Number(id)])
    router.back()
  }}
])
  }

  async function ajouterAuPanier () {
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
      Alert.alert(i18n.t('succes'), `"${titre}" ${i18n.t('succesAjout')}`)
    } catch (e) {
      Alert.alert(i18n.t('vraiErreur'), i18n.t('erreurAjout'))
      console.error(e)
    }
  }

  // admin
  if (user?.admin == 1) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={IMAGES[image]} style={styles.image} />

        <Text style={styles.label}>{i18n.t('titre')}</Text>
        <TextInput
          style={styles.input}
          value={nouveauTitre}
          onChangeText={setNouveauTitre}
          placeholder= {i18n.t('titrePlaceholder')}
        />

        <Text style={styles.label}>{i18n.t('prix')}</Text>
        <TextInput
          style={styles.input}
          value={String(nouveauPrix)}
          onChangeText={setNouveauPrix}
          placeholder={i18n.t('prixPlaceholder')}
          keyboardType='decimal-pad'
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={nouvelleDescription}
          onChangeText={setNouvelleDescription}
          placeholder='Description du produit'
          multiline
          numberOfLines={4}
        />

        <Pressable style={styles.pressableModifier} onPress={modifierProduit}>
          <Text style={styles.textPressable}>{i18n.t('enregistrer')}</Text>
        </Pressable>

        <Pressable style={styles.pressableSupprimer} onPress={supprimerProduit}>
          <Text style={styles.textPressable}>{i18n.t('supprimer')}</Text>
        </Pressable>


        <Pressable style={styles.pressableAnnuler} onPress={() => router.back()}>
          <Text style={styles.textPressable}>{i18n.t('annuler')}</Text>

        </Pressable>
      </ScrollView>
    )
  }

  // user
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={IMAGES[image]} style={styles.image} />
      <Text style={styles.titre}>{titre}</Text>
      <Text style={styles.prix}>{prix} $</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      <Pressable style={styles.pressableAjouter} onPress={ajouterAuPanier}>
        <Text style={styles.textPressable}>{i18n.t('ajouterPanier')}</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  image: { width: 250, height: 250, marginBottom: 20 },
  titre: { fontSize: 24, fontWeight: 'bold' },
  prix: { fontSize: 20, color: 'green', marginTop: 6 },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22
  },
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
  inputMultiline: { height: 100, textAlignVertical: 'top' },
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
  pressableSupprimer: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
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
  textPressable: { color: 'white', fontSize: 16 }
})
