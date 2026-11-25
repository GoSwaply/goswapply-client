"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Copy,
  Share2,
  Lock,
  Bell,
  CreditCard,
  Camera,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useAuthStore } from "@/store/auth";
import { authAPI, referralAPI } from "@/lib/api";
import NotificationPreferencesPanel from "@/components/NotificationPreferences";

export default function ProfilePage() {
  const { user, updateProfile, uploadProfilePhoto, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    address: user?.address || "",
    state: user?.state || "",
    city: user?.city || "",
  });
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);
  const photoInput = useRef<HTMLInputElement>(null);
  const [referralSummary, setReferralSummary] = useState<{
    referralCount: number;
    rewardsEarnedNaira: number;
    ownQualification: {
      transactions: number;
      requiredTransactions: number;
      spendNaira: number;
      requiredSpendNaira: number;
      qualified: boolean;
    };
  } | null>(null);

  useEffect(() => {
    let active = true;
    referralAPI.getSummary()
      .then(({ data }) => { if (active) setReferralSummary(data); })
      .catch(() => { if (active) setReferralSummary(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    if (user?.profilePictureUrl) {
      authAPI.getProfilePhoto().then(({ data }) => {
        objectUrl = URL.createObjectURL(data);
        if (active) setPhotoUrl(objectUrl);
      }).catch(() => {
        if (active) setPhotoUrl(null);
      });
    } else {
      setPhotoUrl(null);
    }
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user?.profilePictureUrl, photoVersion]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    event.target.value = "";
    if (!photo) return;
    if (!photo.type.startsWith("image/") || photo.size > 5 * 1024 * 1024) {
      toast.error("Choose an image no larger than 5 MB");
      return;
    }
    try {
      await uploadProfilePhoto(photo);
      setPhotoVersion((version) => version + 1);
      toast.success("Profile photo updated");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Could not upload profile photo");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleSetPin = async () => {
    if (newPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    setIsSettingPin(true);
    try {
      await authAPI.setPin({ pin: newPin, confirm_pin: confirmPin });
      toast.success("Transaction PIN set successfully");
      setShowPinModal(false);
      setNewPin("");
      setConfirmPin("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to set PIN");
    } finally {
      setIsSettingPin(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      toast.success("Referral code copied!");
    }
  };

  const shareReferralLink = () => {
    if (!user?.referral_code) {
      toast.error("Your referral code is not available yet");
      return;
    }
    const link = `${window.location.origin}/register?ref=${user?.referral_code}`;
    if (navigator.share) {
      navigator.share({
        title: "Join Swaply",
        text: "Join Swaply and enjoy seamless payments!",
        url: link,
      });
    } else {
      navigator.clipboard.writeText(link);
      toast.success("Referral link copied!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} isLoading={isLoading}>
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                disabled={isLoading}
                aria-label="Change profile photo"
                className="relative w-20 h-20 rounded-full gradient-gold flex items-center justify-center text-3xl font-bold text-primary-foreground overflow-hidden"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <>{user?.first_name?.[0]}{user?.last_name?.[0]}</>
                )}
                <span className="absolute inset-x-0 bottom-0 flex justify-center bg-black/55 py-1">
                  <Camera className="h-4 w-4 text-white" />
                </span>
              </button>
              <input
                ref={photoInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                    KYC Level {user?.kyc_level || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!isEditing}
                leftIcon={<User className="w-5 h-5" />}
              />
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Email Address"
                value={user?.email || ""}
                disabled
                leftIcon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={!isEditing}
                leftIcon={<Phone className="w-5 h-5" />}
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                leftIcon={<MapPin className="w-5 h-5" />}
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Member Since"
                value={
                  user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : ""
                }
                disabled
                leftIcon={<Calendar className="w-5 h-5" />}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card variant="gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your friend and you earn rewards after they complete 5 successful airtime, data, or electricity payments totaling ₦20,000.
              </p>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                <code className="flex-1 text-lg font-mono text-primary font-bold">
                  {user?.referral_code || "---"}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="p-2 hover:bg-background rounded"
                >
                  <Copy className="w-5 h-5 text-primary" />
                </button>
              </div>
              <Button className="w-full" onClick={shareReferralLink}>
                Share Referral Link
              </Button>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-3 text-center">
                <div>
                  <p className="text-xl font-bold text-foreground">{referralSummary?.referralCount ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">Friends invited</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    ₦{Number(referralSummary?.rewardsEarnedNaira ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Rewards earned</p>
                </div>
              </div>
              {referralSummary?.ownQualification && (
                <div className="space-y-2 rounded-xl border border-border p-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Your qualifying payments</span>
                    <strong>{referralSummary.ownQualification.transactions}/{referralSummary.ownQualification.requiredTransactions}</strong>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, referralSummary.ownQualification.transactions / Math.max(1, referralSummary.ownQualification.requiredTransactions) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Your qualifying spend</span>
                    <strong>₦{Number(referralSummary.ownQualification.spendNaira).toLocaleString()} / ₦{Number(referralSummary.ownQualification.requiredSpendNaira).toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => setShowPinModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">Transaction PIN</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.has_pin ? "Change PIN" : "Set PIN"}
                    </p>
                  </div>
                </div>
                <Shield
                  className={`w-5 h-5 ${
                    user?.has_pin ? "text-green-500" : "text-yellow-500"
                  }`}
                />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Manage alerts
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">Linked Accounts</p>
                    <p className="text-sm text-muted-foreground">
                      Manage bank accounts
                    </p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <NotificationPreferencesPanel />

      <Modal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        title={user?.has_pin ? "Change Transaction PIN" : "Set Transaction PIN"}
      >
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Your transaction PIN is required for all financial operations.
          </p>

          <Input
            label="New PIN"
            type="password"
            placeholder="Enter 4-digit PIN"
            value={newPin}
            onChange={(e) =>
              setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            maxLength={4}
          />

          <Input
            label="Confirm PIN"
            type="password"
            placeholder="Re-enter PIN"
            value={confirmPin}
            onChange={(e) =>
              setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            maxLength={4}
          />

          <Button
            className="w-full"
            size="lg"
            onClick={handleSetPin}
            isLoading={isSettingPin}
          >
            {user?.has_pin ? "Update PIN" : "Set PIN"}
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
