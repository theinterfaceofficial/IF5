import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getId } = useAuth();
  const userId = getId();

  const getStatusBadge = (status) => {
    switch (status) {
      case "UnderReview":
        return (
          <div className="badge badge-warning gap-2">
            <Clock size={16} /> Under Review
          </div>
        );
      case "Approved":
        return (
          <div className="badge badge-success gap-2">
            <CheckCircle size={16} /> Approved
          </div>
        );
      case "Rejected":
        return (
          <div className="badge badge-error gap-2">
            <XCircle size={16} /> Rejected
          </div>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/client-users/${userId}/documents`
      );
      setDocuments(response.data.documents);
    } catch (error) {
      alert("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete(
          `${GlobalConfig.apiUrl}/v1/client-users/${userId}/documents/${documentId}`
        );
        setDocuments(documents.filter((doc) => doc.id !== documentId));
        alert("Document deleted successfully.");
      } catch (error) {
        alert("Failed to delete the document.");
      }
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <DashboardPage title="My Documents">
      <h1 className="text-3xl font-bold mb-6">My Documents</h1>

      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>No documents found.</span>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              className="card bg-base-100/50 border border-primary"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <div className="card-body">
                <div className="flex items-center space-x-4 mb-2">
                  <FileText size={28} className="text-primary" />
                  <h2 className="card-title text-lg font-semibold">
                    {doc.fileName}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Type: {doc.documentTypeName}
                </p>
                <p className="text-sm text-gray-500">
                  Size: {formatFileSize(doc.fileSize)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  Status: {getStatusBadge(doc.documentStatus)}
                </div>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <a
                    href={`/documents/${doc.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary btn-outline"
                  >
                    <Download size={16} />
                    View
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </DashboardPage>
  );
}
