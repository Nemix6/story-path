import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Appearance, SafeAreaView, Text } from 'react-native';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { addTracking, getLocations, getTrackings } from '@/api/api';
import { useUser } from './UserContext';
import { usePoints } from './PointsContext';
import React from 'react';

const colorScheme = Appearance.getColorScheme();

export interface NearbyLocationProp {
    location_id: number;
    project_id: number;
    location_name: string;
    distance: {
        metres: number;
        nearby: boolean;
    }
}

export interface LocationProp {
    latitude: number;
    longitude: number;
}

export interface LocationApi {
    location_name: string;
    location_trigger: string;
    location_position: string;
    score_points: number;
    clue: string;
    location_content: string;
    location_order: number;
    id: number;
    project_id: number;
    username: string;
    extra: string;
}

export interface LocationData {
    location_id: number;
    project_id: number;
    location_name: string;
    score_points: number;
    coordinates: LocationProp;
}

export interface TrackingApi {
    id?: number;
    project_id: number;
    location_id: number;
    username?: string;
    points: number;
    participant_username: string;
}

// component for displaying nearest locations and wether its within 100m
const NearbyLocations = (props : NearbyLocationProp) => {
    if (typeof props.location_name != "undefined") {
        return (
            <SafeAreaView style={styles.nearbyLocationSafeAreaView}>
                <View style={styles.nearbyLocationView}>
                    <Text style={styles.nearbyLocationText}>
                        {`You have visited ${props.location_name}!`}
                    </Text>
                    {props.distance.nearby &&
                        <Text style={{
                            ...styles.nearbyLocationText,
                            fontWeight: "bold"
                        }}>
                            Within 100 Metres!
                        </Text>
                    }
                </View>
            </SafeAreaView>
        );
    } else {
        // console.log("props.location is undefined");
    }
}

