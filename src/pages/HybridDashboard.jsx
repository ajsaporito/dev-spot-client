import {
  Plus,
  ChevronDown,
  Calendar,
  DollarSign,
  User,
  Users,
  Clock,
  CheckCircle2,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { LeaveReviewModal } from "./LeaveReviewModal.jsx";
import { ViewRequestsModal } from "./ViewRequestsModal.jsx";
import { Link } from "react-router-dom";

const initialOpenJobs = [
  {
    id: 1,
    title: "Quality Assurance (QA) and Testing",
    type: "Hourly",
    rate: "$20-$30",
    timeframe: "20-30hrs/weekly",
    datePosted: "Oct 15, 2025",
    proposals: 0,
    proposalsData: [], // no requests yet
  },
  {
    id: 2,
    title: "UX/UI Designer",
    type: "Hourly",
    rate: "$20-$30",
    timeframe: "20-30hrs/weekly",
    datePosted: "Oct 20, 2025",
    proposals: 2,
    proposalsData: [
      {
        id: 201,
        freelancer: {
          name: "SarahDesign",
          avatar: "SD",
          rating: 4.9,
          reviewCount: 32,
          completedJobs: 18,
          location: "United States",
          verified: true,
          responseTime: "2 hours",
          successRate: 96,
        },
        bid: {
          amount: 28,
          type: "hourly",
        },
        coverLetter:
          "Hi there! I’m a UX/UI designer with 5+ years of experience in web and mobile products. I can help refine your existing flows, create responsive layouts, and deliver clean Figma files your devs can implement easily.",
        estimatedDuration: "3 weeks",
        submittedTime: "1 hour ago",
        skills: ["UX Design", "UI Design", "Figma", "Prototyping"],
        status: "pending",
      },
      {
        id: 202,
        freelancer: {
          name: "PixelCraft Studio",
          avatar: "PS",
          rating: 5.0,
          reviewCount: 41,
          completedJobs: 27,
          location: "Canada",
          verified: false,
          responseTime: "4 hours",
          successRate: 98,
        },
        bid: {
          amount: 30,
          type: "hourly",
        },
        coverLetter:
          "We specialize in interface design for SaaS products and dashboards. For this project we’d start with a quick audit of your current UI, then move into wireframes and high-fidelity mockups based on your brand.",
        estimatedDuration: "1 month",
        submittedTime: "3 hours ago",
        skills: ["UI Design", "Design Systems", "Figma"],
        status: "interviewing",
      },
    ],
  },
  {
    id: 3,
    title: "Mobile App",
    type: "Fixed",
    rate: "$2,250",
    timeframe: "1-2 months",
    datePosted: "Oct 22, 2025",
    proposals: 3,
    proposalsData: [
      {
        id: 301,
        freelancer: {
          name: "MikeCode",
          avatar: "MC",
          rating: 4.8,
          reviewCount: 19,
          completedJobs: 12,
          location: "United States",
          verified: true,
          responseTime: "1 hour",
          successRate: 94,
        },
        bid: {
          amount: 2300,
          type: "fixed",
        },
        coverLetter:
          "I build React Native and Flutter apps end-to-end, including API integration and basic deployment. I can deliver an MVP in 4–6 weeks depending on feature scope.",
        estimatedDuration: "4–6 weeks",
        submittedTime: "20 minutes ago",
        skills: ["React Native", "TypeScript", "API Integration"],
        status: "pending",
      },
      {
        id: 302,
        freelancer: {
          name: "Nova Mobile Labs",
          avatar: "NM",
          rating: 5.0,
          reviewCount: 25,
          completedJobs: 20,
          location: "United Kingdom",
          verified: true,
          responseTime: "3 hours",
          successRate: 99,
        },
        bid: {
          amount: 2500,
          type: "fixed",
        },
        coverLetter:
          "Our team has shipped multiple apps to both App Store and Play Store. We’ll help you with architecture, UI, and store submission, and keep communication clear with weekly demos.",
        estimatedDuration: "6 weeks",
        submittedTime: "5 hours ago",
        skills: ["iOS", "Android", "API Design", "UI Implementation"],
        status: "interviewing",
      },
      {
        id: 303,
        freelancer: {
          name: "DevTrio",
          avatar: "DT",
          rating: 4.7,
          reviewCount: 14,
          completedJobs: 9,
          location: "Poland",
          verified: false,
          responseTime: "6 hours",
          successRate: 91,
        },
        bid: {
          amount: 2100,
          type: "fixed",
        },
        coverLetter:
          "Small remote team focused on cross-platform apps. We can work with your existing backend or help you define the API spec and provide basic documentation.",
        estimatedDuration: "5–7 weeks",
        submittedTime: "Yesterday",
        skills: ["Flutter", "REST APIs", "Firebase"],
        status: "pending",
      },
    ],
  },
];

const initialJobsInProgress = [
  {
    id: 1,
    title: "Quality Assurance (QA) and Testing",
    type: "Hourly",
    rate: "$20-$30",
    timeframe: "20-30hrs/weekly",
    contractor: "Dave87\nMike42",
    datePosted: "Sep 10, 2025",
    dateStarted: "Sep 15, 2025",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    type: "Hourly",
    rate: "$50-$100hr",
    timeframe: "20-30hrs/weekly",
    contractor: "SarahDesign",
    datePosted: "Sep 20, 2025",
    dateStarted: "Sep 25, 2025",
  },
];


export function HybridDashboard() {

  /* FOR API DATA:
   const openJobs = jobs.filter(j => j.status === "open");
  const jobsInProgress = jobs.filter(j => j.status === "in_progress");
  const completedJobs = jobs.filter(j => j.status === "completed"); 
  */
  const [activeTab, setActiveTab] = useState("client"); // 'client' | 'freelancer'
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState(null);

  // 🔹 State for Requests modal
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openJobs, setOpenJobs] = useState(initialOpenJobs);

  const openRequests = (job) => {
    setSelectedJob(job);
    setIsRequestsOpen(true);
  };

  const closeRequests = () => {
    setIsRequestsOpen(false);
    setSelectedJob(null);
  };

    //called by the modal when Accept / Hire / Decline is clicked
  const handleUpdateRequestStatus = (jobId, requestId, newStatus) => {
    setOpenJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id !== jobId) return job;

        // update request status
        const updatedRequests = job.proposalsData.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        );

        // optionally mark the job as in_progress when accepted
        let status = job.status ?? "open";
        let contractor = job.contractor;

        if (newStatus === "accepted") {
          const acceptedReq = updatedRequests.find(r => r.id === requestId);
          status = "in_progress";
          contractor = acceptedReq?.freelancer?.name ?? contractor;
        }

        return {
          ...job,
          status,
          contractor,
          proposalsData: updatedRequests,
        };
      })
    );
  };


  const handleLeaveReview = (jobTitle, freelancerName) => {
    setSelectedJobForReview({ title: jobTitle, freelancer: freelancerName });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (rating, review) => {
    console.log("Review submitted:", { rating, review, job: selectedJobForReview });
    // Handle review submission logic here
  };

  // Mock data - Jobs posted by user


  const jobsInProgress = [
    {
      id: 1,
      title: "Quality Assurance (QA) and Testing",
      type: "Hourly",
      rate: "$20-$30",
      timeframe: "20-30hrs/weekly",
      contractor: "Dave87\nMike42",
      datePosted: "Sep 10, 2025",
      dateStarted: "Sep 15, 2025",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      type: "Hourly",
      rate: "$50-$100hr",
      timeframe: "20-30hrs/weekly",
      contractor: "SarahDesign",
      datePosted: "Sep 20, 2025",
      dateStarted: "Sep 25, 2025",
    },
  ];

  const completedJobs = [
    {
      id: 1,
      title: "Quality Assurance (QA) and Testing",
      type: "Hourly",
      rate: "$20-$30",
      freelancer: "Dave87",
      datePosted: "Aug 1, 2025",
      dateCompleted: "Sep 1, 2025",
      reviewed: false,
    },
    {
      id: 2,
      title: "UI/UX Designer",
      type: "Hourly",
      rate: "$50-$100hr",
      timeframe: "20-30hrs/weekly",
      freelancer: "SarahDesign",
      datePosted: "Jul 15, 2025",
      dateCompleted: "Aug 20, 2025",
      reviewed: false,
    },
    {
      id: 3,
      title: "Mobile app",
      type: "Fixed",
      rate: "$1750",
      timeframe: "1-3 months",
      freelancer: "MikeCode",
      datePosted: "Jun 1, 2025",
      dateCompleted: "Jul 30, 2025",
      reviewed: true,
      rating: 5,
    },
  ];

  // Mock data - Jobs where user is the freelancer
  const activeGigs = [
    {
      id: 1,
      title: "Senior React Developer for SaaS Platform",
      client: "TechCorp Inc.",
      type: "Fixed-price",
      budget: "$5,000",
      progress: 65,
      dateStarted: "Oct 1, 2025",
      deadline: "Nov 15, 2025",
    },
    {
      id: 2,
      title: "E-commerce Website Redesign",
      client: "ShopStyle Co.",
      type: "Hourly",
      rate: "$75/hr",
      hoursLogged: 32,
      dateStarted: "Oct 10, 2025",
    },
  ];

  const completedWork = [
    {
      id: 1,
      title: "Mobile App UI/UX Design",
      client: "StartupXYZ",
      type: "Fixed-price",
      earned: "$3,200",
      dateCompleted: "Sep 28, 2025",
      rating: 5,
    },
    {
      id: 2,
      title: "WordPress Plugin Development",
      client: "Digital Agency",
      type: "Hourly",
      earned: "$2,450",
      dateCompleted: "Sep 15, 2025",
      rating: 4.8,
    },
    {
      id: 3,
      title: "Logo Design & Branding",
      client: "FreshStart LLC",
      type: "Fixed-price",
      earned: "$1,800",
      dateCompleted: "Aug 30, 2025",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Tab Switcher */}
        <div className="flex items-center gap-4 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setActiveTab("client")}
            className="pb-3 px-1 text-[15px] border-b-2 transition-colors"
            style={{
              color: activeTab === "client" ? "var(--text)" : "var(--text-muted)",
              borderColor: activeTab === "client" ? "var(--accent)" : "transparent",
            }}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Jobs I Posted
          </button>

          <button
            onClick={() => setActiveTab("freelancer")}
            className="pb-3 px-1 text-[15px] border-b-2 transition-colors"
            style={{
              color: activeTab === "freelancer" ? "var(--text)" : "var(--text-muted)",
              borderColor: activeTab === "freelancer" ? "var(--accent)" : "transparent",
            }}
          >
            <User className="w-4 h-4 inline mr-2" />
            My Freelance Work
          </button>
        </div>

        {/* Client View */}
        {activeTab === "client" && (
          <div className="space-y-8">
            {/* Open Jobs Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ color: "var(--text)" }}>
                  Open Jobs
                </h2>
                <button className="text-[13px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  View all <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {openJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-[14px] border"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-[18px] mb-2">
                          <Link
                            to={`/job/${job.id}`}
                            className="hover:underline transition-colors"
                            style={{ color: "var(--accent)" }}
                          >
                            {job.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-4 text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
                          <span>
                            {job.type}: {job.rate}
                          </span>
                          <span>•</span>
                          <span>{job.timeframe}</span>
                          <span>•</span>
                          <span>Date posted: {job.datePosted}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="px-4 py-2 rounded-full text-[13px] border transition-colors hover:border-[#313744]"
                          style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openRequests(job)}
                          className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
                          style={{ background: "var(--accent)", color: "#ffffff" }}
                        >
                          View Requests ({job.proposals})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Jobs in Progress Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ color: "var(--text)" }}>
                  Jobs in Progress
                </h2>
                <button className="text-[13px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  View all <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {jobsInProgress.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-[14px] border"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-[18px] mb-2" style={{ color: "var(--text)" }}>
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-[13px] mb-2" style={{ color: "var(--text-muted)" }}>
                          <span>
                            {job.type}: {job.rate}
                          </span>
                          <span>{job.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Contractor(s): <span style={{ color: "var(--text)" }}>{job.contractor}</span>
                          </span>
                          <span>•</span>
                          <span>Date posted: {job.datePosted}</span>
                          <span>•</span>
                          <span>Date started: {job.dateStarted}</span>
                        </div>
                      </div>

                      <button
                        className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Completed Jobs Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ color: "var(--text)" }}>
                  Completed Jobs
                </h2>
                <button className="text-[13px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  View all <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-[14px] border"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-[18px]" style={{ color: "var(--text)" }}>
                            {job.title}
                          </h3>
                          {job.reviewed && <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />}
                        </div>

                        <div className="flex items-center gap-4 text-[13px] mb-2" style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Freelancer: <span style={{ color: "var(--text)" }}>{job.freelancer}</span>
                          </span>
                          <span>•</span>
                          <span>
                            {job.type}: {job.rate}
                          </span>
                          {job.timeframe && (
                            <>
                              <span>•</span>
                              <span>{job.timeframe}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                          <span>Date posted: {job.datePosted}</span>
                          <span>•</span>
                          <span>Date completed: {job.dateCompleted}</span>
                          {job.reviewed && job.rating && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">⭐ Your rating: {job.rating}.0</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!job.reviewed ? (
                          <>
                            <button
                              className="px-4 py-2 rounded-full text-[13px] border transition-colors hover:border-[#313744]"
                              style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleLeaveReview(job.title, job.freelancer)}
                              className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90 flex items-center gap-1"
                              style={{ background: "var(--accent)", color: "#ffffff" }}
                            >
                              <Star className="w-3 h-3" />
                              Leave Review
                            </button>
                          </>
                        ) : (
                          <button
                            className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
                            style={{ background: "var(--accent)", color: "#ffffff" }}
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Freelancer View */}
        {activeTab === "freelancer" && (
          <div className="space-y-8">
            {/* Active Gigs Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ color: "var(--text)" }}>
                  Active Gigs
                </h2>
                <button className="text-[13px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  View all <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {activeGigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="p-5 rounded-[14px] border"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-[18px] mb-1" style={{ color: "var(--text)" }}>
                          {gig.title}
                        </h3>
                        <p className="text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
                          Client: <span style={{ color: "var(--text)" }}>{gig.client}</span>
                        </p>

                        <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {gig.type}: {gig.budget || gig.rate}
                          </span>

                          {gig.hoursLogged && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {gig.hoursLogged} hours logged
                              </span>
                            </>
                          )}

                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Started: {gig.dateStarted}
                          </span>

                          {gig.deadline && (
                            <>
                              <span>•</span>
                              <span>Deadline: {gig.deadline}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                      >
                        View Details
                      </button>
                    </div>

                    {gig.progress != null && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                            Progress
                          </span>
                          <span className="text-[12px]" style={{ color: "var(--text)" }}>
                            {gig.progress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--panel-2)" }}>
                          <div
                            className="h-full transition-all duration-300"
                            style={{ background: "var(--accent)", width: `${gig.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Completed Work Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ color: "var(--text)" }}>
                  Completed Work
                </h2>
                <button className="text-[13px] flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  View all <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {completedWork.map((work) => (
                  <div
                    key={work.id}
                    className="p-5 rounded-[14px] border"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[18px]" style={{ color: "var(--text)" }}>
                            {work.title}
                          </h3>
                          <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />
                        </div>

                        <p className="text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
                          Client: <span style={{ color: "var(--text)" }}>{work.client}</span>
                        </p>

                        <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Earned: <span style={{ color: "#10b981" }}>{work.earned}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Completed: {work.dateCompleted}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">⭐ {work.rating}</span>
                        </div>
                      </div>

                      <button
                        className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {isRequestsOpen && selectedJob && (
        <ViewRequestsModal
          isOpen={isRequestsOpen}
          onClose={closeRequests}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          requests={selectedJob.proposalsData || []}
          onUpdateStatus={handleUpdateRequestStatus}
        />
      )}

      {/* Review Modal */}
      {selectedJobForReview && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          jobTitle={selectedJobForReview.title}
          clientName={selectedJobForReview.freelancer}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
