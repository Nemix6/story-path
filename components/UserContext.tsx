import React, { createContext, useState, useContext } from 'react';

interface PhotoState {
    uri?: string;
}

const UserContext = createContext({
    username: "no user",
    setUsername: (username: string) => {},
    photoState: {} as PhotoState,
    setPhotoState: (photoState: PhotoState) => {},
    projectID: null as string | null,
    setProjectID: (projectID: string | null) => {}

});

export const UserProvider = (props : any) => {
    const [username, setUsername] = useState("no user");
    const [photoState, setPhotoState] = useState<PhotoState>({});
    const [projectID, setProjectID] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ username, setUsername, photoState, setPhotoState, projectID, setProjectID }}>
            {props.children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);