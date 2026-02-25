import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaIdBadge, FaCamera, FaEdit } from 'react-icons/fa';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    profile_image: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('AccessToken');
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        debugger;
        const response = await axios.get("http://127.0.0.1:5000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        // toast.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('AccessToken');

    const formData = new FormData();
    formData.append('username', profile.username);
    formData.append('email', profile.email);
    
    if (selectedImage) {
      formData.append('profile_image', selectedImage);
    }

    try {
      const response = await axios.put("http://127.0.0.1:5000/api/profile/", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Profile updated successfully!");
      
      // Update state and localStorage with the new image URL
      if (response.data.profile_image) {
        setProfile(prev => ({ ...prev, profile_image: response.data.profile_image }));
        localStorage.setItem('profile_image', response.data.profile_image);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="profile-container">

      {/* Cover Section */}
      <div className="profile-cover">
        <div className="profile-image-wrapper">
          <img
            src={profile.profile_image}
            alt="profile"
            className="profile-image"
          />
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div>
            <h2><FaUser style={{ marginRight: '8px' }} /> {profile.username || "User"}</h2>
            <p className="role"><FaIdBadge style={{ marginRight: '8px' }} /> {profile.role || "Role"}</p>
            <p className="email"><FaEnvelope style={{ marginRight: '8px' }} /> {profile.email}</p>
          
          </div>
          <button className="edit-btn" onClick={() => setIsOpen(true)}>
            <FaEdit style={{ marginRight: '5px' }} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <form className="edit-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="username" 
                value={profile.username} 
                onChange={handleChange} 
                placeholder="Full Name" 
                required 
              />
              <input 
                type="text" 
                name="role" 
                value={profile.role} 
                readOnly 
                disabled 
                placeholder="Role" 
              />
              <input 
                type="email" 
                name="email" 
                value={profile.email} 
                onChange={handleChange} 
                placeholder="Email" 
                required 
              />

              
              <label style={{fontSize: '14px', fontWeight: 'bold', marginTop: '10px'}}><FaCamera style={{ marginRight: '5px' }} /> Profile Picture</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
              />

              <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
