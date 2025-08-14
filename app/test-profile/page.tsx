"use client";

import React from "react";
import { ProfileForm } from "@/components/profile-form";
import type { User } from "@/types/user";

// Mock user data for testing
const mockUserAdmin: Partial<User> = {
  id: "1",
  fullName: "John Admin",
  email: "admin@company.com",
  bio: "Administrator with full permissions",
  avatar: "/Avatar1.png",
  role: {
    id: "1",
    name: "admin_empresa",
    description: "Company Administrator"
  },
  company: {
    id: "1",
    name: "Test Company",
    company_type: "Technology",
    address: "123 Main St",
    city: "Test City",
    state: "Test State",
    postal_code: "12345",
    country: "Test Country",
    description: "A test company",
    createdAt: new Date().toISOString()
  },
  createdAt: new Date().toISOString()
};

const mockUserRegular: Partial<User> = {
  id: "2",
  fullName: "Jane User",
  email: "user@company.com",
  bio: "Regular user with limited permissions",
  avatar: "/Professional1.png",
  role: {
    id: "2",
    name: "regular_user",
    description: "Regular User"
  },
  company: {
    id: "1",
    name: "Test Company",
    company_type: "Technology",
    address: "123 Main St",
    city: "Test City", 
    state: "Test State",
    postal_code: "12345",
    country: "Test Country",
    description: "A test company",
    createdAt: new Date().toISOString()
  },
  createdAt: new Date().toISOString()
};

export default function TestProfileForm() {
  const [selectedUserType, setSelectedUserType] = React.useState<"admin" | "regular">("admin");
  
  const userData = selectedUserType === "admin" ? mockUserAdmin : mockUserRegular;

  const handleSave = async (data: Partial<User>) => {
    console.log("Saving user data:", data);
    alert("User data saved! Check console for details.");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profile Form Test</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedUserType("admin")}
          className={`px-4 py-2 rounded ${
            selectedUserType === "admin" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Test as Admin (admin_empresa)
        </button>
        <button
          onClick={() => setSelectedUserType("regular")}
          className={`px-4 py-2 rounded ${
            selectedUserType === "regular" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Test as Regular User
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Testing as: {selectedUserType === "admin" ? "Admin User" : "Regular User"}
        </h2>
        <p className="text-sm text-gray-600">
          Role: {userData.role?.name} | 
          Expected behavior: {selectedUserType === "admin" 
            ? "Full form editing + avatar selection" 
            : "Only avatar selection, other fields disabled"}
        </p>
      </div>

      <ProfileForm
        initialData={userData}
        onSave={handleSave}
        isLoading={false}
        title="Test Profile Form"
        description="Testing avatar selector and role-based permissions"
        mockUser={userData as User}
      />
    </div>
  );
}