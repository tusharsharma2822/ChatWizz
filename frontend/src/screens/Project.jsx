import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)

    const navigate = useNavigate();

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            setIsModalOpen(false);
            setSelectedUserId(new Set());
            // Notify all project members via socket
            sendMessage('project-updated', { projectId: location.state.project._id });
            // Refresh project data for self
            axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
                setProject(res.data.project);
                setFileTree(res.data.project.fileTree || {});
            });
        }).catch(err => {
            console.log(err);
        });
    }

    // --- FIX: Chat messages real-time and local update ---
    const send = async () => {
        if (!message.trim()) return;
        try {
            // Save to backend
            const res = await axios.post('/projects/messages', {
                projectId: project._id,
                message
            });
            // Emit socket event with the saved message (with sender populated)
            sendMessage('project-message', res.data.message);
            setMessage("");
        } catch (err) {
            console.log(err);
        }
    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {
        // Fetch chat history on mount
        axios.get(`/projects/messages/${project._id}`).then(res => {
            setMessages(res.data.messages);
            setTimeout(() => {
                if (messageBox.current) {
                    messageBox.current.scrollTop = messageBox.current.scrollHeight;
                }
            }, 100);
        });
        const socket = initializeSocket(project._id);
        // Listen for project-updated event
        receiveMessage('project-updated', (data) => {
            if (data.projectId === project._id) {
                axios.get(`/projects/get-project/${project._id}`).then(res => {
                    setProject(res.data.project);
                    setFileTree(res.data.project.fileTree || {});
                });
            }
        });
        // Listen for project-message event
        receiveMessage('project-message', data => {
            setMessages(prevMessages => [...prevMessages, data]);
            setTimeout(() => {
                if (messageBox.current) {
                    messageBox.current.scrollTop = messageBox.current.scrollHeight;
                }
            }, 100);
        });



        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }


        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            console.log(res.data.project)

            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

        return () => {
            // Clean up listeners if needed (optional, based on your socket implementation)
        };
    }, [project._id])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
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
        <main className="h-screen w-screen flex flex-col md:flex-row bg-gray-900">
            {/* Left Panel: Contributors & Actions */}
            <aside className="flex flex-col w-full md:w-80 h-64 md:h-full bg-gray-800 border-b md:border-b-0 md:border-r border-gray-700 min-w-0">
                {/* Top: Add Collaborator */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-lg">Contributors</span>
                    <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded shadow text-base md:text-lg">
                        <i className="ri-add-fill"></i>
                    </button>
                </div>
                {/* Contributors List */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {project.users && project.users.length > 0 ? (
                        project.users.map(user => (
                            <div key={user._id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                                    <i className="ri-user-fill"></i>
                                </div>
                                <span className="text-cyan-100 font-medium text-xs md:text-base break-all">{user.email}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-400 px-4 py-6">No contributors yet.</div>
                    )}
                </div>
                {/* Bottom: Logout */}
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-semibold shadow text-xs md:text-base">
                        <i className="ri-logout-box-r-line mr-2"></i>Logout
                    </button>
                </div>
            </aside>
            {/* Right Panel: Chat */}
            <section className="flex-1 flex flex-col h-full bg-gray-900 min-w-0">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-lg truncate">{project?.name ? `${project.name} Chat` : 'Project Chat'}</span>
                </div>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-2 md:p-6 flex flex-col gap-2 md:gap-3 min-h-0" ref={messageBox}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`max-w-full md:max-w-lg ${msg.sender._id === user._id ? 'ml-auto bg-cyan-700 text-white' : 'bg-gray-800 text-cyan-100'} p-2 md:p-3 rounded-xl shadow text-xs md:text-base break-words`}>
                            <div className="text-xs opacity-70 mb-1">{msg.sender.email}</div>
                            <div className="text-sm">
                                {msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Chat Input */}
                <form className="flex items-center p-2 md:p-4 border-t border-gray-700 bg-gray-800" onSubmit={e => {e.preventDefault(); send();}}>
                    <input
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="flex-1 p-2 md:p-3 rounded-l-xl bg-gray-700 text-cyan-100 placeholder-cyan-400 outline-none border-none text-xs md:text-base"
                        type="text"
                        placeholder="Enter message"
                    />
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 md:px-5 py-2 md:py-3 rounded-r-xl font-bold text-xs md:text-base">
                        <i className="ri-send-plane-fill"></i>
                    </button>
                </form>
            </section>
            {/* Modal for Add Collaborator by Email */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2">
                    <div className="bg-gray-900 p-4 md:p-6 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md relative shadow-2xl border border-gray-800 mx-auto">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-semibold text-cyan-400">Select User(s) to Add</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-cyan-400">
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-60 md:max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-gray-800 ${Array.from(selectedUserId).indexOf(user._id) !== -1 ? 'bg-gray-800' : ''} p-2 flex gap-2 items-center rounded-xl transition`} onClick={() => handleUserClick(user._id)}>
                                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-3 md:p-5 text-white bg-cyan-600 shadow">
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className="font-semibold text-xs md:text-lg text-cyan-200 break-all">{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className="w-full px-4 py-3 bg-cyan-400 text-black rounded-xl hover:bg-cyan-300 shadow-lg font-bold transition text-base">
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project