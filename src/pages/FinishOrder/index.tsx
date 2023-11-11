import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'

import { Feather } from '@expo/vector-icons'

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { api } from '../../service/api'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParams } from '../../routes/app.routes'
import { SafeAreaView } from 'react-native-safe-area-context'

type RouteDetailParams = {
  FinishOrder: {
    order_id: string;
    table: number | string
  }
}


type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>


export default function FinishOrder(){
  const route = useRoute<FinishOrderRouteProp>();
  const nav = useNavigation<NativeStackNavigationProp<StackParams>>();

  async function handleFinish(){
    const response = await api.put('/order/send', {
      order_id: route.params.order_id
    })

    nav.popToTop()
  }

  async function backToOrder() {
    nav.goBack()
  }

  return(
    <SafeAreaView style={styles.container}>

      <View style={styles.finish}>
        <Text style={styles.alert}>Você deseja finalizar esse pedido?</Text>
        <Text style={styles.title}>{route.params.table}
        </Text>
  
        <Pressable style={styles.button} onPress={handleFinish}>
          <Text style={styles.textButton}>Finalizar pedido</Text>
          <Feather name="shopping-cart" size={20} color="rgb(253 242 248)" />
        </Pressable>
        <Pressable style={styles.backButton} onPress={backToOrder}>
          <Text style={[styles.textButton, {marginRight: 0}]}>Voltar</Text>
        </Pressable>
      </View>

    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "rgb(251 207 232)",
    paddingVertical: '5%',
    paddingHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  finish:{
    flex: 1,
    backgroundColor: "rgb(251 207 232)",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  alert:{
    fontSize:20,
    color: "rgb(236 72 153)",
    fontWeight:'bold',
    marginBottom: 12,
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: "rgb(236 72 153)",
    marginBottom: 12,
  },
  button:{
    backgroundColor: 'rgb(236 72 153)',
    flexDirection: 'row',
    width: '65%',
    height: 40,
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
  },
  textButton:{
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
    color: "rgb(253 242 248)",
  },
  backButton:{
    backgroundColor: 'rgb(236 72 153)',
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
  }
})
