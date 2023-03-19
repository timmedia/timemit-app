import { Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <Button
      title="Go to timer"
      onPress={() => navigation.navigate("Timer", { name: "Jane" })}
    />
  );
}
