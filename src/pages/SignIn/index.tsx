import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../contexts/authContext";

export default function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (email == "" || password == "") {
      alert("Preencha os campos");
      return;
    }

    await signIn({ email, password });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}> Doceria DaNanna</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="rgb(190 24 93)"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="rgb(190 24 93)"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={25} />
          ) : (
            <Text style={{ color: "rgb(253 242 248)" }}> Acessar </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(251 207 232)",
  },

  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    gap: 10,
    padding: 20,
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
  },

  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "rgb(253 242 248)",
    backgroundColor: "rgb(190 24 93)",
  },
});
