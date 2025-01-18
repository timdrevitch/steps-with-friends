import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import "./tabFour.scss";

type TabFourScreenProps = {};

const TabFourScreen: React.FC<TabFourScreenProps> = () => {
  return (
    <View id="tab-four-page" className="container">
      <Text className="title">Tab Four</Text>
      <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/tabFour.tsx" />
    </View>
  );
};

export default TabFourScreen;
