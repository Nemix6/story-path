import { createContext, useContext, useState } from "react";

const PointsContext = createContext({
    points: 0,
    setPoints: (points: number) => {}
});

export const PointsProvider = (props : any) => {
    const [points, setPoints] = useState<number>(0);

    return (
        <PointsContext.Provider value={{ points, setPoints }}>
            {props.children}
        </PointsContext.Provider>
    )
}

export const usePoints = () => useContext(PointsContext);