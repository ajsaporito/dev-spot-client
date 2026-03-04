import * as signalR from "@microsoft/signalr";
import { getToken } from "../api/client";

let connection = null;

export function getChatConnection() {
  if (!connection) {
    const base = import.meta.env.VITE_API_BASE_URL;
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${base}/hubs/chat`, {
        accessTokenFactory: () => getToken(),
      })
      .withAutomaticReconnect()
      .build();
  }
  return connection;
}
