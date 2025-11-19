import { getAuthToken } from "@/lib/auth-utils";

export interface HousekeepingRequest {
  _id: string;
  partnerId: string;
  roomId: string;
  roomName: string;
  userId?: string;
  guest: {
    name: string;
    email?: string;
  };
  type: "custom cleaning" | "item needed";
  cleaningType?: "full room" | "quick refresh" | "custom";
  itemQuantity?: number;
  deliveryDetail?: {
    deliveryMethod: string;
    deliveryWindow: string;
  };
  requestedFor: string;
  status: "new" | "accepted" | "completed" | "no-show" | "canceled";
  priority: "urgent" | "medium" | "low";
  assignee?: {
    name: string;
    staffId: string;
    profilePic?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HousekeepingRequestsResponse {
  success: boolean;
  data?: {
    requests: HousekeepingRequest[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  error?: string;
}

/**
 * Fetch housekeeping requests for partner with optional filters
 */
export async function fetchHousekeepingRequests({
  page = 1,
  limit = 20,
  search,
  status,
  type,
  priority,
  roomId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
  roomId?: string;
}): Promise<HousekeepingRequestsResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (type) queryParams.append("type", type);
    if (priority) queryParams.append("priority", priority);
    if (roomId) queryParams.append("roomId", roomId);

    const response = await fetch(
      `/api/partner/housekeeping-requests?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch housekeeping requests",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching housekeeping requests:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Update housekeeping request status
 */
export async function updateHousekeepingRequestStatus(
  requestId: string,
  status: "new" | "accepted" | "completed" | "no-show" | "canceled"
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `/api/partner/housekeeping-requests/${requestId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to update request status",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating housekeeping request status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Assign staff to housekeeping request
 */
export async function assignStaffToHousekeepingRequest(
  requestId: string,
  assignee: {
    name: string;
    staffId: string;
    profilePic?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `/api/partner/housekeeping-requests/${requestId}/assign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignee }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to assign staff to request",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error assigning staff to housekeeping request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Delete housekeeping request
 */
export async function deleteHousekeepingRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `/api/partner/housekeeping-requests/${requestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to delete request",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting housekeeping request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}