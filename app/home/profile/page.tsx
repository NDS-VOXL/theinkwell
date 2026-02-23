"use client";
import { useProfile } from "@/app/profile/profileContent"; // Ensure correct path
import {
  Bookmark,
  BookOpen,
  ExternalLink,
  FileText,
  FolderOpen,
  Pencil,
  Plus,
  Share2,
  TrendingUp,
  Users,
  X,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const highlights = [
  { icon: TrendingUp, text: <>Your articles engagements went up by <strong>2%</strong> yesterday</> },
  { icon: Users, text: <>Your profile gained <strong>14</strong> new followers</> },
  { icon: Users, text: <>Your profile gained <strong>14</strong> new followers</> },
  { icon: Share2, text: <>Your post where shared by <strong style={{ color: "#00897B" }}>62</strong> new people</> },
];

const quickActions = [
  { label: "Create New Project", icon: ExternalLink },
  { label: "Create New Article", icon: FileText },
  { label: "My Drafts", icon: FolderOpen },
  { label: "Saved Articles", icon: Bookmark },
  { label: "My Articles", icon: BookOpen },
];

const categories = ["Health & Lifestyle", "Sports", "Entertainment"];

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProfilePage() {
  // 🟢 1. Initialize links as an empty array! 
  // We add TypeScript typing so it knows what shape the objects should be.
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // Global State & Refs
  const { user, updateUser } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bio Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempBio, setTempBio] = useState(user.bio);

  // Link Modal States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempPlatform, setTempPlatform] = useState("");
  const [tempUrl, setTempUrl] = useState("");

  // ─── Logic Handlers ───
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUser({ avatar: url }); 
    }
  };

  const handleSaveBio = () => {
    updateUser({ name: tempName, bio: tempBio });
    setIsModalOpen(false);
  };

  const handleOpenAddLink = () => {
    setEditingIdx(null); // Null means Add
    setTempPlatform("");
    setTempUrl("");
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (index: number) => {
    setEditingIdx(index); // Index means Edit
    setTempPlatform(links[index].platform);
    setTempUrl(links[index].url);
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = () => {
    if (!tempPlatform.trim() || !tempUrl.trim()) return;

    if (editingIdx !== null) {
      const newLinks = [...links];
      newLinks[editingIdx] = { platform: tempPlatform, url: tempUrl };
      setLinks(newLinks);
    } else {
      setLinks([...links, { platform: tempPlatform, url: tempUrl }]);
    }
    setIsLinkModalOpen(false);
  };

  const handleDeleteLink = () => {
    if (editingIdx !== null) {
      const newLinks = links.filter((_, i) => i !== editingIdx);
      setLinks(newLinks);
      setIsLinkModalOpen(false);
    }
  };

  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet" />

      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />

      <p style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 20 }}>Your Profile</p>

      {/* ── Top Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 16 }}>
        
        {/* Profile Card */}
        <div>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 18 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 92, height: 92, borderRadius: 18, overflow: "hidden", background: "linear-gradient(145deg, #d4a843 0%, #5a9e6f 50%, #2d6e8a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image src={user.avatar} alt="User Profile" width={92} height={92} className="object-cover w-full h-full" />
              </div>

              <div onClick={() => fileInputRef.current?.click()} style={{ position: "absolute", bottom: -5, right: -5, width: 26, height: 26, background: "#00897B", borderRadius: "50%", border: "2px solid #F5F3EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              </div>
            </div>

            <div style={{ paddingTop: 6 }}>
              <p style={{ fontWeight: 900, fontSize: 20, color: "#111", marginBottom: 3 }}>{user.name}</p>
              <p style={{ fontWeight: 300, fontSize: 12, color: "#777", marginBottom: 14 }}>{user.bio}</p>

              <button
                onClick={() => {
                  setTempName(user.name);
                  setTempBio(user.bio);
                  setIsModalOpen(true);
                }}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 22px", borderRadius: 30, border: "1.5px solid #bbb", background: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#222" }}
              >
                Edit bio <Pencil size={12} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "left", paddingTop: 14, marginBottom: 16 }}>
            {[["50", "Following"], ["4.7k", "Followers"], ["3k", "New Profile Views"], ["671k", "Likes"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p style={{ fontWeight: 900, fontSize: 14, color: "#111", marginBottom: 2 }}>{val}</p>
                <p style={{ fontWeight: 400, fontSize: 9, color: "#999", lineHeight: 1.3 }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #e2dcd2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#333" }}>Your Categories</p>
              <Pencil size={11} color="#aaa" style={{ cursor: "pointer" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {categories.map((c) => (
                <span key={c} style={{ background: "#00897B", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 8px", borderRadius: 20 }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Public Links Card */}
        <div style={{ ...card, background: "#FFFF", alignItems: "center", justifyItems: "center" }}>
          <p style={{ fontWeight: 900, fontSize: 14, color: "#111", marginBottom: 14 }}>Public Links</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", alignItems: "center" }}>
            {/* 🟢 Empty State Handling */}
            {links.length === 0 ? (
              <p style={{ fontSize: 11, color: "#999", fontStyle: "italic", textAlign: "center", width: "100%" }}>
                No links added yet.
              </p>
            ) : (
              links.map((l, i) => (
                <div key={i} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <p style={{ fontWeight: 700, fontSize: 11, color: "#333" }}>{l.platform}</p>
                    <Pencil size={11} color="#888" style={{ cursor: "pointer" }} onClick={() => handleOpenEditLink(i)} />
                  </div>
                  <p style={{ fontSize: 10, color: "#00897B", fontWeight: 400, wordBreak: "break-all" }}>{l.url}</p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleOpenAddLink}
            style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 20, border: "1px solid #ccc", background: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#333" }}
          >
            Add link <Plus size={12} />
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          {quickActions.map(({ label, icon: Icon }) => (
            <button key={label} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 30, border: "1px solid #d8d4cc", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#444", whiteSpace: "nowrap", width: "fit-content" }}>
              {label} <Icon size={14} color="#aaa" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Highlights ── */}
      <div>
        <p style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 12 }}>Your Highlights</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {highlights.map(({ icon: Icon, text }, i) => (
            <div key={i} style={{ ...card, display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#00897B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color="#fff" />
              </div>
              <p style={{ fontSize: 11, color: "#444", fontWeight: 400, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── EDIT BIO MODAL ── */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "#FDFBF7", padding: 32, borderRadius: 24, width: "100%", maxWidth: 400, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: 20, color: "#111" }}>Edit Profile</h3>
              <X size={20} color="#888" style={{ cursor: "pointer" }} onClick={() => setIsModalOpen(false)} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>Full Name</label>
              <input value={tempName} onChange={(e) => setTempName(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #ddd", outline: "none", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>Your Bio</label>
              <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #ddd", outline: "none", fontSize: 14, resize: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={handleSaveBio} style={{ width: "100%", padding: 16, backgroundColor: "#00897B", color: "#fff", borderRadius: 30, border: "none", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>Save Changes</button>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT LINK MODAL ── */}
      {isLinkModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 110, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "#FDFBF7", padding: 32, borderRadius: 24, width: "100%", maxWidth: 400, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: 20, color: "#111" }}>
                {editingIdx !== null ? "Edit Link" : "Add New Link"}
              </h3>
              <X size={20} color="#888" style={{ cursor: "pointer" }} onClick={() => setIsLinkModalOpen(false)} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>Platform Name</label>
              <input value={tempPlatform} onChange={(e) => setTempPlatform(e.target.value)} placeholder="e.g. LinkedIn" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #ddd", outline: "none", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>URL</label>
              <input value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} placeholder="https://" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #ddd", outline: "none", fontSize: 14, boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {editingIdx !== null && (
                <button 
                  onClick={handleDeleteLink} 
                  style={{ flex: 1, padding: 16, backgroundColor: "#fee2e2", color: "#ef4444", borderRadius: 30, border: "none", fontWeight: 900, cursor: "pointer", fontSize: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
              
              <button onClick={handleSaveLink} style={{ flex: 2, padding: 16, backgroundColor: "#00897B", color: "#fff", borderRadius: 30, border: "none", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
                {editingIdx !== null ? "Update Link" : "Add Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  borderRadius: 16,
  padding: "18px 20px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};