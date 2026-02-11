import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  Heart,
  Flag,
  Share2,
  Briefcase,
  Award,
} from "lucide-react";

export function JobDetailPage({ onBack }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = {
    id: 1,
    title: "Need a highly experienced dev to fix Vimeo video player embeds",
    budget: "$70-$150",
    budgetType: "Hourly",
    expertiseLevel: "Expert",
    estimatedDuration: "Less than 1 month",
    weeklyHours: "Less than 30 hrs/week",
    postedTime: "5 hours ago",
    location: "United States",
    locationRestricted: true,
    description: `...`,
    skills: ["WordPress", "Vimeo, Inc.", "Cookieyes", "JavaScript", "GDPR Compliance"],
    client: {
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 5.0,
      totalSpent: "$96K+",
      jobsPosted: 24,
      hireRate: 89,
      location: "United States",
      memberSince: "Member since Jan 2020",
      verified: true,
      reviewCount: 18,
    },
    activityOnJob: {
      proposals: "5 to 10",
      lastViewed: "1 hour ago",
      interviewing: 2,
      invitesSent: 3,
      unanswered: 1,
    },
    projectType: "One-time project",
    projectLength: "Less than 1 month",
    experience: "Expert",
  };

  const handleApply = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // TODO: replace with real API call:
      // await api.createJobRequest({ jobId: job.id });
      await new Promise((r) => setTimeout(r, 600)); // fake delay

      toast.success("Request sent! The client will be notified.");
    } catch (err) {
      toast.error("Couldn’t send request. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Navigation Bar */}
      <nav className="border-b sticky top-0 z-10" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ color: "var(--accent)" }} className="text-[22px]">
                {"</>"}
              </div>
              <span className="text-[20px]" style={{ color: "var(--text)" }}>
                DevSpot
              </span>
            </div>

            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-opacity-10"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-[28px] mb-3" style={{ color: "var(--text)" }}>
                    {job.title}
                  </h1>

                  <div className="flex items-center gap-4 text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted {job.postedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-2.5 rounded-lg transition-colors"
                    style={{
                      background: isSaved ? "var(--accent)" : "var(--panel-2)",
                      color: isSaved ? "#ffffff" : "var(--text-muted)",
                    }}
                    title={isSaved ? "Saved" : "Save job"}
                  >
                    <Heart className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                  </button>

                  <button
                    className="p-2.5 rounded-lg transition-colors"
                    style={{ background: "var(--panel-2)", color: "var(--text-muted)" }}
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  <button
                    className="p-2.5 rounded-lg transition-colors"
                    style={{ background: "var(--panel-2)", color: "var(--text-muted)" }}
                    title="Report"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Job Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Budget
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {job.budget}
                    </span>
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {job.budgetType}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Experience Level
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {job.expertiseLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Duration
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {job.estimatedDuration}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Time Commitment
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {job.weeklyHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Restriction */}
              {job.locationRestricted && (
                <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ background: "var(--panel-2)" }}>
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Only freelancers located in the {job.location} may apply
                  </span>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg transition-opacity text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)", color: "#ffffff" }}
              >
                {isSubmitting ? "Sending Request..." : "Apply Now"}
              </button>
            </div>

            {/* Description */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                Job Description
              </h2>
              <div className="text-[14px] leading-relaxed whitespace-pre-line" style={{ color: "var(--text-muted)" }}>
                {job.description}
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-[13px]"
                    style={{ background: "var(--panel-2)", color: "var(--text)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                Activity on this job
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Proposals
                  </div>
                  <div className="text-[16px]" style={{ color: "var(--text)" }}>
                    {job.activityOnJob.proposals}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Last viewed by client
                  </div>
                  <div className="text-[16px]" style={{ color: "var(--text)" }}>
                    {job.activityOnJob.lastViewed}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Interviewing
                  </div>
                  <div className="text-[16px]" style={{ color: "var(--text)" }}>
                    {job.activityOnJob.interviewing}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Invites sent
                  </div>
                  <div className="text-[16px]" style={{ color: "var(--text)" }}>
                    {job.activityOnJob.invitesSent}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client Info */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <h3 className="text-[16px] mb-4" style={{ color: "var(--text)" }}>
                About the Client
              </h3>

              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[16px]"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                >
                  {job.client.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px]" style={{ color: "var(--text)" }}>
                      {job.client.name}
                    </h4>
                    {job.client.verified && <CheckCircle className="w-4 h-4" style={{ color: "var(--blue)" }} />}
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3.5 h-3.5"
                        style={{ color: star <= job.client.rating ? "#f59e0b" : "var(--text-muted)" }}
                        fill={star <= job.client.rating ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="text-[12px] ml-1" style={{ color: "var(--text-muted)" }}>
                      {job.client.rating} ({job.client.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "var(--text-muted)" }}>{job.client.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Calendar className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "var(--text-muted)" }}>{job.client.memberSince}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Total spent
                  </span>
                  <span className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.client.totalSpent}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Jobs posted
                  </span>
                  <span className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.client.jobsPosted}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Hire rate
                  </span>
                  <span className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.client.hireRate}%
                  </span>
                </div>
              </div>

              {job.client.verified && (
                <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: "var(--panel-2)" }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--blue)" }} />
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Payment method verified
                  </span>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <h3 className="text-[16px] mb-4" style={{ color: "var(--text)" }}>
                Project Details
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Project Type
                  </div>
                  <div className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.projectType}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Project Length
                  </div>
                  <div className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.projectLength}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Experience Level
                  </div>
                  <div className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.experience}
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="rounded-lg border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <h3 className="text-[16px] mb-4" style={{ color: "var(--text)" }}>
                Similar Jobs
              </h3>

              <div className="space-y-4">
                {[
                  { title: "WordPress Plugin Development", budget: "$500-$1000", proposals: 12 },
                  { title: "Video Integration Expert", budget: "$50-$80/hr", proposals: 8 },
                  { title: "Cookie Consent Fix", budget: "$200-$400", proposals: 5 },
                ].map((similarJob, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b last:border-b-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <h4 className="text-[14px] mb-2 hover:underline" style={{ color: "var(--accent)" }}>
                      {similarJob.title}
                    </h4>
                    <div className="flex items-center justify-between text-[12px]">
                      <span style={{ color: "var(--text-muted)" }}>{similarJob.budget}</span>
                      <span style={{ color: "var(--text-muted)" }}>{similarJob.proposals} proposals</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional: a second Apply button in sidebar could call handleApply() too */}
          </div>
        </div>
      </div>
    </div>
  );
}
