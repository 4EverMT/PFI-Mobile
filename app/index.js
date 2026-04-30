import { StyleSheet, Text, View } from "react-native";
import{Link } from 'expo-router'
export default function Page() {
  return (
<<<<<<< Updated upstream
    <View>
      <View>
        <Text>MAIN PAGE</Text>
        <Link href="/(tabs)"> CONNECTER </Link>
      </View>
    </View>
  );
}
=======
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>MAIN PAGE</Text>
        <Link href="/(tabs)" style={styles.text}> CONNECTER </Link>
        </ImageBackground>
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
>>>>>>> Stashed changes
