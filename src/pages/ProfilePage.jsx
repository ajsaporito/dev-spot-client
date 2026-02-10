import { Link } from "react-router-dom";

export default function ProfilePage({ userType, userName }) {
  return (
    <div style={{ color: "white", padding: 24 }}>
      ProfilePage renders {userName} ({userType})
    </div>
  );
}
