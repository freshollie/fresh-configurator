import MockBinding from "@serialport/binding-mock";
import binding from "@serialport/bindings";
import SerialPort from "@serialport/stream";
import flushPromises from "flush-promises";
import { raw, reset, execute, apiVersion } from "../src/connection";
import {
  open,
  connections,
  isOpen,
  ports,
  close,
  bytesRead,
  bytesWritten,
  packetErrors,
} from "../src";

import { encodeMessageV1, encodeMessageV2 } from "../src/encoders";

const mockMspDevices = ["/dev/something", "/dev/somethingelse"];
const mockPorts = ["/dev/non-msp-device", ...mockMspDevices];

const mspInfoRequest = encodeMessageV1(1);

/**
 * Get the data written to the given port
 * after the msp info request was written
 */
const writtenData = (port: string): Buffer =>
  (raw(port)?.binding as MockBinding).recording.slice(
    mspInfoRequest.byteLength
  );

const reply = (port: string, data: Buffer): void => {
  (raw(port)?.binding as MockBinding).emitData(data);
};

const realSetTimeout = setTimeout;

let killMspReplying = false;
/**
 * Automatically reply MSP info for the given port
 * when it's opened
 */
const handleMspInfoReply = async (port: string): Promise<void> => {
  let currentPort = raw(port);
  while (!killMspReplying) {
    try {
      if (
        currentPort !== raw(port) &&
        (raw(port)?.binding as MockBinding).recording.compare(
          mspInfoRequest
        ) === 0
      ) {
        currentPort = raw(port);
        // Reply with some mock MSP info
        reply(port, Buffer.from([36, 77, 62, 3, 1, 0, 1, 40, 43]));
      }
    } catch (e) {}
    // Respond to an open request within 100ms
    await new Promise((resolve) => realSetTimeout(resolve, 10));
  }
};

mockMspDevices.forEach((port) => handleMspInfoReply(port));

afterAll(() => {
  killMspReplying = true;
});

beforeEach(() => {
  // Reset the bindings every iteration to ensure
  // that every function can start from an empty state
  SerialPort.Binding = undefined as any;
  mockPorts.forEach((path) => {
    MockBinding.createPort(path, {
      record: true,
    });
  });
});

afterEach(async () => {
  jest.clearAllTimers();
  jest.useRealTimers();
  await reset();
  MockBinding.reset();
});

describe("open", () => {
  it("should open an MSP connection to the given port", async () => {
    await open("/dev/something");
    expect(isOpen("/dev/something")).toBe(true);
    expect(SerialPort.Binding).toEqual(binding);
  });

  it("should allow multiple ports to be opened", async () => {
    await Promise.all(mockMspDevices.map((port) => open(port)));
    expect(mockMspDevices.every((port) => isOpen(port))).toBe(true);
  });

  it("should throw an error when trying to open a port which doesn't respond with api version", () =>
    new Promise<void>((done) => {
      jest.useFakeTimers();

      open("/dev/non-msp-device")
        .then(() => {
          throw new Error("should not have resolved");
        })
        .catch((e) => {
          expect(e).toMatchSnapshot();
          done();
        });

      realSetTimeout(() => {
        jest.advanceTimersByTime(2500);
      }, 100);
    }));

  it("should provide a callback and close the connection when the connection closes", () => {
    return new Promise<void>((done) => {
      open("/dev/something", () => {
        expect(isOpen("/dev/something")).toBe(false);
        done();
      }).then(() => raw("/dev/something")?.close());
    });
  });

  it("should close the connection when an error occurs", () =>
    new Promise<void>((done) => {
      open("/dev/something", () => {
        expect(isOpen("/dev/something")).toBe(false);
        done();
      }).then(() =>
        raw("/dev/something")?.emit("error", new Error("Oh no some error"))
      );
    }));

  it("should close the connection if the device disconnects", () =>
    new Promise<void>((done) => {
      open("/dev/something", () => {
        expect(isOpen("/dev/something")).toBe(false);
        done();
      }).then(() => {
        MockBinding.reset();
        mockPorts
          .filter((port) => port !== "/dev/something")
          .forEach((path) => {
            MockBinding.createPort(path, {
              record: true,
            });
          });
      });
    }));

  it("should throw an error when port cannot be opened", async () => {
    await expect(open("/something/wrong")).rejects.toEqual(expect.any(Error));
    await expect(open("/something/wrong")).rejects.toMatchSnapshot();
  });

  it("should not allow a connection to be opened more than once", async () => {
    await open("/dev/something");
    await expect(open("/dev/something")).rejects.toEqual(expect.any(Error));
    await expect(open("/dev/something")).rejects.toMatchSnapshot();
  });
});

