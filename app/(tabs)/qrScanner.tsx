import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/components/UserContext';
import { addTracking, getLocations, getProject, getTrackings } from '@/api/api';
import { LocationData, TrackingApi } from '@/components/ShowMap';
import { LocationApi } from './[project_id]';
import { usePoints } from '@/components/PointsContext';


const QRscanner = () => {
  const { projectID, username } = useUser();
  const { points, setPoints } = usePoints();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [locations, setLocations] = useState<LocationApi[]>([]);
  const [unlockedLocations, setUnlockedLocations] = useState<LocationApi[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocations(projectID) as LocationApi[];
      const trackings = await getTrackings(projectID, username) as TrackingApi[];
      const unlockedLocations = locations.filter((location) => trackings.some((tracking) => tracking.location_id === location.id));
      setUnlockedLocations(unlockedLocations);
      setLocations(locations);
    }
    fetchLocations(); 
  }, [points]);
  // CHANGED BEFORE TESTING, IF FAIL, REMOVE POINTS

  useEffect(() => {
    const handleTracking = async () => {
      try {
      const parsedData = scannedData.split('-');
      const location_id = parseInt(parsedData[2]);
      const project_id = parsedData[1];
      const location = locations.find((location) => location.id === location_id);

      if (location) {
          const alreadyUnlocked = unlockedLocations.some((unlockedLocation) => unlockedLocation.id === location.id);
          console.log(alreadyUnlocked);
          if (!alreadyUnlocked) {
            const trackingData: TrackingApi = {
              location_id: location.id,
              project_id: parseInt(projectID!),
              participant_username: username,
              points: location.score_points,
            }
            console.log("Adding tracking");
            await addTracking(trackingData);
            setPoints(points + location.score_points);
            setScannedData(`You have unlocked ${location.location_name} and earned ${location.score_points} points!`);
            setUnlockedLocations([...unlockedLocations, location]);
          } 
        } else {
          const project = await getProject(project_id);
          if (project) {
            setScannedData("The location you're trying to access does not belong to this project");
          }
        }
      } catch (error) {
        setScannedData("The scanned QR code is not recognized. This is not a valid location.");
    }
  }
    if (scannedData) {
      handleTracking();
    }
  }, [scannedData, scanned]);


  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async({ type, data } : {type : any, data : any}) => {
    setScanned(true);
    setScannedData(data);
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >

      </CameraView>
      {scanned && (
        <View style={styles.scanResultContainer}>

          <Text style={styles.scanResultText}>{scannedData}</Text>
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scanResultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
  },
  scanResultText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRscanner;