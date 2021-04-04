import { execute, WriteBuffer, apiVersion } from "@betaflight/msp";
import semver from "semver";
import codes from "../codes";
import { times } from "../utils";
import { ModeSlot, Modes } from "./types";

export { Modes };

export const readModeRangeSlots = async (port: string): Promise<ModeSlot[]> => {
  const api = apiVersion(port);
  const [data, extraData] = await Promise.all([
    execute(port, { code: codes.MSP_MODE_RANGES }),
    semver.gte(api, "1.41.0")
      ? execute(port, { code: codes.MSP_MODE_RANGES_EXTRA })
      : undefined,
  ]);

  if (extraData) {
    // we don't really care about the number of
    // extra data bits, because we assume it must
    // be the same as the number of mode slots
    extraData.readU8();
  }

  return times(
    () => ({
      modeId: data.readU8(),
      auxChannel: data.readU8(),
      range: {
        start: 900 + data.readU8() * 25,
        end: 900 + data.readU8() * 25,
      },
      ...(extraData
        ? {
            modeId: extraData.readU8(),
            modeLogic: extraData.readU8(),
            linkedTo: extraData.readU8(),
          }
        : {}),
    }),
    data.byteLength / 4
  );
};

export const writeModeRangeSlot = async (
  port: string,
  slotPosition: number,
  slot: ModeSlot
): Promise<void> => {
  const buffer = new WriteBuffer();
  buffer
    .push8(slotPosition)
    .push8(slot.modeId)
    .push8(slot.auxChannel)
    .push8((slot.range.start - 900) / 25)
    .push8((slot.range.end - 900) / 25);

  if (slot.modeLogic !== undefined && slot.linkedTo !== undefined) {
    buffer.push8(slot.modeLogic).push8(slot.linkedTo);
  }
  await execute(port, { code: codes.MSP_SET_MODE_RANGE, data: buffer });
};

export const writeModeRangeSlots = async (
  port: string,
  slots: ModeSlot[]
): Promise<void> => {
  await Promise.all(slots.map((slot, i) => writeModeRangeSlot(port, i, slot)));
};

export const readBoxIds = async (port: string): Promise<Modes[]> => {
  const data = await execute(port, { code: codes.MSP_BOXIDS });
  return [...new Uint8Array(data.buffer)];
};
