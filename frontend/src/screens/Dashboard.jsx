import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {

  const { user } = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('');
  const [isUserReady, setIsUserReady] = useState(false);
  const [project, setProject] = useState([])
  const navigate = useNavigate();

  // Wait for user context to be available
  React.useEffect(() => {
    if (user && localStorage.getItem("token")) {
      setIsUserReady(true);
    } else {
      setIsUserReady(false);
    }
  }, [user]);

  // Fetch projects for the logged-in user
  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/all", { headers: { 'Cache-Control': 'no-store' } });
      setProject(res.data.projects || []);
    } catch (err) {
      setProject([]);
    }
  };

  useEffect(() => {
    if (isUserReady) {
      fetchProjects();
    }
  }, [isUserReady]);

  async function createProject(e) {
    e.preventDefault();
    if (!isUserReady) return;
    try {
      await axios.post(
        "/projects/create",
        { name: projectName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setIsModalOpen(false);
      setProjectName("");
      // Fetch projects again after creating a new one
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    try {
      await axios.post("/users/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  return (
    <main className="p-4 min-h-screen bg-black text-cyan-300 font-sans">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
        <div className='projects w-full md:w-3/4'>
          <button 
            onClick={() => isUserReady && setIsModalOpen(true)}
            className={`project w-full md:w-auto p-4 border border-cyan-400 rounded-md px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700${!isUserReady ? ' opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isUserReady}
          >
            Create a New Project
            <i className="ri-link ml-2"></i>
          </button>
          {/* Render project cards below the button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {Array.isArray(project) && project.length > 0 && project.map((project) => (
              <div key={project._id}
                onClick={() => {
                  navigate(`/project`, {
                    state: { project }
                  })
                }}
                className='project flex flex-col gap-2 cursor-pointer p-4 border border-cyan-400 rounded-md min-w-0 bg-gray-900 transition-all duration-200 hover:bg-cyan-900 hover:scale-105 hover:shadow-lg relative'
              >
                <h2 className='font-semibold break-words'>
                  {project.name}
                </h2>
                {/* Person count at bottom-right */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-cyan-300 text-sm bg-black/60 px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.253.714 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.users ? project.users.length : 0}
                </div>
              </div>
            ))}
            {Array.isArray(project) && project.length === 0 && (
              <div className="text-gray-400 mt-8 col-span-full">No projects found.</div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold md:ml-4 self-start"
        >
          Logout
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Create New Project</h2>
            <form onSubmit={createProject}>
              <label className="block mb-2 text-sm font-medium text-cyan-300">
                Project Name
              </label>
              <input
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
                type="text"
                className="w-full px-3 py-2 border border-cyan-400 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default DashBoard