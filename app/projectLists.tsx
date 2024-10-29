import { useUser } from "@/components/UserContext";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Dimensions } from "react-native"
import { useEffect, useState } from "react";
import { FlatList } from "react-native"
import { router } from "expo-router";
import {getLocations, getPublishedProjects, getProjectParticipantCount} from "@/api/api";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


export interface ProjectProps {
    title: string;
    description: string;
    participant_scoring: string;
    instructions: string;
    initial_clue: string;
    homescreen_display: string;
    is_published: boolean;
    id: number;
}

export interface ProjectParticipantCount {
    project_id: number;
    number_participants: number;
}

interface participantDict {
    [key: number]: number;
}

const { height, width } = Dimensions.get("window");

// const projects1: ProjectProps[] = [
//     {id : "1", name: "Project 1", description: "This is project 1", published: true},
//     {id : "2", name: "Project 2", description: "This is project 2", published: true},
// ];

const ProjectLists = () => {
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [participantCountList, setParticipantCountList] = useState<participantDict>({});

    useEffect(() => {
        async function fetchProjects() {
            const projects = await getPublishedProjects();
            // console.log(projects);
            setProjects(projects);
            setLoading(false);
        }
        fetchProjects();
    }, []);

    useEffect(() => {
        const getParticipantCount = async () => {
            // get the number of participants for each project
            const promises = await Promise.all(projects.map(async (project) => {
                const obj = await getProjectParticipantCount(project.id) as ProjectParticipantCount;

                if (obj === undefined) {
                    return {project_id: project.id, number_participants: 0};
                }
                return obj;
            }));

            // add the project id and number of participants to a dictionary
            let dict: participantDict = {};
            promises.forEach((obj) => {
                dict[obj.project_id] = obj.number_participants;
            });
            setParticipantCountList(dict);
            };
        getParticipantCount();
    }, [projects, loading]);


    return (
        <View>
            <View style={styles.header_container}>
                <View style={styles.container}>
                    <AntDesign name="sharealt" size={65} color="#fc6f03"/>
                    <Text style={styles.header_text}>Projects</Text>
                </View>
            </View>

            <View style={styles.list_container}>
                {loading ? <Text style={styles.loading_text}>Loading...</Text> : projects.length == 0 ? <Text style={styles.error_text}>No projects available :(</Text> :
                <FlatList
                    data={projects}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item_container}>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push(`/(tabs)/${item.id}`);
                                    // router.push({
                                    //     pathname: "/(projects)/[project_id]",
                                    //     params: { project_id: item.id },
                                    // });
                                }}
                                style={styles.touchable}
                            >
                            <View style={styles.text_container}>
                                <Text style={styles.text}>{item.title}</Text>
                                <View style={styles.badge}><Text style={styles.badge_text}>Participants: {participantCountList[item.id]}</Text></View>
                            </View>
                            <AntDesign name="right" size={32} color="#fc6f03"/>
                            </TouchableOpacity>
                        </View>
                    )}>
                </FlatList>
                }
            </View>
        </View>
      );
}

export default ProjectLists;


const styles = StyleSheet.create({
    container : {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: "center",
    },

    header_container : {
        paddingBottom: 20,
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "lightgrey",
    },

    header_text : {
        color: "#fc6f03",
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 10,
    },

    text : {
        fontSize: 16,
        color: "black",
    },

    list_container : {
        marginHorizontal: 10,
        paddingHorizontal: 25,
        marginTop: 20,
        // backgroundColor: "white",
        // borderRadius: 10,
        // borderWidth: 1,
        // borderColor: "#afbab2",
        maxHeight: height / 1.7,
            // add shadow to make it stand out
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.45,
    },

    item_container : {
        marginVertical: 15,
        borderWidth: 1,
        padding: 15,
        borderColor: "#afbab2",
        borderRadius: 10,
        backgroundColor: "white",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        
    },

    touchable : {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    badge : {
        backgroundColor: '#fc6f03', // Badge background color
        borderRadius: 10,
        // controls the width and height of the badge
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,

    },

    badge_text : {
        color: 'white',
    },

    text_container : {
        // aligns items horizontally
        flexDirection: "row",
        alignItems: "center",
        
    },

    loading_text : {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,  
        paddingHorizontal: 20,
    },

    error_text: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,  
        color: "red",
        paddingHorizontal: 20,
    },

});

