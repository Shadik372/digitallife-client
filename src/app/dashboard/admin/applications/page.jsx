"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { authClient } from "../../../../lib/auth-client";
import Heading from "../../../../components/Heading";
import Card from "../../../../components/Card";
import Loading from "../../../../components/Loading";
import Button from "../../../../components/Button";
import toast from "react-hot-toast";

export default function ReviewQueuePage() {
    const { data: session } = authClient.useSession();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, [session]);

    const fetchApplications = async () => {
        if (session?.user?.role !== "admin") return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/applications`, {
                withCredentials: true
            });
            if (res.data.success) {
                setApplications(res.data.applications);
            }
        } catch (err) {
            toast.error("Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecision = async (id, action) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/applications/${id}/${action}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(`Application ${action}d!`);
                // Remove the user from the pending queue instantly
                setApplications(applications.filter(app => app._id !== id));
            }
        } catch (err) {
            toast.error("Action failed");
        }
    };

    if (isLoading) return <Loading fullScreen />;

    return (
        <div className="space-y-8">
            <div>
                <Heading level={2}>📝 Application Queue</Heading>
                <p className="text-[--text-muted] mt-1">Review and approve new seller requests.</p>
            </div>

            <Card className="overflow-hidden border border-[--border]">
                {applications.length === 0 ? (
                    <div className="p-12 text-center text-[--text-muted]">
                        <div className="text-4xl mb-3">☕</div>
                        <h3 className="text-lg font-medium">Inbox Zero!</h3>
                        <p>No pending seller applications to review.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[--bg-secondary] border-b border-[--border]">
                            <tr>
                                <th className="p-4 font-medium text-[--text-muted]">Applicant</th>
                                <th className="p-4 font-medium text-[--text-muted]">Requested On</th>
                                <th className="p-4 font-medium text-[--text-muted] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className="border-b border-[--border] hover:bg-[--bg-secondary]/30">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={app.userId?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId?.name || 'User')}`} alt={app.userId?.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold">{app.userId?.name || "Unknown User"}</div>
                                                <div className="text-xs text-[--text-muted]">{app.userId?.email || "No email"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-[--text-muted]">
                                        {new Date(app.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleDecision(app._id, "reject")}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleDecision(app._id, "approve")}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-green-500 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                        >
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
}