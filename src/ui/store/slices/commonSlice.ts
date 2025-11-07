import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// QR Code capacity table based on error correction level and version
const QR_CAPACITY = {
    // Numeric mode capacity for each version (1-40) by error correction level
    numeric: {
        L: [
            41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158,
            4417, 4686, 4965, 5253, 5529, 5836, 6153, 6479, 6743, 7089,
        ],
        M: [
            34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486,
            3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596,
        ],
        Q: [
            27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473,
            2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993,
        ],
        H: [
            17, 34, 55, 78, 102, 128, 158, 194, 232, 274, 324, 370, 428, 461, 523, 589, 647, 721, 795, 861, 932, 1006, 1094, 1174, 1276, 1370, 1468, 1531, 1631, 1735, 1843, 1955,
            2071, 2191, 2306, 2434, 2566, 2702, 2812, 2956,
        ],
    },
    // Alphanumeric mode capacity (roughly 60% of numeric)
    alphanumeric: {
        L: [
            25, 47, 77, 114, 154, 195, 224, 279, 335, 395, 468, 535, 619, 667, 758, 854, 938, 1046, 1153, 1249, 1352, 1460, 1588, 1704, 1853, 1990, 2132, 2223, 2369, 2520, 2677,
            2840, 3009, 3183, 3351, 3537, 3729, 3927, 4087, 4296,
        ],
        M: [
            20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600, 656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732, 1839, 1994, 2113, 2238,
            2369, 2506, 2632, 2780, 2894, 3054, 3220, 3391,
        ],
        Q: [
            16, 29, 47, 67, 87, 108, 125, 157, 189, 221, 259, 296, 352, 376, 426, 470, 531, 574, 644, 702, 742, 823, 890, 963, 1041, 1094, 1172, 1263, 1322, 1429, 1499, 1618, 1700,
            1787, 1867, 1966, 2071, 2181, 2298, 2420,
        ],
        H: [
            10, 20, 32, 47, 62, 78, 96, 118, 141, 167, 196, 224, 259, 279, 317, 357, 391, 437, 483, 517, 565, 611, 661, 715, 751, 831, 890, 925, 1003, 1091, 1171, 1231, 1286, 1371,
            1426, 1502, 1582, 1666, 1704, 1853,
        ],
    },
    // Byte mode capacity (roughly 40% of numeric)
    byte: {
        L: [
            17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952,
            2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953,
        ],
        M: [
            14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628,
            1722, 1809, 1911, 1989, 2099, 2213, 2331,
        ],
        Q: [
            11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228,
            1283, 1351, 1423, 1499, 1579, 1663,
        ],
        H: [
            7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983,
            1051, 1093, 1139, 1219, 1273,
        ],
    },
}

// Calculate character limit based on QR parameters
const calculateCharacterLimit = (errorCorrectionLevel: CommonState["errorCorrectionLevel"], version?: number, text?: string): number => {
    const targetVersion = version && version >= 1 && version <= 40 ? version : 40 // max
    let capacityTable = QR_CAPACITY.byte // Default to byte mode (most restrictive)

    if (text) {
        const isNumeric = /^\d+$/.test(text)
        const isAlphanumeric = /^[0-9A-Z $%*+\-./:]*$/.test(text)

        if (isNumeric) {
            capacityTable = QR_CAPACITY.numeric
        } else if (isAlphanumeric) {
            capacityTable = QR_CAPACITY.alphanumeric
        }
    }

    // Return capacity for the specified version and error correction level
    return capacityTable[errorCorrectionLevel][targetVersion - 1] || 0
}

export interface CommonState {
    text: string
    canShow: boolean
    size: number
    imagePreviewSize: number
    preview: string
    hasLogo: boolean
    isLogoLoaded: boolean
    logoContent: string | null
    logoRadius: number
    margin: number
    moduleColor: string
    backgroudnColor: string
    // Advanced QR parameters
    maskPattern?: number
    version?: number
    scale?: number
    errorCorrectionLevel: "L" | "M" | "Q" | "H"
    characterLimit: number
}

const initialState: CommonState = {
    text: "",
    canShow: false,
    size: 500,
    imagePreviewSize: 500,
    preview: "",
    hasLogo: false,
    isLogoLoaded: false,
    logoContent: null,
    logoRadius: 0,
    margin: 2,
    moduleColor: "#000000",
    backgroudnColor: "#FFFFFF",
    // Advanced QR parameters with defaults
    maskPattern: undefined,
    version: undefined,
    scale: undefined,
    errorCorrectionLevel: "H",
    characterLimit: calculateCharacterLimit("H", undefined, ""),
}

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setCommon: (state, action: PayloadAction<Partial<CommonState>>) => {
            const newState = { ...state, ...action.payload }
            newState.characterLimit = calculateCharacterLimit(newState.errorCorrectionLevel, newState.version, newState.text)
            newState.text = newState.text.substring(0, newState.characterLimit)
            return newState
        },
        resetAdvancedSettings: (state) => {
            const newState: CommonState = {
                ...state,
                maskPattern: undefined,
                version: undefined,
                scale: undefined,
                errorCorrectionLevel: "H",
            }
            newState.characterLimit = calculateCharacterLimit("H", undefined, state.text)
            newState.text = newState.text.substring(0, newState.characterLimit)
            return newState
        },
    },
})

export const { setCommon, resetAdvancedSettings } = commonSlice.actions
export default commonSlice.reducer
