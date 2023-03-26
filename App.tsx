import { Pressable, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  NavigationContainer,
  Theme,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import TimerScreen from "./src/screens/TimerScreen";
import AppStyles from "./Style";

const Stack = createNativeStackNavigator();

const MyTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: AppStyles.primary,
  },
  dark: true,
};

export default function App() {
  const navigationRef = useNavigationContainerRef();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <NavigationContainer ref={navigationRef} theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Select Timer",
              headerRight: () => (
                <Pressable onPress={() => alert("new item")}>
                  <Text style={{ color: AppStyles.primary, fontSize: 20 }}>
                    New ＋
                  </Text>
                </Pressable>
              ),
            }}
          />
          <Stack.Screen name="Timer" component={TimerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
