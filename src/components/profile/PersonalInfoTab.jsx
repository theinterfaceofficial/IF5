import { useState } from "react";

export default function PersonalInfoTab({ initialData }) {
  const [personalInfo, setPersonalInfo] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Updating personal info:", personalInfo);
    } catch (error) {
      console.error("Error updating personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) =>
              setPersonalInfo((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className="input input-bordered w-full"
            placeholder="First Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) =>
              setPersonalInfo((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="input input-bordered w-full"
            placeholder="Last Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) =>
              setPersonalInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            className="input input-bordered w-full"
            placeholder="Email"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) =>
              setPersonalInfo((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="input input-bordered w-full"
            placeholder="Phone"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          value={personalInfo.address}
          onChange={(e) =>
            setPersonalInfo((prev) => ({ ...prev, address: e.target.value }))
          }
          className="textarea textarea-bordered w-full"
          placeholder="Address"
          rows={3}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
