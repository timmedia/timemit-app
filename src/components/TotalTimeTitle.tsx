import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import AppStyles from "../../Style";
import { formatTimestamp } from "../utils/format-time";

const TotalTimeTitle = (props: { totalMillis: number }) => {
  return <Text style={styles.title}>{formatTimestamp(props.totalMillis)}</Text>;
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
