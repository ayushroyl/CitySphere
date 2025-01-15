import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/apiConfig";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [flats, setFlats] = useState([]);
  const [modal, setModal] = useState({ open: false, type: null, item: null });
  const [formData, setFormData] = useState({});
  const [flatPictures, setFlatPictures] = useState([]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: null, id: null });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/accesslogin");
      return;
    }
    fetchData("services");
    fetchData("flat");
  }, []);

  const fetchData = async (type) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/${type}`);
      type === "services" ? setServices(response.data) : setFlats(response.data);
    } catch (err) {
      setError(`Error fetching ${type}: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("You can upload up to 5 pictures.");
    } else {
      setFlatPictures(files);
      setError("");
    }
  };

  const handleModalClose = () => {
    setModal({ open: false, type: null, item: null });
    setFormData({});
    setFlatPictures([]);
    setError("");
  };

  const handleAddEditSubmit = async () => {
    try {
      // Determine the endpoint and URL based on the modal type
      const endpoint =
        modal.type.includes("service")
          ? `${BASE_URL}/api/services`
          : `${BASE_URL}/api/flat`;

      const url = modal.type.startsWith("add")
        ? `${endpoint}/add`
        : `${endpoint}/update/${modal.item._id}`;

      const config = {
        headers: {
          "Content-Type": modal.type.includes("service") ? "application/json" : "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      // Handle Service Submission
      if (modal.type.includes("service")) {
        const { serviceName, description, price } = formData;

        // For Services: JSON data is sufficient
        const serviceData = {
          serviceName,
          description,
          price,
        };

        if (modal.type.startsWith("add")) {
          await axios.post(url, serviceData, config);
        } else {
          await axios.put(url, serviceData, config);
        }
      }

      // Handle Flat Submission (No changes required)
      else if (modal.type.includes("flat")) {
        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));

        if (flatPictures.length > 0) {
          flatPictures.forEach((file) => form.append("flatPictures", file));
        }

        if (modal.type.startsWith("add")) {
          await axios.post(url, form, config);
        } else {
          await axios.put(url, form, config);
        }
      }

      // Refresh data and close the modal
      fetchData(modal.type.includes("service") ? "services" : "flat");
      handleModalClose();
    } catch (err) {
      setError(
        `Error saving ${modal.type.includes("service") ? "service" : "flat"}: ${err.message}`
      );
      navigate("/accesslogin")
    }
  };


  const handleDelete = async (id, type) => {
    const endpoint =
      type === "service" ? `${BASE_URL}/api/services` : `${BASE_URL}/api/flat`;
    const url = `${endpoint}/delete/${id}`;

    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await axios.delete(url, config);
      fetchData(type === "service" ? "services" : "flat");
    } catch (err) {
      setError(`Error deleting ${type === "service" ? "service" : "flat"}: ${err.message}`);
      navigate("/accesslogin");
    }
  };

  const handleConfirmDelete = (id, type) => {
    setConfirmDelete({ open: true, type, id });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, type: null, id: null });
  };

  const renderTable = (data, type) => (
    <table className="w-full bg-white border font-medium rounded-lg text-sm shadow-md">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Description</th>
          <th className="px-6 py-3 text-left">Price</th>
          <th className="px-6 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="border-t">
            <td className="px-6 py-4">{item.flatName || item.serviceName}</td>
            <td className="px-6 py-4">{item.description}</td>
            <td className="px-6 py-4">₹{item.price}</td>
            <td className="px-6 py-4 flex justify-center gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg transform transition duration-300 hover:scale-105"
                onClick={() => setModal({ open: true, type: `edit-${type}`, item })}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg transform transition duration-300 hover:scale-105"
                onClick={() => handleConfirmDelete(item._id, type)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Admin Settings</h1>

      {/* Tab buttons stay fixed on top */}
      <div className="flex justify-center space-x-4 mb-6">
        {["services", "flats"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 ${activeTab === tab ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-800"} rounded-xl text-lg font-medium transition duration-300`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Add button stays fixed */}
      <button
        className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg mb-4 transition transform duration-300 hover:scale-105"
        onClick={() => setModal({ open: true, type: `add-${activeTab}`, item: null })}
      >
        Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </button>

      {/* Error display */}
      {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-6">{error}</div>}

      {/* Scrollable container for tables */}
      <div className="overflow-y-auto max-h-[400px] mb-6">
        {activeTab === "services" ? renderTable(services, "service") : renderTable(flats, "flat")}
      </div>

      {/* Modal for adding/editing entries */}
      {modal.open && (
        <div className="fixed font-medium inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 w-11/12 max-w-lg rounded-3xl shadow-lg animate__animated animate__fadeIn space-y-2">
            <h2 className="text-xl font-semibold">
              {modal.type.startsWith("add") ? "Add" : "Edit"} {modal.type.includes("service") ? "Service" : "Flat"}
            </h2>
            <input
              type="text"
              name={modal.type.includes("service") ? "serviceName" : "flatName"}
              placeholder="Name"
              onChange={handleInputChange}
              defaultValue={modal.item?.flatName || modal.item?.serviceName || ""}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {!modal.type.includes("service") && (
              <>
              <p className="text-green-600">Upload Max 5 Photos (*.jpg, *.jpeg, *.png) only this format</p>
              <input
                type="file"
                multiple
                name="flatPictures"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-lg focus:outline-none"
              />
              </>
            )}
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleInputChange}
              defaultValue={modal.item?.description || ""}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleInputChange}
              defaultValue={modal.item?.price || ""}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl shadow-md transform transition duration-200 hover:scale-105"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg"
                onClick={handleAddEditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for deletion */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-11/12 max-w-md rounded-3xl space-y-6">
            <h3 className="text-xl font-semibold">Are you sure you want to delete this {confirmDelete.type === "service" ? "service" : "flat"}?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-6 py-3 rounded-xl"
                onClick={() => {
                  handleDelete(confirmDelete.id, confirmDelete.type);
                  handleCancelDelete();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;