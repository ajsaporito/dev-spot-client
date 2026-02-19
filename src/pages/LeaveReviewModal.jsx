import { X, Star, Send } from "lucide-react";
import { useState } from "react";

export function LeaveReviewModal({ isOpen, onClose, jobTitle, clientName, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    console.log("Submitting review:", { rating, review, jobTitle, clientName });
    if (onSubmit) onSubmit(rating, review);

    // Reset and close
    setRating(0);
    setHoveredRating(0);
    setReview("");
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[16px] border"
        style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between p-6 border-b"
          style={{ background: "var(--panel)", borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-[22px]" style={{ color: "var(--text)" }}>
              Leave a Review
            </h2>
            <p className="text-[14px] mt-1" style={{ color: "var(--text-muted)" }}>
              Rate your experience with <span style={{ color: "var(--text)" }}>{clientName}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Info */}
          <div className="p-4 rounded-lg" style={{ background: "var(--panel-2)" }}>
            <div className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
              Completed Job
            </div>
            <div className="text-[16px]" style={{ color: "var(--text)" }}>
              {jobTitle}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-[14px] mb-3" style={{ color: "var(--text)" }}>
              Overall Rating <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className="w-10 h-10"
                    fill={star <= (hoveredRating || rating) ? "var(--accent)" : "none"}
                    stroke={star <= (hoveredRating || rating) ? "var(--accent)" : "var(--border)"}
                    strokeWidth={2}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-[18px]" style={{ color: "var(--accent)" }}>
                  {rating}.0
                </span>
              )}
            </div>

            {rating > 0 && (
              <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                {rating === 5 && "Outstanding work! Exceeded expectations."}
                {rating === 4 && "Great experience! Would work together again."}
                {rating === 3 && "Good work overall, met expectations."}
                {rating === 2 && "Below expectations, had some issues."}
                {rating === 1 && "Poor experience, significant problems."}
              </p>
            )}
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
              Written Review{" "}
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                (Optional)
              </span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share details about your experience. What went well? What could be improved?"
              rows={6}
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[14px] resize-none"
              style={{
                background: "var(--panel-2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
            <p className="text-[12px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              Your review will be visible to other users on the platform. 
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-lg border transition-colors text-[14px] hover:opacity-80"
              style={{
                background: "var(--panel-2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={rating === 0}
              className="flex-1 px-6 py-3 rounded-lg transition-opacity text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}