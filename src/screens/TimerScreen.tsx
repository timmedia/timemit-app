import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import AppStyles from "../../Style";
import LapTime from "../components/LapTime";
import TotalTimeTitle from "../components/TotalTimeTitle";

interface TimerState {
  paused: boolean;
  millisPreCurrentEpoch: number;
  currentEpochStart: number;
  totalElapsedMillis: number;
  splits: { name: string; millis: number }[];
}

const timerInitialState: TimerState = {
  paused: true,
  millisPreCurrentEpoch: 0,
  currentEpochStart: 0,
  totalElapsedMillis: 0,
  splits: [],
};

// const timerInitialState: TimerState = {
//   paused: true,
//   millisPreCurrentEpoch: 0,
//   currentEpochStart: 1679781171958,
//   totalElapsedMillis: 0,
//   splits: [
//     { name: "Final Day 🥳🏁", millis: 37943610 },
//     { name: "Monday 23 Jan 🔜", millis: 37577520 },
//     { name: "Saturday", millis: 32928580 },
//     { name: "Friday 🤒", millis: 32621550 },
//     { name: "Thursday", millis: 32424010 },
//     { name: "Monday 16 Jan", millis: 32591930 },
//     { name: "Friday 13! 🍀", millis: 36016790 },
//     { name: "Thursday 👨‍💻🚲", millis: 7994630 },
//     { name: "Tuesday 😴", millis: 45477160 },
//     { name: "Monday 9 Jan", millis: 42888630 },
//     { name: "Saturday", millis: 44768430 },
//     { name: "Friday 👨‍💻", millis: 40246680 },
//     { name: "Thursday 🌦️", millis: 39913010 },
//     { name: "Wednesday", millis: 39883920 },
//     { name: "Monday 2 Jan", millis: 39725890 },
//     { name: "Final Day 🥳", millis: 10000 },
//   ],
// };

export default function TimerScreen({ navigation, route }) {
  const [timer, setTimer] = useState(() => timerInitialState);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTimer((oldTimer) => {
        const totalElapsedMillis = oldTimer.paused
          ? oldTimer.totalElapsedMillis
          : oldTimer.millisPreCurrentEpoch + now - oldTimer.currentEpochStart;
        const splits = [...oldTimer.splits];
        const lappedMillis = splits.reduce(
          (curr, prev) => curr + prev.millis,
          0
        );
        if (splits.length > 0 && !oldTimer.paused)
          splits[0] = {
            name: splits[0].name,
            millis: splits[0].millis + totalElapsedMillis - lappedMillis,
          };
        return {
          ...oldTimer,
          totalElapsedMillis,
          splits: splits,
        };
      });
    }, 10);
    return () => clearInterval(interval);
  }, [timer]);

  const start = () => {
    const laps = [...timer.splits];
    if (laps.length === 0) laps.push({ name: "Split 1", millis: 0 });
    setTimer((oldTimer) => ({
      ...oldTimer,
      splits: laps,
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

  const newSplit = () => {
    setTimer((oldTimer) => ({
      ...oldTimer,
      splits: [
        { name: `Split ${oldTimer.splits.length + 1}`, millis: 0 },
        ...oldTimer.splits,
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

  const deleteSplit = (index: number) => {
    Alert.alert("Warning", "Are you sure you want to delete this split?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => console.log("should delete split"),
        style: "destructive",
      },
    ]);
  };

  const editSplit = (index: number) => {
    console.log(index);
  };

  const renameSplit = (index: number) => {
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
              const laps = [...timer.splits];
              laps[index] = { ...laps[index], name };
              return {
                ...oldTimer,
                splits: laps,
              };
            }),
        },
      ],
      "plain-text",
      timer.splits[index].name
    );
  };

  return (
    <View style={styles.container}>
      <TotalTimeTitle totalMillis={timer.totalElapsedMillis}></TotalTimeTitle>
      <View style={styles.buttonContainer}>
        <Pressable onPress={reset} disabled={timer.splits.length === 0}>
          <Text style={styles.button}>Reset</Text>
        </Pressable>
        <Pressable onPress={newSplit}>
          <Text style={styles.button}>Split</Text>
        </Pressable>
        <Pressable onPress={timer.paused ? start : pause}>
          <Text style={styles.button}>
            {!timer.paused
              ? "Pause"
              : timer.totalElapsedMillis === 0
              ? "Start"
              : "Unpause"}
          </Text>
        </Pressable>
      </View>
      <FlatList
        style={styles.timeList}
        extraData={timer.splits}
        data={timer.splits}
        renderItem={({ item, index }) => (
          <LapTime
            name={item.name}
            millis={item.millis}
            onEdit={() => editSplit(index)}
            onRename={() => renameSplit(index)}
            onDelete={() => deleteSplit(index)}
          ></LapTime>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: AppStyles.background,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 50,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: 100,
    textAlign: "center",
    color: "white",
    padding: 10,
    fontSize: 20,
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
