export interface MapboxRoute {
    code: string;
    routes: {
        country_crossed: boolean,
        distance: number,
        duration: number,
        geometry: {coordinates: any, type: string},
        legs: any[],
        weight: number,
        weight_name: string;
    }[],
    uuid: string;
    waypoints: any[];
}
