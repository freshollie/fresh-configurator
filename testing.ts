import { ports, connect, getVoltages, close } from "./device";

(async () => {
    const availablePorts = await ports();
    console.log(availablePorts);

    const port = availablePorts[0].path;
    await connect(port);
    try {
        console.log(await getVoltages(port));
    } catch (e) {
        console.log(e);
        await close(port);
    }
})();