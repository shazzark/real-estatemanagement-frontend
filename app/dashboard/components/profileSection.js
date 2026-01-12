"use client";

import { useState } from "react";
import { User, Mail, Phone, Camera } from "lucide-react";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    role: "Premium Agent",
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    // In a real app, make API call here
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload to server
      console.log("Photo selected:", file.name);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Profile Information
        </h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 rounded-full bg-secondary mb-4 flex items-center justify-center">
          <User size={48} className="text-muted-foreground" />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer">
              <Camera size={16} className="text-primary-foreground" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Click camera icon to upload photo"
            : "Upload profile photo from edit mode"}
        </p>
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <div className="flex items-center">
            <User size={20} className="text-muted-foreground mr-3" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="flex items-center">
            <Mail size={20} className="text-muted-foreground mr-3" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <div className="flex items-center">
            <Phone size={20} className="text-muted-foreground mr-3" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-border rounded-md bg-background disabled:opacity-50"
          >
            <option value="User">User</option>
            <option value="Agent">Agent</option>
            <option value="Premium Agent">Premium Agent</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(userData);
              }}
              className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
