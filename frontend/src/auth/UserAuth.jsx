import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {
    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        async function checkAuth() {
            if (!token) {
                navigate('/login')
                return
            }
            if (!user) {
                try {
                    const res = await axios.get('/users/profile')
                    setUser(res.data.user)
                    setLoading(false)
                } catch (err) {
                    localStorage.removeItem('token')
                    navigate('/login')
                }
            } else {
                setLoading(false)
            }
        }
        checkAuth()
        // eslint-disable-next-line
    }, [])

    if (loading) return null
    return <>{children}</>
}

export default UserAuth