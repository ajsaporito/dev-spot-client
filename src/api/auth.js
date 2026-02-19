import { setUser, setToken, postJson} from "./client";

export async function login(payload) {
  const data = await postJson("/api/auth/login", payload);

  setToken(data.accessToken);
  setUser({
    userId: data.userId,
    username: data.username,
    profilePicUrl: data.profilePicUrl ?? null,
  });

  return data;
}

export async function register(payload) {
  const data = await postJson("/api/auth/register", payload);

  setToken(data.accessToken);
  setUser({
    userId: data.userId,
    username: data.username,
    profilePicUrl: data.profilePicUrl ?? null,
  });

  return data;
}
