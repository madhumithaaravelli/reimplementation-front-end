import React, { useState } from "react";
import './AssignReviewerStyle.css'; // Import the external CSS

interface Reviewer {
  name: string;
  status: string;
}

interface RowData {
  topic: string;
  contributors: string[];  // Allow multiple contributors
  reviewers: Reviewer[];
}

const data: RowData[] = [
  {
    topic: "Topic A",
    contributors: ["Alice"],
    reviewers: [
      { name: "user1", status: "Submitted" },
    ],
  },
  {
    topic: "Topic B",
    contributors: ["Bob", "Eve"],  // Multiple contributors
    reviewers: [
      { name: "user2", status: "Pending" },
      { name: "user3", status: "Submitted" },
    ],
  },
  {
    topic: "Topic C",
    contributors: ["Charlie"],  // Single contributor
    reviewers: [],
  },
];

const AssignReviewer: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [tableData, setTableData] = useState<RowData[]>(data);

  const openModal = (topic: string, contributors: string[]) => {
    setSelectedTopic(topic);
    setSelectedContributors(contributors);
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
      <table className="assign-reviewer-table">
        <thead>
          <tr>
            <th>Topic Selected</th>
            <th>Contributors</th>
            <th>Reviewed By</th>
            <th>Add Reviewer</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.topic}</td>
              <td>
                {row.contributors.join(", ")}  {/* Display contributors */}
              </td>
              <td>
                {row.reviewers.length > 0 ? (
                  row.reviewers.map((reviewer, idx) => (
                    <div key={idx}>
                      {reviewer.name} - Review Status: {reviewer.status}
                      {reviewer.status === "Submitted" && (
                        <button
                          className="unsubmit-button"
                          onClick={() => handleUnsubmit(row.topic, reviewer.name)}
                        >
                          Unsubmit
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <span>No reviewers assigned</span>
                )}
              </td>
              <td>
                <button
                  className="add-reviewer-button"
                  onClick={() => openModal(row.topic, row.contributors)}
                >
                  Add Reviewer
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
            <h3>Add Reviewer</h3>
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
              Add Reviewer
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
