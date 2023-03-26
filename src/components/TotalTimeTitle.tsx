import React, { useRef, useState } from "react";
import { StyleSheet, Animated } from "react-native";
import AppStyles from "../../Style";
import { formatTimestamp } from "../utils/format-time";

const TotalTimeTitle = (props: { totalMillis: number }) => {
  const millis = props.totalMillis;

  const scaleAnimation = useRef(
    new Animated.Value(
      Math.min(
        2,
        Math.max(2 / (1 + 0.15 * (formatTimestamp(millis).length - 4)), 0.7)
      )
    )
  ).current;
  const [scale, setScale] = useState(
    Math.min(
      2,
      Math.max(2 / (1 + 0.15 * (formatTimestamp(millis).length - 4)), 0.7)
    )
  );

  const timestamp = formatTimestamp(millis);
  const nextScale = Math.min(
    2,
    Math.max(2 / (1 + 0.15 * (formatTimestamp(millis + 2000).length - 4)), 0.7)
  );

  if (scale != nextScale) {
    setScale(nextScale);
    Animated.timing(scaleAnimation, {
      toValue: nextScale,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.Text
      style={[
        styles.title,
        {
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      {timestamp}
    </Animated.Text>
  );
};

export default TotalTimeTitle;

const styles = StyleSheet.create({
  title: {
    fontVariant: ["tabular-nums"],
    fontWeight: "200",
    color: AppStyles.primaryText,
    fontSize: 60,
    paddingVertical: 50,
  },
});
