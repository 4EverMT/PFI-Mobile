import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          headerTitle: 'Accueil ',
          title: 'Tab Accueil',
          tabBarIcon: () => <Ionicons name='home' size={24}/>
        }}
      />
      <Tabs.Screen
        name='tab_1/index'
        options={{
          headerTitle: 'Croisières',
          title: 'Croisières',
          tabBarIcon: () => <Fontisto name="sait-boat" size={24}/>
        }}
      />
      <Tabs.Screen
        name='tab_2/index'
        options={{
          headerTitle: 'Recherche',
          title: 'Recherche',
          tabBarIcon: () => <Feather name="search" size={24} />
        }}
      />
    </Tabs>
  )
}
export default TabsLayout