import {Ice} from "ice";

export interface IceErrorContext {
  remoteHost?: string;
  remotePort?: string;
}

export interface IceErrorHandler {
  (err: any, context: IceErrorContext, current: Ice.Current): void;
}

export interface RemoveIceErrorHandler {
  (): void;
}

const iceErrorHandlers: IceErrorHandler[] = [];

const iceWarn: (error: any) => void =
  (Ice as any).IncomingAsync.prototype.__warning;

(Ice as any).IncomingAsync.prototype.__warning = function (error: any) {
  if (!iceErrorHandlers)
    return iceWarn.call(this, error);

  const context: IceErrorContext = {};
  if (this._connection !== null) {
    try {
      const connInfo = this._connection.getInfo();
      if (connInfo instanceof (Ice as any).IPConnectionInfo) {
        context.remoteHost = connInfo.remoteAddressm;
        context.remotePort = connInfo.remotePort;
      }
    } catch (exc) {
      // Ignore.
    }
  }

  for (const handler of iceErrorHandlers)
    handler(error, context, this._current);
};

export default function (handler: IceErrorHandler): RemoveIceErrorHandler {
  iceErrorHandlers.push(handler);
  return () => {
    const index = iceErrorHandlers.indexOf(handler);
    iceErrorHandlers.splice(index, 1);
  };
}
