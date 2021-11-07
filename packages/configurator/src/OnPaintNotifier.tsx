import React, { useEffect } from "react";

const OnPaintNotifier: React.FC<{ channel: string }> = ({ channel }) => {
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.ipcRenderer?.send(channel);
      }, 0);
    });
  }, [channel]);

  return null;
};

export default OnPaintNotifier;
