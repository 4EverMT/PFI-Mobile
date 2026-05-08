import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import {View, Text} from 'react-native';
const TabsLayout = () => {
  const {user} = useAuth()
  function header(){
  return (
    <View>
      <Text>{user.nom}</Text>
      <Text>{user.langue}</Text>
    </View>
  )
}
  return (
    <Tabs screenOptions={{ headerShown:true,headerRight: header, tabBarActiveTintColor: "blue", tabBarInactiveTintColor: "lightblue"}}>
      <Tabs.Screen
        name='index'
        options={{
          headerTitle: 'Produits',
          title: 'Produits',
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="reproduction" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='tab_2/index'
        options={{
          headerTitle: 'Panier',
          title: 'Panier',
          tabBarIcon: ({color}) => <Feather name="shopping-cart" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='tab_3/index'
        options={{
          headerTitle: 'Compte',
          title: 'Compte',
          tabBarIcon: ({color}) => <Feather name="user" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
export default TabsLayout