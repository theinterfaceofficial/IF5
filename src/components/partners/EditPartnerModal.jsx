import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect } from "react";
import Modal from "../Modal.jsx";

const ALL_PERMISSIONS = [
  "Locations_View",
  "Locations_Edit",
  "Nationalities_View",
  "Nationalities_Edit",
  "IncomeTypes_View",
  "IncomeTypes_Edit",
  "ExpenseTypes_View",
  "ExpenseTypes_Edit",
  "Expenses_View",
  "Expenses_Edit",
  "Incomes_View",
  "Incomes_Edit",
  "UniversityTypes_View",
  "UniversityTypes_Edit",
  "ProgramTypes_View",
  "ProgramTypes_Edit",
  "DocumentTypes_View",
  "DocumentTypes_Edit",
  "Employees_View",
  "Employees_Edit",
  "Currencies_View",
  "Currencies_Edit",
  "Students_View",
  "Students_Edit",
  "Students_Own_View",
  "Partners_View",
  "Partners_Edit",
  "ImmigrationClients_View",
  "ImmigrationClients_Edit",
  "ImmigrationClients_Own_View",
  "Universities_View",
  "Universities_Edit",
  "UniversityPrograms_View",
  "UniversityPrograms_Edit",
  "Finances_Overview",
  "Client_Documents_View",
  "Client_Documents_Edit",
  "Client_Documents_Upload",
  "UniversityApplications_Edit",
  "UniversityApplications_View",
  "UniversityApplications_View_Own",
  "VisaApplications_Edit",
  "VisaApplications_View",
  "VisaApplications_View_Own",
  "VisaApplicationTypes_Edit",
  "VisaApplicationTypes_View",
  "Portal_Overview",
  "Users_Overview",
  "Documents_Own_View",
  "Documents_Own_Edit",
  "ClientSources_View",
  "ClientSources_Edit",
];

// Extend the schema to include permissions as an array of strings
const editPartnerSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().optional(),
  isActive: z.boolean(),
  permissions: z.array(z.string()).default([]),
});

export default function EditPartnerModal({ partner, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(editPartnerSchema),
    defaultValues: {
      email: partner?.email || "",
      firstName: partner?.firstName || "",
      lastName: partner?.lastName || "",
      phoneNumber: partner?.phoneNumber || "",
      isActive: partner?.isActive ?? true,
      permissions: partner?.permissions
        ? partner.permissions
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p !== "None" && p !== "All")
        : [],
    },
  });

  useEffect(() => {
    if (partner) {
      reset({
        email: partner.email,
        firstName: partner.firstName,
        lastName: partner.lastName,
        phoneNumber: partner.phoneNumber,
        isActive: partner.isActive,
        permissions: partner.permissions
          ? partner.permissions
              .split(",")
              .map((p) => p.trim())
              .filter((p) => p !== "None" && p !== "All")
          : [],
      });
    }
  }, [partner, reset]);

  const onSubmit = async (data) => {
    try {
      const permissionsToSend =
        data.permissions.length > 0 ? data.permissions.join(",") : "None";

      const payload = {
        ...data,
        permissions: permissionsToSend,
      };

      await api.put(
        `${GlobalConfig.apiUrl}/v1/partners/${partner.id}`,
        payload
      );
      alert("Partner updated successfully!");
      reset(payload);
      onClose(true);
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.keys(serverErrors).forEach((key) => {
          const fieldName = key.toLowerCase().includes("email") ? "email" : key;
          setError(fieldName, {
            type: "server",
            message: serverErrors[key].join(", "),
          });
        });
      } else {
        console.error("Error updating partner:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete partner ${partner.firstName} ${partner.lastName}?`
    );
    if (!confirmed) return;

    try {
      await api.delete(`${GlobalConfig.apiUrl}/v1/partners/${partner.id}`);
      alert("Partner deleted successfully!");
      reset();
      onClose(true);
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Failed to delete partner. Please try again later.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="modal-box flex flex-col gap-4 border border-primary"
      >
        <h2 className="text-lg font-bold">
          Edit Partner: {partner?.firstName} {partner?.lastName}
        </h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="input w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="input w-full"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="input w-full"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number (optional)</span>
          </label>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register("phoneNumber")}
            className="input w-full"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Permissions</span>
          </label>
          <div className="border p-3 rounded-md">
            {ALL_PERMISSIONS.map((permission) => (
              <label key={permission} className="label gap-2">
                <input
                  type="checkbox"
                  value={permission}
                  {...register("permissions")}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">
                  {permission.replace(/_/g, " ")}
                </span>
              </label>
            ))}
          </div>
          {errors.permissions && (
            <p className="text-red-500 text-sm">{errors.permissions.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Is Active?</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register("isActive")}
            />
          </label>
          {errors.isActive && (
            <p className="text-red-500 text-sm">{errors.isActive.message}</p>
          )}
        </div>
        <div className="modal-action justify-between">
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onDelete}
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-outline"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-outline">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