describe("connections", () => {
  it("should return a list of connected ports", async () => {
    expect(connections()).toEqual([]);
    await open("/dev/somethingelse");

    expect(connections()).toEqual(["/dev/somethingelse"]);

    await close("/dev/somethingelse");
    expect(connections()).toEqual([]);
  });
});

describe("close", () => {
  it("should close an open connection", async () => {
    const closeCallback = jest.fn();

    await open("/dev/something", closeCallback);
    await close("/dev/something");

    expect(isOpen("/dev/something")).toBe(false);
    expect(closeCallback).toHaveBeenCalled();
  });

  it("should ignore when connection is already closed", async () => {
    await expect(close("/dev/something")).resolves.toBeUndefined();
  });

  it("should cancel all pending executions", async () => {
    await open("/dev/something");

    const requests = Promise.all(
      [1, 2].map((v) =>
        execute("/dev/something", { code: v })
          .then(() => {
            throw new Error("Should have thrown an error");
          })
          .catch((e) => {
            expect(e).toMatchSnapshot();
          })
      )
    );
    await flushPromises();

    await close("/dev/something");

    return requests;
  });
});

describe("ports", () => {
  it("should list the available ports", async () => {
    expect(await ports()).toEqual(mockPorts);
  });
});

describe("execute", () => {
  it("should throw an error if the port is not open", async () => {
    await expect(execute("/dev/something", { code: 1 })).rejects.toEqual(
      expect.any(Error)
    );
    await expect(
      execute("/dev/something", { code: 1 })
    ).rejects.toMatchSnapshot();
  });

  it("should write the given command and data for v1 commands", async () => {
    await open("/dev/something");

    await execute("/dev/something", {
      code: 254,
      data: Buffer.from("This is a message"),
      timeout: 0,
    }).catch(() => {});

    expect(writtenData("/dev/something")).toEqual(
      encodeMessageV1(254, Buffer.from("This is a message"))
    );
  });

  it("should write the given command and data for v2 commands", async () => {
    await open("/dev/something");

    await execute("/dev/something", {
      code: 256,
      data: Buffer.from("This is a v2 message"),
      timeout: 0,
    }).catch(() => {});

    expect(writtenData("/dev/something")).toEqual(
      encodeMessageV2(256, Buffer.from("This is a v2 message"))
    );
  });

  it("should deduplicate requests, if the same request is already in flight", async () => {
    await open("/dev/something");

    await Promise.all([
      execute("/dev/something", {
        code: 254,
        data: Buffer.from("This is a message"),
        timeout: 0,
      }).catch(() => {}),
      execute("/dev/something", {
        code: 254,
        data: Buffer.from("This is a message"),
        timeout: 0,
      }).catch(() => {}),
    ]);

    expect(writtenData("/dev/something")).toEqual(
      encodeMessageV1(254, Buffer.from("This is a message"))
    );

    await execute("/dev/something", {
      code: 254,
      data: Buffer.from("This is a different request"),
      timeout: 0,
    }).catch(() => {});

    expect(writtenData("/dev/something")).toEqual(
      Buffer.concat([
        encodeMessageV1(254, Buffer.from("This is a message")),
        encodeMessageV1(254, Buffer.from("This is a different request")),
      ])
    );
  });

  it("should return response of the given request", async () => {
    await open("/dev/something");
    const execution = execute("/dev/something", {
      code: 108,
    });
    await flushPromises();

    // Reply the data in 2 parts to ensure that it can
    // handle data coming in chunks
    reply("/dev/something", Buffer.from([36, 77, 62, 6, 108]));
    await flushPromises();
    reply("/dev/something", Buffer.from([129, 0, 62, 1, 100, 1, 177]));

    const response = await execution;
    expect(Buffer.from(response.buffer)).toEqual(
      Buffer.from([129, 0, 62, 1, 100, 1])
    );
  });

  it("should ignore responses which are not related", async () => {
    await open("/dev/something");
    const execution = execute("/dev/something", {
      code: 108,
    });
    await flushPromises();

    // write some data which is not the response
    reply("/dev/something", Buffer.from([36, 77, 62, 0, 100, 177]));
    await flushPromises();
    reply(
      "/dev/something",
      Buffer.from([36, 77, 62, 6, 108, 129, 0, 62, 1, 100, 1, 177])
    );
    await flushPromises();

    const response = await execution;
    expect(Buffer.from(response.buffer)).toEqual(
      Buffer.from([129, 0, 62, 1, 100, 1])
    );
  });

  it("should return the same data for a duplicate request", async () => {
    await open("/dev/something");
    const execution1 = execute("/dev/something", {
      code: 108,
    });
    const execution2 = execute("/dev/something", {
      code: 108,
    });

    await flushPromises();
    reply(
      "/dev/something",
      Buffer.from([36, 77, 62, 6, 108, 129, 0, 62, 1, 100, 1, 177])
    );

    const response1 = await execution1;
    expect(Buffer.from(response1.buffer)).toEqual(
      Buffer.from([129, 0, 62, 1, 100, 1])
    );

    const response2 = await execution2;
    expect(Buffer.from(response2.buffer)).toEqual(
      Buffer.from([129, 0, 62, 1, 100, 1])
    );

    // Ensure they are their own objects
    expect(response1).not.toBe(response2);
  });

  it("should ignore malformed responses", async () => {
    await open("/dev/something");

    jest.useFakeTimers();
    const execution = execute("/dev/something", {
      code: 108,
    });

    // Invalid checksum
    reply(
      "/dev/something",
      Buffer.from([36, 77, 62, 6, 108, 129, 0, 62, 1, 100, 1, 232])
    );
    await flushPromises();

    jest.runAllTimers();
    // Should timeout from no response
    await expect(execution).rejects.toEqual(expect.any(Error));
    expect(packetErrors("/dev/something")).toBe(1);
  });

  it("should timeout after given timeout", async () => {
    await open("/dev/something");

    jest.useFakeTimers();

    let rejected: Error | undefined;
    execute("/dev/something", {
      code: 108,
      timeout: 500,
    }).catch((err: Error) => {
      rejected = err;
    });

    // Advancing to 499 should not timeout
    jest.advanceTimersByTime(499);
    await flushPromises();
    expect(rejected).toBeFalsy();

    // but 500 should
    jest.advanceTimersByTime(1);
    await flushPromises();

    expect(rejected).toBeTruthy();
    expect(rejected).toMatchSnapshot();
  });
});

