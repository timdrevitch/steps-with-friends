import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import "./home.scss";
import Value from "@/components/Value";
import useHealthData from "@/hooks/useFetchStepsData";
import { useState } from "react";

type HomeScreenProps = {};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance } = useHealthData(date);
  return (
    <View id="home-page" className="container">
      <Text className="title">Today</Text>
      <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View className="values">
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" value={flights.toString()} />
      </View>
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
    </View>
  );
};

export default HomeScreen;
