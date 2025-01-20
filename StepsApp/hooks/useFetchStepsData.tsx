import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from "react-native-health";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
      // AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [],
  },
};

const useHealthData = (date: Date) => {
  const [hasPermissions, setHasPermission] = useState<boolean>(false);

  // State variables
  const [steps, setSteps] = useState<number>(0);
  const [flights, setFlights] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0); // Active Energy Burned
  const [heartRate, setHeartRate] = useState<number>(0); // Average Heart Rate
  // const [workoutDuration, setWorkoutDuration] = useState(0); // Workout Duration in minutes

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== "ios") return;

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log("Error checking availability:", err);
        return;
      }
      if (!isAvailable) {
        console.log("Apple Health not available");
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log("Error getting permissions:", err);
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) return;

    // Get the start of the day (midnight) for the provided `date`
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight of the current day
    const endOfDay = new Date(date); // The current moment (end of the day)
    endOfDay.setHours(23, 59, 59, 999); // Set to just before midnight of the next day

    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: false,
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      ascending: false, // Fetch most recent first
      limit: 1000, // Limit to a reasonable number of records
    };

    // Fetch Steps
    AppleHealthKit.getStepCount(options, (err, results) => {
      if (!err) setSteps(results.value);
    });

    // Fetch Flights Climbed
    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (!err) setFlights(Math.floor(results.value)); // Rounded down
    });

    // Fetch Distance
    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (!err) setDistance(results.value);
    });

    // Fetch Active Energy Burned (Calories)
    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
      if (!err && Array.isArray(results)) {
        const totalCalories = results.reduce(
          (sum, record) => sum + Math.floor(record.value || 0),
          0,
        );
        setCalories(totalCalories);
      }
    });

    // Fetch Average Heart Rate
    AppleHealthKit.getHeartRateSamples(options, (err, results) => {
      if (!err && Array.isArray(results) && results.length > 0) {
        const avgHeartRate =
          results.reduce((sum, record) => sum + (record.value || 0), 0) /
          results.length;
        setHeartRate(Math.round(avgHeartRate));
      }
    });

    // Fetch Workout Duration
    //   AppleHealthKit.getWorkouts(options, (err, results) => {
    //     if (!err && results.length > 0) {
    //       const totalDuration = results.reduce(
    //         (sum, workout) => sum + workout.duration,
    //         0,
    //       );
    //       setWorkoutDuration(Math.round(totalDuration / 60)); // Convert seconds to minutes
    //     }
    //   });
  }, [hasPermissions, date]);

  // Android - Health Connect
  const readSampleData = async () => {
    const isInitialized = await initialize();
    if (!isInitialized) return;

    await requestPermission([
      { accessType: "read", recordType: "Steps" },
      { accessType: "read", recordType: "Distance" },
      { accessType: "read", recordType: "FloorsClimbed" },
      { accessType: "read", recordType: "ActiveCaloriesBurned" },
      { accessType: "read", recordType: "HeartRate" },
      { accessType: "read", recordType: "ExerciseSession" },
    ]);

    const timeRangeFilter: TimeRangeFilter = {
      operator: "between",
      startTime: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    };

    // Fetch Steps
    const stepsData = await readRecords("Steps", { timeRangeFilter });
    setSteps(
      stepsData.records.reduce((sum, record) => sum + (record.count || 0), 0),
    );

    // Fetch Distance
    const distanceData = await readRecords("Distance", { timeRangeFilter });
    setDistance(
      distanceData.records.reduce(
        (sum, record) => sum + (record.distance?.inMeters || 0),
        0,
      ),
    );

    // Fetch Floors Climbed
    const floorsData = await readRecords("FloorsClimbed", { timeRangeFilter });
    setFlights(
      floorsData.records.reduce(
        (sum, record) => sum + Math.floor(record.floors || 0),
        0,
      ),
    );

    // Fetch Active Energy Burned (Calories)
    const caloriesData = await readRecords("ActiveCaloriesBurned", {
      timeRangeFilter,
    });
    setCalories(
      caloriesData.records.reduce(
        (sum, record) => sum + Math.floor(record.energy?.inKilocalories || 0),
        0,
      ),
    );

    // Fetch Heart Rate
    // const heartRateData = await readRecords("HeartRate", { timeRangeFilter });
    // console.log("hello" + heartRateData.records);
    // if (heartRateData.records.length > 0) {
    //   const avgHeartRate =
    //     heartRateData.records.reduce(
    //       (sum, record) => sum + (record.value || 0),
    //       0,
    //     ) / heartRateData.records.length;
    //   setHeartRate(Math.round(avgHeartRate));
    // }

    // Fetch Workout Duration
    // const exerciseData = await readRecords("ExerciseSession", { timeRangeFilter });
    // const totalDuration = exerciseData.records.reduce(
    //   (sum, record) => sum + (record.durationTotal || 0),
    //   0
    // );
    // setWorkoutDuration(Math.round(totalDuration / 60)); // Convert seconds to minutes
  };

  useEffect(() => {
    if (Platform.OS !== "android") return;
    readSampleData();
  }, [date]);

  return {
    steps,
    flights,
    distance,
    calories,
    heartRate,
    // workoutDuration,
  };
};

export default useHealthData;
