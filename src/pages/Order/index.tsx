import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { api } from "../../service/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

type RouteDetailParams = {
  Order: {
    table: string;
    order_id: string;
  };
};

export type CategoryProps = {
  id: string;
  name: string;
};

export type ProductProps = {
  id: string;
  name: string;
};

export type ItemProps = {
  id: string;
  product_id: string;
  product_name: string;
  amount: number | string;
};

type OrderRouteProps = RouteProp<RouteDetailParams, "Order">;

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const nav = useNavigation<NativeStackNavigationProp<StackParams>>();

  const [category, setCategory] = useState<CategoryProps[]>();
  const [categorySelected, setCategorySelected] = useState<CategoryProps>();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

  const [product, setProduct] = useState<ProductProps[]>();
  const [productSelected, setProductSelected] = useState<ProductProps>();
  const [modalProductVisible, setModalProductVisible] = useState(false);

  const [items, setItems] = useState<ItemProps[]>([]);

  const [amount, setAmount] = useState("1");

  useEffect(() => {
    async function loadInfo() {
      const response = await api.get("/category");

      setCategory(response.data);
      setCategorySelected(response.data[0]);
    }

    loadInfo();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get("/category/product/", {
        params: {
          category_id: categorySelected?.id,
        },
      });

      setProduct(response.data);
      setProductSelected(response.data[0]);
    }

    loadProducts();
  }, [categorySelected]);

  async function handleCloseOrder() {
    try {
      api.delete(`/order`, {
        params: {
          order_id: route.params.order_id,
        },
      });

      nav.navigate("Dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAddItem() {
    try {
      const response = await api.post("/order/add", {
        order_id: route.params.order_id,
        product_id: productSelected?.id,
        amount: Number(amount),
      });

      let data = {
        id: response.data.id,
        product_id: productSelected?.id as string,
        product_name: productSelected?.name as string,
        amount: amount,
      };

      setItems((oldArray) => [...oldArray, data]);
    } catch (err) {
      console.log(err);
    }
  }

  
  async function handleDeleteItem(item_id: string) {
    try {
      const response = await api.delete("/order/delete", {
        params: {
          item_id: item_id
        }
      });

      let data = items.filter( item => {
        return (item.id != item_id)
      } )

      setItems(data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleFinishOrder(){
    nav.navigate("FinishOrder", {
      order_id: route.params.order_id,
      table: route.params.table
    });

  }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.table}</Text>

        <Pressable onPress={handleCloseOrder}>
          <FontAwesome5 name="trash" size={28} color="#FF3F4b" />
        </Pressable>
      </View>

      {category?.length !== 0 && (
        <Pressable
          style={styles.input}
          onPress={() => setModalCategoryVisible(true)}
        >
          <Text style={{ color: "rgb(236 72 153)" }}>
            {categorySelected?.name}
          </Text>
        </Pressable>
      )}

      {product?.length !== 0 && (
        <Pressable
          style={styles.input}
          onPress={() => setModalProductVisible(true)}
        >
          <Text style={{ color: "rgb(236 72 153)" }}>
            {productSelected?.name}
          </Text>
        </Pressable>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[styles.input, { width: "60%", textAlign: "center" }]}
          placeholderTextColor="rgb(190 24 93)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

{/* Adiciona item */}
      <View style={styles.actions}>
        <Pressable style={styles.buttonAdd} onPress={handleAddItem}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>

{/* Termina o pedido */}
        <Pressable
          style={[styles.button, , { opacity: items?.length === 0 ? 0.5 : 1 }]}
          disabled={items?.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </Pressable>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id }
        renderItem={ ({ item }) =>  <ListItem data={item} deleteItem={handleDeleteItem} /> }
      />
      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalCategoryVisible(false)}
          options={category}
          selectedItem={handleChangeCategory}
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalProductVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalProductVisible(false)}
          options={product}
          selectedItem={handleChangeProduct}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(251 207 232)",
    paddingVertical: "5%",
    paddingEnd: "4%",
    paddingStart: "4%",
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgb(236 72 153)",
    marginRight: 14,
  },
  input: {
    borderRadius: 4,
    borderColor: "rgb(236 72 153)",
    backgroundColor: "rgb(253 242 248)",
    width: "100%",
    height: 40,
    marginBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
    color: "rgb(236 72 153)",
    borderWidth: 1,
    fontSize: 20,
  },
  qtdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(236 72 153)",
  },
  actions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  buttonAdd: {
    width: "20%",
    backgroundColor: "rgb(236 72 153)",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "rgb(253 242 248)",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "rgb(236 72 153)",
    borderRadius: 4,
    height: 40,
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
});
