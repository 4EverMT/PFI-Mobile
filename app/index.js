import {ImageBackground, StyleSheet, Text, View } from "react-native";
import{Link } from 'expo-router'

const image = require('../images/background_pfi.jpg');

 function Page() {
  return (
    <View>
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text>MAIN PAGE</Text>
        <Link href="/(tabs)"> CONNECTER </Link>
        </ImageBackground>
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    textAlign: "center",
  }
});

export default Page