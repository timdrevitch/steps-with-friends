import { useState, useCallback, useEffect, useRef } from "react";
import { Text, View, useThemeColor } from "../../components/Themed";
import Value from "../../components/Value";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import useHealthData from "../../hooks/useFetchStepsData";

type HomeScreenProps = {};

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [stepChange, setStepChange] = useState<number | null>(null);
  const previousSteps = useRef<number>(0);

  const yesterday: Date = new Date();
  yesterday.setDate(date.getDate() - 1);

  const {
    steps: stepsYesterday,
    flights: flightsYesterday,
    distance: distanceYesterday,
    calories: caloriesYesterday,
    heartRate: heartRateYesterday,
  } = useHealthData(yesterday);
  const { steps, flights, distance, calories, heartRate } = useHealthData(date);

  // Use the theme colors for text and background
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const titleColor = useThemeColor({}, "text");

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    setTimeout(() => {
      const change = steps - previousSteps.current;

      if (change > 0) {
        setStepChange(change); // Save the increase
        previousSteps.current = steps; // Update the previous steps value
      } else {
        setStepChange(null); // Reset if no increase
      }

      // Refresh date to trigger new data fetch
      setDate(new Date());
    }, 1000);

    // Simulate a network request or async operation
    setTimeout(() => {
      setIsRefreshing(false); // Stop refreshing
    }, 1500);
  }, [steps]);

  useEffect(() => {
    // Whenever the date is updated (e.g. from pull-to-refresh)
    // Trigger the useHealthData hook to re-fetch both today's and yesterday's data
  }, [date]);

  useEffect(() => {
    if (steps > previousSteps.current) {
      const change = steps - previousSteps.current;
      setStepChange(change);
      previousSteps.current = steps; // Update previousSteps
    } else if (steps === previousSteps.current) {
      setStepChange(null); // Reset stepChange if no change
    }
  }, [steps]);

  return (
    <ScrollView
      id="home-page"
      contentContainerStyle={[styles.container, { backgroundColor }]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh} // Set the refresh handler
          tintColor={textColor} // Customize the loading spinner color
        />
      }
    >
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>Today</Text>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Value
            label="Steps:"
            value={steps.toString()}
            change={stepChange ? stepChange.toString() : null}
          />
          {/* {stepChange && <Text style={styles.changeText}>+{stepChange}</Text>} */}
          <Value
            label="Distance:"
            value={`${(distance / 1000).toFixed(2)} km`}
          />
          <Value label="Floors Climbed:" value={flights.toString()} />
          <Value label="Active Calories Burned:" value={calories.toString()} />
          <Value label="Average Heart Rate:" value={heartRate.toString()} />
        </View>
      </View>
      <View style={styles.group}>
        <Text style={[styles.title, { color: titleColor }]}>Yesterday</Text>
        <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
          <Value label="Steps:" value={stepsYesterday.toString()} />
          <Value
            label="Distance:"
            value={`${(distanceYesterday / 1000).toFixed(2)} km`}
          />
          <Value label="Floors Climbed:" value={flightsYesterday.toString()} />
          <Value
            label="Active Calories Burned:"
            value={caloriesYesterday.toString()}
          />
          <Value
            label="Average Heart Rate:"
            value={heartRateYesterday.toString()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexGrow: 1,
    justifyContent: "center",
    padding: 12,
  },
  group: {
    marginBottom: 20, // Space between the "Yesterday" and "Today" sections
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    borderRadius: 10, // Rounded corners for the card
    padding: 15, // Adjusted padding inside the card
    marginTop: 10, // Space between the title and the card
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Vertical shadow offset
    shadowOpacity: 0.1, // Transparency of the shadow
    shadowRadius: 4, // Blur of the shadow
    elevation: 5, // Shadow for Android (elevation)
    borderWidth: 1, // Border width for the card
    borderColor: "gray", // Border color for the card
  },
  values: {
    flexDirection: "row",
    gap: 25,
    flexWrap: "wrap",
    marginTop: 20, // Adjusted margin between items in the card
  },
  datePicker: {
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  date: {
    fontWeight: "500",
    fontSize: 20,
    marginHorizontal: 20,
  },
  changeText: {
    color: "green",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;
