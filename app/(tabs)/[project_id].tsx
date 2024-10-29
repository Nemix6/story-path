import { View, Text, StyleSheet } from "react-native"
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getProject, getLocations, getTrackings } from "@/api/api";
import { ProjectProps } from "../projectLists";
import { useUser } from "@/components/UserContext";
import { TrackingApi } from "../../components/ShowMap";
import { usePoints } from "@/components/PointsContext";

// an interface to define the structure of a location.
export interface LocationApi {
    location_name: string;
    location_trigger: string;
    location_position: string;
    score_points: number;
    clue: string;
    location_content: string;
    location_order: number;
    id: number;
}

const Project = () => {
    const { points, setPoints } = usePoints();
    const { setProjectID, username } = useUser();
    const { project_id } : {project_id : string} = useLocalSearchParams();
    const [project, setProject] = useState<ProjectProps>();
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [locationsVisited, setLocationsVisited] = useState<number>(0);
    const [locations, setLocations] = useState<LocationApi[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        if (project_id) {
            const fetchProject = async () => {
                try {
                    const project = await getProject(project_id) as ProjectProps;
                    setProject(project);

                    const locations = await getLocations(project_id) as LocationApi[];
                    // console.log(locations);
                    // console.log(locations.length);
                    let orderedLocations = locations.slice().sort((a: LocationApi, b: LocationApi) => a.location_order - b.location_order);
                    setLocations(orderedLocations);
                    setTotalPoints(orderedLocations.reduce((acc: number, loc: LocationApi) => acc + loc.score_points, 0));
                    setProjectID(project_id);
                    setLoading(false);

                    const visitedLocations = await getTrackings(project_id, username) as TrackingApi[];
                    // console.log(visitedLocations);
                    const points = visitedLocations.reduce((acc: number, loc: TrackingApi) => acc + loc.points, 0);
                    setLocationsVisited(visitedLocations.length);
                    setPoints(points);

                } catch (error) {
                console.log(error);
                }
            };
            fetchProject();
        }
    }, [project_id, points]);

    

    return (
        <View>
            {/* Make the header banner */}
            <View style={styles.header_container}>
                <View style={styles.text_container}>
                    <Text style={styles.header_text}>{project?.title}</Text>
                </View>
            </View>
            {/* GAME CONTAINER */}
            {loading ? <Text style={styles.loading_text}>Loading...</Text> : locations.length == 0 ? <Text style={styles.error_text}>This project has no locations :(</Text> :
            <View style={styles.game_container}>
                <Text style={styles.header2_text}>Instructions</Text>
                <Text style={styles.text}>{project?.instructions}</Text>
                <Text style={styles.header2_text}>Initial Clue</Text>
                <Text style={styles.text}>{project?.initial_clue}</Text>

                <View style={styles.scores_container}>
                    <View style={styles.button_container}>
                        <Text style={styles.button_text}>Points</Text>
                        <Text style={styles.button_text}>{points} / {totalPoints}</Text>
                    </View>
                    <View style={styles.button_container}>
                        <Text style={styles.button_text}>Locations Visited</Text>
                        <Text style={styles.button_text}>{locationsVisited} / {locations.length}</Text>
                    </View>
                </View>
            </View>
            }
        </View>
    )
}

export default Project;


const styles = StyleSheet.create({
    header_container: {
        backgroundColor: "#fc6f03",
        height: 100,
        justifyContent: "center",
    },

    text_container: {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        alignItems: "center",
    },

    game_container: {
        // controls the distance of container to the edge of the screen
        marginHorizontal: 10,
        // controls the distance of text to the edge of the container
        paddingHorizontal: 25,
        marginTop: 20,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#afbab2",
    },

    header_text: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
    },

    header2_text: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,  
    },

    error_text: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,  
        color: "red",
        paddingHorizontal: 20,
    },

    loading_text : {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: "black",
        paddingHorizontal: 20,
    },

    text : {
        marginTop: 5,
    },

    scores_container: {
        marginTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#afbab2",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    button_container : {
        backgroundColor: "#fc6f03",
        borderRadius: 10,
        alignItems: "center",
        width: 150,
        paddingVertical: 10,

    },

    button_text : {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        paddingVertical: 5,
        
    },
});

