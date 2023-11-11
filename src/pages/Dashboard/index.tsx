import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { AuthContext } from "../../contexts/authContext";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../service/api";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";

export default function Dashboard() {
  const nav = useNavigation<NativeStackNavigationProp<StackParams>>();

  const { signOut } = useContext(AuthContext);

  const [table, setTable] = useState(``);

  async function handleSignOut() {
    await signOut();
  }

  async function openOrder() {
    if (table === "") {
      return;
    }

    console.log("Passou aqui");

    const response = await api.post("/order", {
      table,
    });

    nav.navigate("Order", {
      table,
      order_id: response.data.id,
    });

    setTable("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}> Novo pedido </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite a mesa"
          placeholderTextColor="rgb(190 24 93)"
          value={table}
          onChangeText={setTable}
        />
        <Pressable style={styles.button} onPress={openOrder}>
          <Text style={styles.textButton}> Criar pedido </Text>
        </Pressable>
      </View>
      <Pressable onPress={handleSignOut} style={styles.exitButton}>
        <Text style={styles.textButton}> Sair </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(251 207 232)",
  },

  input: {
    borderRadius: 4,
    borderColor: "rgb(236 72 153)",
    backgroundColor: "rgb(253 242 248)",
    width: "80%",
    height: 42,
    padding: 5,
    color: "rgb(236 72 153)",
    borderWidth: 1,
  },

  button: {
    backgroundColor: "rgb(236 72 153)",
    fontWeight: "bold",
    borderRadius: 4,
    width: "80%",
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    color: "rgb(253 242 248)",
  },

  titulo: {
    fontSize: 40,
    fontWeight: "900",
    color: "rgb(236 72 153)",
  },

  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    gap: 10,
    padding: 20,
  },

  textButton:{
    fontSize: 18,
    fontWeight: 'bold',
    color: "rgb(253 242 248)",
  },

  exitButton:{
    backgroundColor: 'rgb(236 72 153)',
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
  }
});
