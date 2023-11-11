import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { FontAwesome5 } from '@expo/vector-icons'

interface ItemProps {
  data:{
    id: string;
    product_id: string;
    product_name: string;
    amount: string | number;
  }
  deleteItem: (item_id: string) => void
}

export function ListItem({ data, deleteItem }: ItemProps){

  async function handleDeleteItem() {
    deleteItem(data.id)
  }


  return(
    <View style={styles.container}>
      <Text style={styles.item}>{data.amount} - {data.product_name}</Text>
      
      <TouchableOpacity onPress={handleDeleteItem}>
        <FontAwesome5 name="trash" color="rgb(253 242 248)" size={25} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: 'rgb(236 72 153)',
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 0.3,
    borderColor: '#8a8a8a'
  },
  item:{
    color: 'rgb(253 242 248)'
  }
})