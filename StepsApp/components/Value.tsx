import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import "./Value.scss";

type ValueProps = {
  label: string;
  value: string;
  change?: string | null;
};

const Value = ({ label, value, change }: ValueProps) => (
  <View id="value-component">
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {value}
      {change && <Text style={styles.changeText}>+{change}</Text>}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  label: {
    color: "white",
    fontSize: 12,
  },
  value: {
    fontSize: 25,
    color: "#AFB3BE",
    fontWeight: "500",
    marginBottom: 5,
  },
  changeText: {
    color: "green",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Value;
