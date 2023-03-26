import React, { useRef } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import AppStyles from "../../Style";
import { formatTimestamp } from "../utils/format-time";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Ionicons from "@expo/vector-icons/Ionicons";

type LapTimeProps = {
  name: string;
  millis: number;
  onEdit: () => void;
  onDelete: () => void;
  onRename: () => void;
};

const LapTime = (props: LapTimeProps) => {
  const swipeableRef = useRef(null);

  const renderRightActions = () => {
    return (
      <View
        style={{
          margin: 0,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{ paddingHorizontal: 15 }}
          onPress={() => {
            props.onDelete();
            swipeableRef.current.close();
          }}
        >
          <Ionicons name="trash" size={21} color={AppStyles.primary} />
        </Pressable>

        {/* <Button
          onPress={() => {
            props.onEdit();
            swipeableRef.current.close();
          }}
          title="edit time"
        ></Button> */}
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View
        style={{
          margin: 0,
          alignContent: "center",
          justifyContent: "center",
          width: 100,
        }}
      >
        <Button
          onPress={() => {
            props.onRename();
            swipeableRef.current.close();
          }}
          title="Rename"
        ></Button>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.item}>{props.name}</Text>
        <Text style={styles.item}>{formatTimestamp(props.millis)}</Text>
      </View>
    </Swipeable>
  );
};

export default LapTime;

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    paddingHorizontal: 8,
    paddingVertical: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: AppStyles.tertiary,
    backgroundColor: AppStyles.background,
  },
  item: {
    fontVariant: ["tabular-nums"],
    fontSize: 17,
    fontWeight: "400",
    color: AppStyles.primaryText,
  },
});
