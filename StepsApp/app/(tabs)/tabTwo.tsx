import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import "./tabTwo.scss";

type TabTwoScreenProps = {};

const TabTwoScreen: React.FC<TabTwoScreenProps> = () => {
  return (
    <View id="tab-two-page" className="container">
      <Text className="title">Tab Two</Text>
      <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/tabTwo.tsx" />
    </View>
  );
};

export default TabTwoScreen;