describe("bytesRead", () => {
  it("should initialise at 0", async () => {
    await open("/dev/something");
    expect(bytesRead("/dev/something")).toEqual(0);
  });

  it("should count the number of bytes read from the device", async () => {
    const data = [36, 77, 62, 6, 108, 129, 0, 62, 1, 100, 1, 177];
    await open("/dev/something");
    reply("/dev/something", Buffer.from(data));
    await flushPromises();
    expect(bytesRead("/dev/something")).toEqual(data.length);
  });
});

describe("bytesWritten", () => {
  it("should initialise at 0", async () => {
    await open("/dev/something");
    expect(bytesWritten("/dev/something")).toEqual(0);
  });

  it("should count the number of bytes written to the device", async () => {
    await open("/dev/something");
    await execute("/dev/something", {
      code: 54,
      data: Buffer.from("This is a v1 message"),
      timeout: 0,
    }).catch(() => {});

    expect(bytesWritten("/dev/something")).toEqual(
      Buffer.byteLength(
        encodeMessageV1(54, Buffer.from("This is a v1 message"))
      )
    );
  });
});

describe("apiVersion", () => {
  it("should respond with the api version for the currently open port", async () => {
    await open("/dev/something");
    expect(apiVersion("/dev/something")).toEqual("1.40.0");
  });

  it("should respond with 0.0.0 when port is not open", () => {
    expect(apiVersion("/dev/something")).toEqual("0.0.0");
  });
});
