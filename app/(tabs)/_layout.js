// MATHIS TEIXEIRA && VINCENT LEVESQUE
// PFI MOBILE
import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import {View, Text} from 'react-native';
import i18n from '../../context/i18n';
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
          headerTitle: i18n.t('produits'),
          title: i18n.t('produits'),
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="reproduction" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='tab_2/index'
        options={{
          headerTitle: i18n.t('panier'),
          title: i18n.t('panier'),
          tabBarIcon: ({color}) => <Feather name="shopping-cart" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='tab_3/index'
        options={{
          headerTitle: i18n.t('compte'),
          title: i18n.t('compte'),
          tabBarIcon: ({color}) => <Feather name="user" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
export default TabsLayout