import { execute } from "./serial";
import MSPCodes from "./codes";

interface VoltageMeters {
    id: number;
    voltage: number;
}

export const getStatus = async (port: string): Promise<VoltageMeters[]> => {
    const data = await execute(port, { code: MSPCodes.MSP_VOLTAGE_METERS });
    return new Array(2).fill(true).map(() => ({
        id: data.readU8(),
        voltage: data.readU8() / 10.0
    }));
}
