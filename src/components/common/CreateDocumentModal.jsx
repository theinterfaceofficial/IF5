import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base.js";
import Modal from "../Modal.jsx"; // Assuming path

const documentSchema = z.object({
  //   fileName: z.string().min(1, "File Name is required"),
  description: z.string().optional(),
  documentTypeId: z.string().min(1, "Document Type is required"),
  // We'll handle the actual file object separately, not directly in Zod for simplicity of basic input
});

export default function CreateDocumentModal({
  studentId,
  documentTypes,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(documentSchema),
  });

  const onSubmit = async (data) => {
    // For file uploads, typically you'd use FormData.
    // Assuming your API expects multipart/form-data for file uploads.
    // The backend will handle S3Key and FileSize from the uploaded file.
    const formData = new FormData();
    // formData.append("FileName", data.fileName);
    formData.append("Description", data.description || "");
    formData.append("DocumentTypeId", data.documentTypeId);

    // Get the file from the input. Assuming a single file input named 'file'
    const fileInput = document.getElementById("file-upload-input"); // Get input by ID
    if (fileInput && fileInput.files[0]) {
      formData.append("File", fileInput.files[0]); // Append the actual file
    } else {
      setError("file", { type: "manual", message: "File is required." });
      return;
    }

    try {
      await api.post(
        `${GlobalConfig.apiUrl}/v1/client-users/${studentId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      alert("Document created successfully!");
      reset();
      onClose(true); // Close modal and refresh parent list
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        alert("An unexpected error occurred. Please try again later.");
        console.error("Error creating document:", error);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box border border-primary flex flex-col gap-4"
      >
        <h2 className="font-bold text-lg">Create Document</h2>
        {/* <div className="form-control">
          <input
            type="text"
            placeholder="File Name"
            {...register("fileName")}
            className="input w-full"
          />
          {errors.fileName && (
            <p className="text-red-500 text-sm">{errors.fileName.message}</p>
          )}
        </div> */}

        <div className="form-control">
          <input
            type="file"
            id="file-upload-input" // Add an ID to easily access the file input
            className="file-input file-input-bordered w-full"
          />
          {errors.file && (
            <p className="text-red-500 text-sm">{errors.file.message}</p>
          )}
        </div>

        <div className="form-control">
          <textarea
            placeholder="Description (optional)"
            {...register("description")}
            className="textarea w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="form-control">
          <select
            {...register("documentTypeId")}
            className="select select-bordered w-full"
          >
            <option value="">Select Document Type</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.documentTypeId && (
            <p className="text-red-500 text-sm">
              {errors.documentTypeId.message}
            </p>
          )}
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary btn-outline"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-outline">
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
