export interface FlightControllerPartial {
  port: string;
  connection: { connecting: boolean; connected: boolean };
}

export interface ConnectionStateMapping {
  parent: FlightControllerPartial;
}
