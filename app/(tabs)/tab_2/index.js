import React, { useState, useCallback } from 'react'
import {
  View, Text, Image, StyleSheet,
  FlatList, Pressable, Alert
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useSQLiteContext, SQLiteProvider } from 'expo-sqlite'
import { useAuth } from '../../../context/AuthContext'
import i18n from '../../../context/i18n'

const IMAGES = {
  tungtung:   require('../../../images/tungtung.webp'),
  bombardiro: require('../../../images/bombardiro_crocodilo.png'),
  'six-seven':require('../../../images/six-seven.png'),
  vaca:       require('../../../images/vaca.png'),
  tralalero:  require('../../../images/Tralalero_Tralala.png'),
  ballerina:  require('../../../images/Ballerina.png'),
  bananini:   require('../../../images/bananini.png'),
  Placeholder:   require('../../../images/Placeholder.png'),
}

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

export default function Panier() {
  return (
    <SQLiteProvider databaseName='produits.db' onInit={initDB}>
      <Content />
    </SQLiteProvider>
  )
}

function Content() {
  const db = useSQLiteContext()
  const { user } = useAuth()
  const [articles, setArticles] = useState([])

  useFocusEffect(
    useCallback(() => {
      chargerPanier()
    }, [])
  )

  async function chargerPanier() {
    const rows = await db.getAllAsync(`
      SELECT panier.id, panier.quantite, produit.num, produit.titre, produit.prix, produit.image
      FROM panier
      JOIN produit ON panier.produit = produit.num
      WHERE panier.client = ?
    `, [user.nom])
    setArticles(rows)
  }

  async function changerQuantite(id, delta) {
    const article = articles.find(a => a.id === id)
    const nouvelleQuantite = article.quantite + delta

    if (nouvelleQuantite <= 0) {
      await db.runAsync('DELETE FROM panier WHERE id = ?', [id])
    } else {
      await db.runAsync(
        'UPDATE panier SET quantite = ? WHERE id = ?',
        [nouvelleQuantite, id]
      )
    }
    chargerPanier()
  }

  async function supprimerArticle(id) {
    Alert.alert(
      i18n.t('supprimerArticle'),
      i18n.t('supprimerMessage'),
      [
        { text: i18n.t('annuler'), style: 'cancel' },
        {
          text: i18n.t('supprimerArticle'),
          style: 'destructive',
          onPress: async () => {
            await db.runAsync('DELETE FROM panier WHERE id = ?', [id])
            chargerPanier()
          }
        }
      ]
    )
  }

  const total = articles.reduce((acc, a) => acc + a.prix * a.quantite, 0)

  function ArticlePanier({ article }) {
    return (
      <View style={styles.articleConteneur}>
        <Image source={IMAGES[article.image]} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.titre}>{article.titre}</Text>
          <Text style={styles.prix}>{(article.prix * article.quantite).toFixed(2)} $</Text>

          <View style={styles.quantiteConteneur}>
            <Pressable
              style={styles.btnQuantite}
              onPress={() => changerQuantite(article.id, -1)}
            >
              <Text style={styles.btnQuantiteTexte}>−</Text>
            </Pressable>

            <Text style={styles.quantite}>{article.quantite}</Text>

            <Pressable
              style={styles.btnQuantite}
              onPress={() => changerQuantite(article.id, +1)}
            >
              <Text style={styles.btnQuantiteTexte}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.btnSupprimer}
          onPress={() => supprimerArticle(article.id)}
        >
          <Text style={styles.btnSupprimerTexte}>🗑️</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.titreConteneur}>
        <Text style={styles.titreTexte}>{i18n.t('monPanier')}</Text>
      </View>

      {articles.length === 0 ? (
        <View style={styles.vide}>
          <Text style={styles.videTexte}>{i18n.t('panierVide')}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={articles}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <ArticlePanier article={item} />}
          />

          <View style={styles.totalConteneur}>
            <Text style={styles.totalTexte}>{i18n.t('total')}</Text>
            <Text style={styles.totalMontant}>{total.toFixed(2)} $</Text>
          </View>

          <Pressable style={styles.btnCommander}>
            <Text style={styles.btnCommanderTexte}>{i18n.t('commander')}</Text>
          </Pressable>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 25
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
  articleConteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    height: 120,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  titre: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  prix: {
    fontSize: 14,
    color: 'green',
    marginBottom: 8,
  },
  quantiteConteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnQuantite: {
    backgroundColor: '#00008b',
    borderRadius: 6,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnQuantiteTexte: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantite: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  btnSupprimer: {
    padding: 8,
  },
  btnSupprimerTexte: {
    fontSize: 22,
  },
  vide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videTexte: {
    fontSize: 18,
    color: '#999',
  },
  totalConteneur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  totalTexte: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalMontant: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  btnCommander: {
    backgroundColor: '#00008b',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCommanderTexte: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})