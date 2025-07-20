



import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "./FireBase";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";




function ReportForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const navigate = useNavigate();

  const submitReport = async (e) => {
    e.preventDefault();
    console.log("Submit clicked with form:", form);

    if (!form.title || !form.description || !form.category) {
      alert("Please fill in all required fields: Title, Description, Category");
      return;
    }

    let coords = null;
    if (navigator.geolocation) {
      try {
        coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.warn("Geolocation denied or unavailable:", error);
              resolve(null); // continue without coords
            }
          );
        });
      } catch (error) {
        console.error("Error getting geolocation:", error);
      }
    }

    try {
      await addDoc(collection(db, "reports"), {
        ...form,
        coordinates: coords,
        timestamp: new Date().toISOString(),
        status: "Pending",
      });
      console.log("Report successfully added to Firestore.");
    } catch (error) {
      console.error("Error adding report:", error);
      alert("Failed to submit report. Please try again.");
      return;
    }

    setForm({ title: "", description: "", category: "", location: "" });
    navigate("/thank-you");
  };

  return (
    <form
      onSubmit={submitReport}
      className="mb-8 bg-gray-100 p-4 rounded shadow"
    >
      <input
        className="block w-full mb-2 p-2 border"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        required
      />
      <textarea
        className="block w-full mb-2 p-2 border"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        required
      />
      <select
        className="block w-full mb-2 p-2 border"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        required
      >
        <option value="">Select Category</option>
        <option value="Lighting">Lighting</option>
        <option value="Vandalism">Vandalism</option>
        <option value="Sidewalk">Sidewalk</option>
        <option value="Traffic">Traffic</option>
      </select>
      <input
        className="block w-full mb-2 p-2 border"
        placeholder="Location (e.g., Detroit)"
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </form>
  );
}

function ThankYou() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-xl mx-auto text-center font-sans">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Thank You!
      </h1>
      <p className="mb-6 text-gray-700">
        Your issue has been submitted successfully.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go Back to Home
      </button>
    </div>
  );
}

function Home() {
  const [reports, setReports] = useState([]);
  const [filterLocation, setFilterLocation] = useState("");

  // Fetch reports once on load
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        CivicLink
      </h1>
      <p className="mb-6">
        Submit and view safety-related civic issues around your area.
      </p>

      <ReportForm />

      {/* Location Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by location (e.g., Detroit)"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Reports List */}
      <h2 className="text-xl font-semibold mb-2">Submitted Reports</h2>
      <div className="space-y-2">
        {reports
          .filter(
            (report) =>
              filterLocation === "" ||
              report.location
                ?.toLowerCase()
                .includes(filterLocation.toLowerCase())
          )
          .map((report) => (
            <div
              key={report.id}
              className="p-3 bg-white rounded shadow border"
            >
              <h3 className="font-bold">{report.title}</h3>
              <p className="text-sm text-gray-600">
                {report.description}
              </p>
              <p className="text-xs text-gray-500">
                Category: {report.category} | Status: {report.status} | Location:{" "}
                {report.location || "N/A"}
              </p>
            </div>
          ))}
      </div>

      {/* Civic Education Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">
          Civic Education
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            You can report local safety issues to your city website or
            311 system.
          </li>
          <li>Attend town halls to raise awareness about problems in your area.</li>
          <li>Students can join youth advisory councils in many cities.</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}


