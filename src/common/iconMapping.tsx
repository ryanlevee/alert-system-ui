import { IconType } from "react-icons/lib";
import * as i from "../static/icons";

const ico = {
    "Civil Unrest": i.FaPeopleCarryBox,
    "Public Disturbance": i.FaPeopleRobbery,
    "Suspicious Activity": i.PiDetectiveFill,
    "Traffic Accident": i.FaCarSide,
    "Chemical Spill": i.PiRadioactiveFill,
    "Elevated Threat Level": i.FaArrowCircleUp,

    Wildfire: i.FaFireAlt,
    Flood: i.FaHouseFloodWater,
    Rainfall: i.FaCloudShowersHeavy,
    Mudslide: i.FaHillRockslide,
    Debris: i.FaRoadBarrier,
    Heatwave: i.PiThermometerHotFill,
    Fog: i.PiCloudWarningFill,
    Runoff: i.FaHillAvalanche,
    Hurricane: i.FaHurricane,

    Airport: i.FaPlaneCircleExclamation,
    Utilities: i.FaBoltLightning,
    Transit: i.FaBusAlt,
    Telecommunications: i.FaPhoneFlip,

    Aliens: i.PiAlienFill,
    Earthquake: i.FaBuildingCircleExclamation,
    Storm: i.FaPooStorm,
    Tornado: i.FaTornado,

    Safety: i.FaClinicMedical,
    Weather: i.FaCloudRain,
    Operations: i.FaLightbulb,
    Disaster: i.FaMeteor,

    Favorite: i.FaRegStar,
} as { [key: string]: IconType };

export default ico;
