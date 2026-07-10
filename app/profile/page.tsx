"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Package,
  ShoppingBag,
  LogOut,
  Edit2,
  Camera,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Key,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import Navbar from "@/components/Navbar";
import { getDatabase, ref, get, update } from "firebase/database";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";

export default function ProfilePage() {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "">("");
  const [showToast, setShowToast] = useState(false);

  // Fetch user data function
  const fetchUserData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.name) {
          setUserName(userData.name);
          setDisplayName(userData.name);
        } else {
          setUserName("Not set");
          setDisplayName(user.displayName || "Not set");
        }
      } else {
        setUserName("Not set");
        setDisplayName(user.displayName || "Not set");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserName("Not set");
      setDisplayName(user.displayName || "Not set");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // If no user, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // User is authenticated, fetch data
    fetchUserData();
  }, [user, authLoading, router]);

  // Toast function
  const showCustomToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Update name in Firebase RTDB
      const db = getDatabase();
      const userRef = ref(db, `users/${user?.uid}`);
      await update(userRef, { name: displayName });

      // Update display name in Firebase Auth
      if (user) {
        await updateProfile(user, { displayName: displayName });
        // Force refresh user object
        await user.reload();
      }

      // Update local state
      setUserName(displayName);
      
      // Show success toast
      showCustomToast("✅ Profile updated successfully!", "success");
      
      // Close edit mode
      setEditMode(false);

    } catch (err: any) {
      console.error("Update profile error:", err);
      showCustomToast("❌ Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Validate passwords in real-time
  const validatePasswords = () => {
    // Check if new password is same as old password
    if (oldPassword && newPassword && oldPassword === newPassword) {
      setPasswordError("New password must be different from Current password");
      return false;
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password must be same");
      return false;
    }

    if (newPassword && newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    if (
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      newPassword.length >= 6
    ) {
      // Check if new password is same as old password again
      if (oldPassword && oldPassword === newPassword) {
        setPasswordError(
          "New password must be different from Current password",
        );
        return false;
      }
      setPasswordError("");
      return true;
    }

    setPasswordError("");
    return true;
  };

  // Validate on change
  useEffect(() => {
    if (newPassword || confirmPassword || oldPassword) {
      validatePasswords();
    }
  }, [newPassword, confirmPassword, oldPassword]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (oldPassword && newPassword && oldPassword === newPassword) {
      setPasswordError("New password must be different from Current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password must be same");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      // Re-authenticate user
      if (!user?.email) {
        showCustomToast("❌ No email found for this account", "error");
        setPasswordLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Close modal first
      setShowChangePassword(false);
      
      // Reset password fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");

      // Show success toast after modal is closed
      setTimeout(() => {
        showCustomToast("✅ Password changed successfully!", "success");
      }, 300);

      // Hide toast and redirect to login after 2 seconds
      setTimeout(async () => {
        setShowToast(false);
        await logout();
        router.push("/login");
      }, 2500);

    } catch (err: any) {
      // Handle Firebase errors with custom messages
      if (err.code === "auth/wrong-password") {
        showCustomToast("❌ Current password is incorrect", "error");
      } else if (err.code === "auth/requires-recent-login") {
        showCustomToast("❌ Please login again to change password", "error");
      } else if (err.code === "auth/too-many-requests") {
        showCustomToast(
          "❌ Too many attempts. Please try again later",
          "error",
        );
      } else {
        showCustomToast(
          "❌ Old Password is incorrect",
          "error",
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Check if passwords are valid
  const isPasswordValid = () => {
    if (!oldPassword || !newPassword || !confirmPassword) return false;
    if (oldPassword === newPassword) return false;
    if (newPassword !== confirmPassword) return false;
    if (newPassword.length < 6) return false;
    return true;
  };

  // Show loading state while auth is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              {authLoading ? "Loading..." : "Loading profile..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      label: "Total Orders",
      value: "0",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Cart Items",
      value: cartItems.length.toString(),
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`fixed top-4 right-4 z-[9999] px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            } text-white max-w-sm`}
          >
            <span className="text-lg">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account details and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - User Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  {userName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {isAdmin && (
                  <span className="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Admin
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 border-t border-border pt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
                <Link
                  href="/orders"
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-lg shadow-lg p-4 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Edit Profile Form */}
            {editMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card rounded-lg shadow-lg p-6 border border-border"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Edit Profile
                  </h3>
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 border border-border rounded-lg cursor-not-allowed opacity-70"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-lg shadow-lg p-6 border border-border"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground font-medium">
                    {userName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground font-medium">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="text-foreground font-medium">
                    {isAdmin ? "Administrator" : "Customer"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-foreground font-medium">
                    {user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Orders Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-lg shadow-lg p-6 border border-border"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Orders
                </h3>
                <Link
                  href="/orders"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
                <Link
                  href="/products"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Start Shopping
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowChangePassword(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Change Password
                </h3>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordError("");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        if (newPassword && e.target.value === newPassword) {
                          setPasswordError(
                            "New password must be different from Current password",
                          );
                        }
                      }}
                      className={`w-full px-4 pr-12 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        oldPassword &&
                        newPassword &&
                        oldPassword === newPassword
                          ? "border-red-500"
                          : "border-border"
                      }`}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {/* Show error if old and new password are same */}
                  {oldPassword &&
                    newPassword &&
                    oldPassword === newPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span className="inline-block w-full h-0.5 bg-red-500"></span>
                        <span>
                          New password must be different from Current password
                        </span>
                      </p>
                    )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        // Check if new password matches old password
                        if (oldPassword && e.target.value === oldPassword) {
                          setPasswordError(
                            "New password must be different from Current password",
                          );
                        } else if (
                          confirmPassword &&
                          e.target.value !== confirmPassword
                        ) {
                          setPasswordError(
                            "New password and confirm password must be same",
                          );
                        } else if (
                          e.target.value.length < 6 &&
                          e.target.value.length > 0
                        ) {
                          setPasswordError(
                            "Password must be at least 6 characters",
                          );
                        } else {
                          setPasswordError("");
                        }
                      }}
                      className={`w-full px-4 pr-12 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        (passwordError && newPassword) ||
                        (oldPassword &&
                          newPassword &&
                          oldPassword === newPassword)
                          ? "border-red-500"
                          : "border-border"
                      }`}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {/* Show error if old and new password are same */}
                  {oldPassword &&
                    newPassword &&
                    oldPassword === newPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span className="inline-block w-full h-0.5 bg-red-500"></span>
                        <span>
                          New password must be different from Current password
                        </span>
                      </p>
                    )}
                  {newPassword &&
                    newPassword.length < 6 &&
                    oldPassword !== newPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span className="inline-block w-full h-0.5 bg-red-500"></span>
                        <span>Password must be at least 6 characters</span>
                      </p>
                    )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (newPassword) {
                          if (e.target.value !== newPassword) {
                            setPasswordError(
                              "New password and confirm password must be same",
                            );
                          } else if (
                            oldPassword &&
                            newPassword === oldPassword
                          ) {
                            setPasswordError(
                              "New password must be different from Current password",
                            );
                          } else if (newPassword.length < 6) {
                            setPasswordError(
                              "Password must be at least 6 characters",
                            );
                          } else {
                            setPasswordError("");
                          }
                        }
                      }}
                      className={`w-full px-4 pr-12 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        passwordError && confirmPassword
                          ? "border-red-500"
                          : "border-border"
                      }`}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {/* Show error if passwords don't match */}
                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <span className="inline-block w-full h-0.5 bg-red-500"></span>
                        <span>
                          New password and confirm password must be same
                        </span>
                      </p>
                    )}
                  {/* Show success when passwords match */}
                  {newPassword &&
                    confirmPassword &&
                    newPassword === confirmPassword &&
                    newPassword.length >= 6 &&
                    oldPassword !== newPassword && (
                      <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                        <span className="inline-block w-full h-0.5 bg-green-500"></span>
                        <span>✓ Passwords match</span>
                      </p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordError("");
                      setOldPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading || !isPasswordValid()}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      isPasswordValid() && !passwordLoading
                        ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}