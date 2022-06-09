import {Moment} from "moment";

export interface TravelConfig
{
    label: string;
    start: Moment;
    maxDrivingTime: number;
}