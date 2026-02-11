import { Link } from "react-router-dom";
import { Search, Heart, CheckCircle, MapPin, Star, ChevronRight } from "lucide-react";
import { useState } from "react";

export function FindJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("best-matches");
  const [savedJobs, setSavedJobs] = useState([]); // number[]
  const [expandedJobs, setExpandedJobs] = useState([]); // number[]

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const toggleExpandJob = (jobId) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const jobs = [
    {
      id: 1,
      title: "Need a highly experienced dev to fix Vimeo video player embeds",
      budget: "$70-$150",
      budgetType: "Hourly",
      expertiseLevel: "Expert",
      estimatedTime: "Est. Time: Less than 1 month, Less than 30 hrs/week",
      postedTime: "5 hours ago",
      location: "United States",
      locationRestricted: true,
      description:
        "We have a Wordpress website with Vimeo videos embedded via Elementor popups and directly embedded into blog posts. The Vimeo videos are configured with the DNT parameter, but recently they stopped being able to play unless site visitors accept marketing cookies. The site is integrated with Cookieyes, but Cookieyes is not configured to block the necessary Vimeo cookie...",
      fullDescription:
        "We have a Wordpress website with Vimeo videos embedded via Elementor popups and directly embedded into blog posts. The Vimeo videos are configured with the DNT parameter, but recently they stopped being able to play unless site visitors accept marketing cookies. The site is integrated with Cookieyes, but Cookieyes is not configured to block the necessary Vimeo cookies. We need someone who can troubleshoot and fix this issue so that videos play properly for all visitors.",
      skills: ["WordPress", "Vimeo, Inc.", "Cookieyes"],
      paymentVerified: true,
      rating: 5.0,
      amountSpent: "$96 spent",
      proposals: "5 to 10",
      featured: false,
    },
    {
      id: 2,
      title: "Quality Assurance Tester",
      budget: null,
      budgetType: "Hourly",
      hourlyRange: "$30-$50",
      expertiseLevel: "Intermediate",
      estimatedTime: "Est. Time: Less than 1 month, Less than 30 hrs/week",
      postedTime: "14 minutes ago",
      location: "United States",
      locationRestricted: true,
      description:
        "About Palco, Inc. Palco, Inc. is a mission-driven technology and financial services company dedicated to helping individuals with disabilities and aging populations live independently. We partner with state governments and managed care organizations across the United States to deliver secure, reliable platforms for claims processing, payment distribution, and compliance...",
      fullDescription:
        "About Palco, Inc. Palco, Inc. is a mission-driven technology and financial services company dedicated to helping individuals with disabilities and aging populations live independently. We partner with state governments and managed care organizations across the United States to deliver secure, reliable platforms for claims processing, payment distribution, and compliance. Our work directly impacts the lives of millions of Americans, and we are looking for talented professionals to join our growing team.",
      skills: ["Manual Testing", "Mobile App Testing", "TestRail", "Jira", "Software QA"],
      paymentVerified: true,
      rating: 0,
      amountSpent: "$0 spent",
      proposals: "Less than 5",
      featured: false,
    },
    {
      id: 3,
      title: "User Tester – Fantasy Betting App (Vermont only)",
      budget: "$440",
      budgetType: "Fixed-price",
      expertiseLevel: "Entry level",
      estimatedTime: "Est. Budget: $440",
      postedTime: "11 hours ago",
      location: "USA",
      locationRestricted: true,
      description:
        "Job Summary: We are seeking a detail-oriented individuals to test parts of our new fantasy sports betting app. Part one: The registration and sign-up flow (2-3 minute job) Part two : The second part is our 3rd part banking/wallet. (2-3 minute job) Part three: The production funds to bet on our daily pools (as you please). The ideal candidates will provide actionable feedback on...",
      fullDescription:
        "Job Summary: We are seeking a detail-oriented individuals to test parts of our new fantasy sports betting app. Part one: The registration and sign-up flow (2-3 minute job) Part two : The second part is our 3rd part banking/wallet. (2-3 minute job) Part three: The production funds to bet on our daily pools (as you please). The ideal candidates will provide actionable feedback on usability, design, and functionality. This is a great opportunity to influence the development of an exciting new app.",
      skills: [
        "Age 21 or older (due to betting regulations)",
        "Access to a iOS smart phone",
        "Previous experience using testing applications",
        "Graphic Design",
        "Adobe Illustrator",
      ],
      paymentVerified: true,
      rating: 5.0,
      amountSpent: "$1K+ spent",
      proposals: "Less than 5",
      featured: true,
    },
    {
      id: 4,
      title: "Full Stack Developer for E-commerce Platform",
      budget: "$50-$80",
      budgetType: "Hourly",
      expertiseLevel: "Expert",
      estimatedTime: "Est. Time: 3 to 6 months, 30+ hrs/week",
      postedTime: "1 day ago",
      location: "Worldwide",
      locationRestricted: false,
      description:
        "We are looking for an experienced full-stack developer to help us build and scale our e-commerce platform. You will work closely with our product team to implement new features, optimize performance, and ensure a seamless user experience. Strong experience with React, Node.js, and PostgreSQL required.",
      fullDescription:
        "We are looking for an experienced full-stack developer to help us build and scale our e-commerce platform. You will work closely with our product team to implement new features, optimize performance, and ensure a seamless user experience. Strong experience with React, Node.js, and PostgreSQL required. Additional experience with AWS, Docker, and CI/CD pipelines is a plus.",
      skills: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
      paymentVerified: true,
      rating: 4.9,
      amountSpent: "$50K+ spent",
      proposals: "20 to 50",
      featured: false,
    },
    {
      id: 5,
      title: "Mobile App UI/UX Designer Needed",
      budget: "$3000-$5000",
      budgetType: "Fixed-price",
      expertiseLevel: "Intermediate",
      estimatedTime: "Est. Budget: $3000-$5000",
      postedTime: "3 hours ago",
      location: "Worldwide",
      locationRestricted: false,
      description:
        "Looking for a talented UI/UX designer to redesign our mobile application. We need someone who can create modern, intuitive interfaces that follow best practices and current design trends. Experience with Figma is required. Portfolio showcasing mobile app designs is a must.",
      fullDescription:
        "Looking for a talented UI/UX designer to redesign our mobile application. We need someone who can create modern, intuitive interfaces that follow best practices and current design trends. Experience with Figma is required. Portfolio showcasing mobile app designs is a must. You will be working with our development team to ensure designs are implementable and meet technical requirements.",
      skills: ["UI Design", "UX Design", "Figma", "Mobile Design", "Prototyping"],
      paymentVerified: true,
      rating: 4.8,
      amountSpent: "$10K+ spent",
      proposals: "10 to 15",
      featured: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for jobs"
            className="w-full pl-12 pr-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] mb-2" style={{ color: "var(--text)" }}>
          Jobs you might like
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-4 border-b pb-0" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setActiveFilter("most-recent")}
          className="pb-3 text-[14px] border-b-2 transition-colors"
          style={{
            color: activeFilter === "most-recent" ? "var(--text)" : "var(--text-muted)",
            borderColor: activeFilter === "most-recent" ? "var(--accent)" : "transparent",
          }}
        >
          Most Recent
        </button>
       
      </div>

      {/* Job Listings */}
      <div className="space-y-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-lg border p-6 hover:border-[#313744] transition-colors"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Posted {job.postedTime}
                  </span>
                  {job.featured && (
                    <span className="px-2 py-0.5 rounded text-[11px]" style={{ background: "var(--accent)", color: "#ffffff" }}>
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-[18px] mb-2 hover:underline cursor-pointer" style={{ color: "var(--accent)" }}>
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-[13px] mb-2" style={{ color: "var(--text-muted)" }}>
                  {job.budgetType === "Hourly" ? (
                    <>
                      <span>{job.budgetType}</span>
                      {job.budget && (
                        <>
                          <span>:</span>
                          <span>{job.budget}</span>
                        </>
                      )}
                      {job.hourlyRange && (
                        <>
                          <span>:</span>
                          <span>{job.hourlyRange}</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <span>{job.budgetType}</span>
                      <span>:</span>
                      <span>{job.budget}</span>
                    </>
                  )}
                  <span>-</span>
                  <span>{job.expertiseLevel}</span>
                  <span>-</span>
                  <span>{job.estimatedTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 rounded hover:bg-opacity-10 transition-colors">
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}

                    />
                  </svg>
                </button>

                <button onClick={() => toggleSaveJob(job.id)} className="p-2 rounded hover:bg-opacity-10 transition-colors">
                  <Heart
                    className="w-5 h-5"
                    style={{ color: savedJobs.includes(job.id) ? "var(--danger)" : "var(--text-muted)" }}
                    fill={savedJobs.includes(job.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-[14px] mb-3 leading-relaxed" style={{ color: "var(--text)" }}>
              {expandedJobs.includes(job.id) ? job.fullDescription : job.description}
              {job.description !== job.fullDescription && (
                <button
                  onClick={() => toggleExpandJob(job.id)}
                  className="ml-1 hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {expandedJobs.includes(job.id) ? "less" : "more"}
                </button>
              )}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-[13px]"
                  style={{ background: "var(--panel)", color: "var(--text-muted)" }}
                >
                  {skill}
                </span>
              ))}
            </div>

              {job.rating > 0 && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3.5 h-3.5"
                      style={{ color: star <= job.rating ? "#f59e0b" : "var(--text-muted)" }}
                      fill={star <= job.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{job.location}</span>
              </div>
            </div>
          
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-3 rounded-full border transition-colors hover:border-[#313744] text-[14px] flex items-center gap-2"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          Load more jobs
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

