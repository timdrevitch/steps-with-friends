// import EditScreenInfo from "@/components/EditScreenInfo";
// import { Text, View } from "@/components/Themed";
import EditScreenInfo from "../../components/EditScreenInfo";
import "./tabThree.scss";
import { Text, View } from "../../components/Themed";

type TabThreeScreenProps = {};

const TabThreeScreen: React.FC<TabThreeScreenProps> = () => {
  return (
    <View id="tab-three-page" className="container">
      <Text className="title">Tab Three</Text>
      <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/tabThree.tsx" />
    </View>
  );
};

export default TabThreeScreen;
