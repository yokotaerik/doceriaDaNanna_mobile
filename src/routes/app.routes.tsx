import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";

export type StackParams = {
  Dashboard: undefined;
  Order: {
    table: string;
    order_id: string;
  };
  FinishOrder: {
    table: string;
    order_id: string;
  }
};

const Stack = createNativeStackNavigator<StackParams>();

export default function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FinishOrder"
        component={FinishOrder}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
