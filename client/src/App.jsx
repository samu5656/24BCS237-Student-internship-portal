
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// const API_URL = (
//   import.meta.env.VITE_API_URL || "http://localhost:5000"
// ).replace(/\/+$/, "");

const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

function Header() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Intern<span>Connect</span>
      </Link>
      <nav>
        <Link to="/">Internships</Link>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}

function InternshipCard({ internship }) {
  return (
    <article className="internship-card">
      <div className="card-top">
        <span className="company-icon">
          {internship.company.charAt(0)}
        </span>
        <span className="tag">{internship.location}</span>
      </div>

      <h3>{internship.title}</h3>
      <p className="company">{internship.company}</p>
      <p className="description">{internship.description}</p>

      <div className="skills">
        {internship.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <div className="card-footer">
        <div>
          <strong>{internship.stipend}</strong>
          <p>{internship.duration}</p>
        </div>
        <Link
          className="button button-outline"
          to={`/internships/${internship.id}`}
        >
          View details →
        </Link>
      </div>
    </article>
  );
}

function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadInternships() {
      try {
        const response = await fetch(`${API_URL}/api/internships`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load internships");
        }

        setInternships(data.internships);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to connect to the server");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInternships();
    return () => controller.abort();
  }, []);

  return (
    <>
      <section className="hero">
        <span className="eyebrow">YOUR CAREER STARTS HERE</span>
        <h1>Find an internship.<br />Build your future.</h1>
        <p>
          Explore opportunities, learn from industry professionals,
          and take the first step towards your dream career.
        </p>
        <a className="button button-primary" href="#opportunities">
          Explore internships ↓
        </a>
        <div className="hero-stats">
          <div><strong>{internships.length}+</strong><span>Opportunities</span></div>
          <div><strong>3</strong><span>Work modes</span></div>
          <div><strong>100%</strong><span>Student focused</span></div>
        </div>
      </section>

      <main id="opportunities" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Explore opportunities</h2>
            <p>Find a role that matches your skills and interests.</p>
          </div>
          <span className="result-count">
            {internships.length} internships
          </span>
        </div>

        {loading && <p className="status">Loading internships...</p>}
        {error && <p className="message error">{error}</p>}

        {!loading && !error && internships.length === 0 && (
          <p className="status">No internships available right now.</p>
        )}

        <div className="internship-grid">
          {internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      </main>
    </>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function loadInternship() {
      try {
        const response = await fetch(
          `${API_URL}/api/internships/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Internship not found");
        }

        setInternship(data.internship);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInternship();
    return () => controller.abort();
  }, [id]);

  if (loading) return <p className="status">Loading details...</p>;

  if (error) {
    return (
      <main className="section">
        <p className="message error">{error}</p>
        <Link className="button button-outline" to="/">Back to internships</Link>
      </main>
    );
  }

  return (
    <main className="section detail-section">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to internships
      </button>

      <article className="detail-card">
        <span className="eyebrow">INTERNSHIP DETAILS</span>
        <span className="company-icon detail-icon">
          {internship.company.charAt(0)}
        </span>
        <h1>{internship.title}</h1>
        <p className="company">{internship.company}</p>
        <p className="description">{internship.description}</p>

        <div className="detail-facts">
          <div><span>Location</span><strong>{internship.location}</strong></div>
          <div><span>Duration</span><strong>{internship.duration}</strong></div>
          <div><span>Stipend</span><strong>{internship.stipend}</strong></div>
        </div>

        <h3>Skills you'll work with</h3>
        <div className="skills">
          {internship.skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>

        <Link
          className="button button-primary apply-link"
          to={`/apply/${internship.id}`}
        >
          Apply for this internship →
        </Link>
      </article>
    </main>
  );
}

function ApplicationForm() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    studentName: "",
    email: "",
    rollNumber: "",
    internshipId: id || "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInternship() {
      try {
        const response = await fetch(`${API_URL}/api/internships`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load internships");
        }

        setInternship(
          data.internships.find((item) => item.id === id) || null
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setMessage({ type: "error", text: err.message });
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadInternship();
    return () => controller.abort();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      form.studentName.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ||
      !form.rollNumber.trim() ||
      !form.internshipId
    ) {
      setMessage({
        type: "error",
        text: "Please enter valid details in every field.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          studentName: form.studentName.trim(),
          email: form.email.trim(),
          rollNumber: form.rollNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Application submission failed");
      }

      setMessage({
        type: "success",
        text: "Application submitted successfully! Your details have been saved.",
      });

      setForm({
        studentName: "",
        email: "",
        rollNumber: "",
        internshipId: id || "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Unable to submit. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="status">Loading application form...</p>;

  if (!internship) {
    return (
      <main className="section">
        <p className="message error">Please select a valid internship.</p>
        <Link to="/" className="button button-outline">Browse internships</Link>
      </main>
    );
  }

  return (
    <main className="section form-section">
      <Link to={`/internships/${internship.id}`} className="back-button">
        ← Back to internship
      </Link>

      <div className="form-card">
        <span className="eyebrow">TAKE THE NEXT STEP</span>
        <h1>Apply for an internship</h1>
        <p className="description">
          Complete your details to apply for {internship.title}.
        </p>

        {message.text && (
          <div className={`message ${message.type}`} role="status" aria-live="polite">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="studentName">Full name</label>
          <input
            id="studentName"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            minLength={2}
            maxLength={100}
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="rollNumber">Roll number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            placeholder="Enter your roll number"
            maxLength={30}
            required
          />

          <label htmlFor="internshipId">Selected internship</label>
          <select
            id="internshipId"
            name="internshipId"
            value={form.internshipId}
            onChange={(event) => {
              const selectedId = event.target.value;
              window.location.assign(`/apply/${selectedId}`);
            }}
            required
          >
            <option value={internship.id}>{internship.title}</option>
          </select>

          <button
            className="button button-primary submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit application →"}
          </button>
        </form>

        <p className="privacy-note">
          Please verify your information before submitting.
        </p>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="section not-found">
      <h1>404 — Page not found</h1>
      <Link className="button button-primary" to="/">Return home</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter
    basename={
    window.location.pathname.startsWith("/proxy/5173")
      ? "/proxy/5173"
      : "/"
  }>
      <Header />
      <Routes>
        <Route path="/" element={<InternshipList />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer id="about">
        <Link to="/" className="brand">Intern<span>Connect</span></Link>
        <p>Connecting students with opportunities to grow.</p>
        <small>Student Internship Portal</small>
      </footer>
    </BrowserRouter>
  );
}
