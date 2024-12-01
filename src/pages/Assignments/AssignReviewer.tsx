import React, { useState } from "react";
import './AssignReviewerStyle.css'; 

interface Reviewer {
  name: string;
  status: string;
}

interface IContributor {
  name: string;
  username: string;
}

interface RowData {
  topic: string;
  contributors: IContributor[];  
  reviewers: Reviewer[];
}

const data: RowData[] = [
  {
    topic: "E2450. Refactor assignments_controller.rb",
    contributors: [
      { name: "Alice", username: "alice123" },
      { name: "Bob", username: "bob456" },
    ],
    reviewers: [
      { name: "user1", status: "Submitted" },
    ],
  },
  {
    topic: "E2451. Reimplement feedback_response_map.rb",
    contributors: [ 
      { name: "Bob", username: "bob123" },
      { name: "Eve", username: "eve123"}
    ],  // Multiple contributors
    reviewers: [
      { name: "user2", status: "Pending" },
      { name: "user3", status: "Submitted" },
    ],
  },
  {
    topic: "E2452. Refactor review_mapping_controller.rb",
    contributors: [{name: "Charlie", username: "charlie123"}],  // Single contributor
    reviewers: [],
  },
  {
    topic: "E2458. User management and users table",
    contributors: [
      { name: "Harley", username: "harley123" },
      { name: "Javed", username: "javed1234" },
      { name: "Leo", username: "leo123" }
    ],  // Multiple contributors
    reviewers: [
      { name: "user2", status: "Pending" },
      { name: "user3", status: "Submitted" },
    ],
  },
  {
    topic: "E2467. UI for View Submissions",
    contributors: [
      {name: "Shadow", username: "shadow123" },
      {name: "Bradon", username: "bradon123" }
    ],  // Multiple contributors
    reviewers: [
      { name: "user2", status: "Pending" },
      { name: "user3", status: "Submitted" },
    ],
  }
];

const AssignReviewer: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [tableData, setTableData] = useState<RowData[]>(data);

  const openModal = (topic: string, contributors: IContributor[]) => {
    const contributorDetails = contributors.map(
      (contributor) => `${contributor.name} (${contributor.username})`
    );
    setSelectedTopic(topic);
    setSelectedContributors(contributorDetails);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setReviewerName("");
  };

  const handleAddReviewer = () => {
    if (reviewerName.trim()) {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.topic === selectedTopic
            ? {
                ...row,
                reviewers: [
                  ...row.reviewers,
                  { name: reviewerName, status: "Pending" },
                ],
              }
            : row
        )
      );
      closeModal();
    }
  };

  const handleUnsubmit = (topic: string, reviewerName: string) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.topic === topic
          ? {
              ...row,
              reviewers: row.reviewers.map((reviewer) =>
                reviewer.name === reviewerName
                  ? { ...reviewer, status: "Pending" }
                  : reviewer
              ),
            }
          : row
      )
    );
  };

  return (
    <div className="assign-reviewer-container">
      <h1>Assign Reviewer</h1>
      <h3>Assignment: Final Project (and design doc)</h3>
      <table className="assign-reviewer-table">
        <thead>
          <tr>
            <th>Topic selected</th>
            <th>Contributors</th>
            <th>Reviewed by</th>
            <th>Add reviewer</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.topic}</td>
              <td>
              {row.contributors.map((contributor, idx) => (
                <div key={idx}>
                  {contributor.name} ({contributor.username})
                </div>
              ))}
              </td>
              <td>
                {row.reviewers.length > 0 ? (
                  row.reviewers.map((reviewer, idx) => (
                    <div key={idx}>
                      {reviewer.name} - Review status: {reviewer.status}
                      {reviewer.status === "Submitted" && (
                        <span
                          className="unsubmit-link"
                          onClick={() => handleUnsubmit(row.topic, reviewer.name)}
                        >
                          {" ("}Unsubmit{")"}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <span>No reviewers assigned</span>
                )}
              </td>
              <td>
                <button
                  /*Styling of this button will be updated in future */
                  className="add-reviewer-button"
                  onClick={() => openModal(row.topic, row.contributors)}
                >
                  Add reviewer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding a reviewer */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add reviewer</h3>
            <p>Topic: {selectedTopic}</p>
            <p>Contributors: {selectedContributors.join(", ")}</p>
            <input
              type="text"
              placeholder="Enter user login"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleAddReviewer}
              className="submit-button"
            >
              Add reviewer
            </button>
            <button
              onClick={closeModal}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignReviewer;
