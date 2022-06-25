import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider } from "./context/context";
import {
  HomeScreen,
  SaveScreen,
  LoadScreen,
  AddScreen,
  EditScreen,
} from "./screens/index";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true,
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "Cart", headerShown: false }}
          />
          <Stack.Screen
            name="SaveScreen"
            component={SaveScreen}
            options={{ title: "Save List" }}
          />
          <Stack.Screen
            name="LoadScreen"
            component={LoadScreen}
            options={{ title: "Load List" }}
          />
          <Stack.Screen
            name="AddScreen"
            component={AddScreen}
            options={{ title: "Add Item" }}
          />
          <Stack.Screen
            name="EditScreen"
            component={EditScreen}
            options={{ title: "Edit Item" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
