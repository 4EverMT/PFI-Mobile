import React, { useState } from 'react'
import { StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable } from 'react-native'
import { Link, router } from 'expo-router'

const produit1 = require('../../images/tungtung.webp')
const produit2 = require('../../images/bombardiro_crocodilo.png')
const produit3 = require('../../images/six-seven.png')
const produit4 = require('../../images/vaca.png')
const produit5 = require('../../images/Tralalero_Tralala.png')
const produit6 = require('../../images/Ballerina.png')
const produit7 = require('../../images/bananini.png')


const data1 = [
  { num: 1, titre: 'Triple T', image: produit1, prix:333 },
  { num: 2, titre: 'Bombardiro Crocodilo', image: produit2, prix:8.47 },
  {
    num: 3,
    titre: 'six-seven',
    image: produit3,
    prix:67.67
  },
  { num: 4, titre: 'Vacca Saturno Saturnita', image: produit4, prix:17.38 },
  { num: 5, titre: 'Tralalero Tralala', image: produit5, prix:1325.99 },
  { num: 6, titre: 'Ballerina Cappuccina', image: produit6,prix:6.98 },
  { num: 7, titre: 'Chimpanzini Bananini', image: produit7, prix:0.57 }
]

const Maison = ({ maison }) => {
  return (
    <View style={styles.maisonConteneur}>
      <Image source={maison.image} style={styles.imageMaison} />{' '}
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
  const [vue, setVue] = useState('flat')
  const [data, setData] = useState(data1)
  const [quelleData, setQuelleData] = useState(data1)

  return (
    <View style={styles.container}>
      <Text style={[styles.titre, { color: data === data1 ? "white" :'red' }]}>
        Shop-A Brainrot 
      </Text>

      <AfficherFlatList produit={data1}/>
      
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
  titre: {
    backgroundColor: '#00008b',
    paddingTop: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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