const ShowMap = () => {
    const { projectID, username } = useUser();
    const { setPoints, points } = usePoints();
    // const [locations, setLocations] = useState<LocationData[]>([]);

    // console.log(locations);
    // setup state for map data
    const initialMapState = {
        locationPermission: false,
        locations: [] as LocationData[],
        userLocation: {
            latitude: -27.5263381,
            longitude: 153.0954163,
            // Starts at "Indooroopilly Shopping Centre"
        },
        nearbyLocation : null as NearbyLocationProp | null,
        unlockedLocations: [] as LocationData[],
        isLoading: true,
    }
    
    const [ mapState, setMapState ] = useState(initialMapState);

    useEffect(() => {
        const fetchLocations = async() => {
            const locations = await getLocations(projectID) as LocationApi[];
            const updatedLocations: LocationData[] = locations.map(location => {
                const coordinates = location.location_position.split(",");
                return {
                    location_id : location.id,
                    project_id : location.project_id,
                    location_name: location.location_name,
                    score_points: location.score_points,
                    coordinates: {
                        latitude: parseFloat(coordinates[0].split(("("))[1]), // remove the bracket
                        longitude: parseFloat(coordinates[1].split(")")[0]) // remove the bracket
                    }
                }
            });
            const trackings = await getTrackings(projectID, username) as TrackingApi[];
            const unlockedLocations = updatedLocations.filter(location => {
                return trackings.some(tracking => tracking.location_id === location.location_id);
            });
            // console.log("Unlocked Locations: ", unlockedLocations);
            setMapState(prevState => ({
                ...prevState,
                locations: updatedLocations,
                unlockedLocations: unlockedLocations,
                isLoading: false
            }));
        }
        fetchLocations();
    }, [projectID, points]);

    useEffect(() => {
        const requestLocationPermission = async() => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setMapState(prevState => ({
                    ...prevState,
                    locationPermission: true,
                }));
            }
        }
        requestLocationPermission();
    }, []);


    const calculateDistance = (userLocation : LocationProp) => {
        // console.log(mapState.unlockedLocations);
        const nearestLocations: NearbyLocationProp[] = mapState.locations.map(location => {
            let metres: number = 0;

            metres = getDistance(userLocation, location.coordinates!);
            
            return {
                location_id: location.location_id,
                project_id: location.project_id,
                location_name: location.location_name,
                distance: {
                    metres: metres,
                    nearby: metres <= 100
                }
            }
        }).sort((prevLoc, thisLoc) => {
            return prevLoc.distance!.metres - thisLoc.distance!.metres;
        });
        return nearestLocations.shift();
    }

    useEffect(() => {
        // console.log(mapState.unlockedLocations);
        let locationSubscription: Location.LocationSubscription | null = null;
        // YEAH DONT KNOW WHHAT TO DO IF TWO LOCATIONS OVERLAP EACH OTHER. SINCE CURRENT FUNCTION FINDS NEAREST LOCATION, SO IF AN UNLOCKED LOCATION IS CLOSER, THEN THE OTHER LOCATION WILL NOT BE UNLOCKED
        if (mapState.locationPermission) {
            (async() => {
                locationSubscription = await Location.watchPositionAsync({
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10 // in metres
            },
            async location => {
                const userLocation = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                };
                const nearbyLocation = calculateDistance(userLocation);
                
                if (nearbyLocation) {
                    const location = mapState.locations.find(location => location.location_id === nearbyLocation.location_id);
                    setMapState(prevState => {
                        const alreadyUnlocked = prevState.unlockedLocations.some(unlockedLocation => unlockedLocation.location_id === nearbyLocation.location_id);

                        if (location && !alreadyUnlocked) {
                            const updatedUnlockedLocations = [...prevState.unlockedLocations, location];

                            const trackingInfo: TrackingApi = {
                                project_id: location!.project_id,
                                location_id: location!.location_id,
                                points: location!.score_points,
                                participant_username: username
                            };
                            addTracking(trackingInfo); 
                            setPoints(points + location.score_points);
                            return {
                                ...prevState,
                                userLocation,
                                nearbyLocation: nearbyLocation ? nearbyLocation : null,
                                unlockedLocations : updatedUnlockedLocations,
                            };
                        }
                    return {
                        ...prevState,
                        userLocation,
                        nearbyLocation: nearbyLocation ? nearbyLocation : null
                    };
                    });
                }
            }
        );
        })();
        }
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        }
    }, [mapState.locationPermission, mapState.isLoading]);

    if (mapState.isLoading && mapState.nearbyLocation === null) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }
    return (
        <>
            <MapView
                camera={{
                    center: mapState.userLocation,
                    pitch: 0, // Angle of 3D map
                    heading: 0, // Compass direction
                    altitude: 3000, // Zoom level for iOS
                    zoom: 15 // Zoom level For Android
                }}
                showsUserLocation={mapState.locationPermission}
                style={styles.container}
            >
                {mapState.unlockedLocations && mapState.unlockedLocations.map(location => (
                    <React.Fragment key={`fragment-${location.location_id}`}>
                    <Circle
                        key={`circle-${location.location_id}`}
                        center={location.coordinates}
                        radius={100}
                        strokeWidth={3}
                        strokeColor="#A42DE8"
                        fillColor={colorScheme == "dark" ? "rgba(128,0,128,0.5)" : "rgba(210,169,210,0.5)"}
                    />
                    <Marker
                        key={`marker-${location.location_id}`}
                        coordinate={location.coordinates}
                    >
                        <Callout>
                            <View>
                                <Text>{location.location_name}</Text>
                                <Text>Score Points: {location.score_points}</Text>
                            </View>
                        </Callout>
                    </Marker>
                </React.Fragment>
                ))}
            </MapView>
            {mapState.nearbyLocation && (
                <NearbyLocations
                    {...mapState.nearbyLocation}
                />
            )}
        </>
    );
}

export default ShowMap;

const styles = StyleSheet.create({
      container: {
            width: "100%",
            height: "80%",
      },
      nearbyLocationSafeAreaView: {
          backgroundColor: "black",
      },
      nearbyLocationView: {
          padding: 20,
      },
      nearbyLocationText: {
          color: "white",
          lineHeight: 25
      }
  });