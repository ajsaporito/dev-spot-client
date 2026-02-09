import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  Briefcase,
  MapPin,
  Star,
  BookmarkPlus,
  User,
  ChevronDown,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ProfilePage from "./ProfilePage";
//import { FindJobsPage } from "./FindJobsPage";
//import { HireTalentPage } from "./HireTalentPage";
//import { TalentProfilePage } from "./TalentProfilePage";
//import { MessagesPage } from "./MessagesPage";

export default function Dashboard({ userType = "client", userName = "Tristen" }) {
{

    const [activeTab] = useState(
        "home" // default active tab
  );
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "white", padding: 24 }}>
      Dashboard placeholder 

      {activeTab === "profile" && (
        <ProfilePage userType={userType} userName={userName} />
        )}

    </div>

  );
}
}

