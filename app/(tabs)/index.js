import { View, Text, Pressable } from 'react-native'
import { Link, router } from 'expo-router'
const HomePage = () => {
  return (
    <View>
      <Text>Page d'Accueil</Text>
      <Link href='/tab_1'> Aller au tab 1</Link>
      <Pressable
        style={{ backgroundColor: 'green' }}
        onPress={() => router.push('/tab_2')}
      >
        <Text>Aller au tab 2</Text>
      </Pressable>
    </View>
  )
}
export default HomePage