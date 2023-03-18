import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LapTime from "./src/components/LapTime";
import TotalTimeTitle from "./src/components/TotalTimeTitle";
import AppStyles from "./Style";

const timerInitialState = {
  paused: true,
  millisPreCurrentEpoch: 0,
  currentEpochStart: 0,
  totalElapsedMillis: 0,
  laps: [] as { name: string; millis: number }[],
};

export default function App() {
  const [timer, setTimer] = useState(() => timerInitialState);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTimer((oldTimer) => {
        const totalElapsedMillis = oldTimer.paused
          ? oldTimer.totalElapsedMillis
          : oldTimer.millisPreCurrentEpoch + now - oldTimer.currentEpochStart;
        const laps = [...oldTimer.laps];
        const lappedMillis = laps.reduce((curr, prev) => curr + prev.millis, 0);
        if (laps.length > 0 && !oldTimer.paused)
          laps[0] = {
            name: laps[0].name,
            millis: laps[0].millis + totalElapsedMillis - lappedMillis,
          };
        return {
          ...oldTimer,
          totalElapsedMillis,
          laps,
        };
      });
    }, 10);
    return () => clearInterval(interval);
  }, [timer]);

  const start = () => {
    const laps = [...timer.laps];
    if (laps.length === 0) laps.push({ name: "Lap 1", millis: 0 });
    setTimer((oldTimer) => ({
      ...oldTimer,
      laps,
      currentEpochStart: Date.now(),
      paused: false,
    }));
  };

  const pause = () => {
    setTimer((oldTimer) => ({
      ...oldTimer,
      paused: true,
      millisPreCurrentEpoch:
        oldTimer.millisPreCurrentEpoch +
        Date.now() -
        oldTimer.currentEpochStart,
    }));
  };

  const lap = () => {
    setTimer((oldTimer) => ({
      ...oldTimer,
      laps: [
        { name: `Lap ${oldTimer.laps.length}`, millis: 0 },
        ...oldTimer.laps,
      ],
    }));
  };

  const reset = () => {
    Alert.alert("Warning", "Resetting the timer will delete all entries.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        onPress: () => setTimer(() => timerInitialState),
        style: "destructive",
      },
    ]);
  };

  const editLap = (index: number) => {
    console.log(index);
  };

  const renameLap = (index: number) => {
    console.log(index);
    Alert.prompt(
      "Modify time",
      "Select an option or enter a time",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (name) =>
            setTimer((oldTimer) => {
              const laps = [...timer.laps];
              laps[index] = { ...laps[index], name };
              return {
                ...oldTimer,
                laps,
              };
            }),
        },
      ],
      "plain-text",
      timer.laps[index].name
    );
  };

  return (
    <View style={styles.container}>
      <TotalTimeTitle totalMillis={timer.totalElapsedMillis}></TotalTimeTitle>
      <View style={styles.buttonContainer}>
        <Button
          color={AppStyles.secondary}
          onPress={reset}
          title="Reset"
          disabled={timer.laps.length === 0}
        ></Button>
        <Button color={AppStyles.secondary} onPress={lap} title="Lap"></Button>
        <Button
          color={AppStyles.secondary}
          onPress={timer.paused ? start : pause}
          title={timer.paused ? "Start" : "Pause"}
        ></Button>
      </View>
      <FlatList
        style={styles.timeList}
        extraData={timer.laps}
        data={timer.laps}
        renderItem={({ item, index }) => (
          <LapTime
            name={item.name}
            millis={item.millis}
            onEdit={() => editLap(index)}
            onRename={() => renameLap(index)}
          ></LapTime>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: AppStyles.background,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: 50,
  },
  timeList: {
    width: "100%",
    margin: 10,
    height: "100%",
    padding: 10,
  },
  bodyText: {
    color: "#fff",
  },
});
