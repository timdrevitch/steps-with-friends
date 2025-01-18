import { Text, View } from "@/components/Themed";
import "./Value.scss";

type ValueProps = {
  label: string;
  value: string;
};

const Value = ({ label, value }: ValueProps) => {
  return (
    <View id="value-component">
      <Text className="label">{label}</Text>
      <Text className="value">{value}</Text>
    </View>
  );
};

export default Value;
