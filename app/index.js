import { StyleSheet, Text, View } from "react-native";
import{Link } from 'expo-router'
export default function Page() {
  return (
    <View>
      <View>
        <Text>MAIN PAGE</Text>
        <Link href="/(tabs)"> CONNECTER </Link>
      </View>
    </View>
  );
}