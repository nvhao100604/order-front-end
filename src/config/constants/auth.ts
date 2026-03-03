export const ROLES = {
    ADMIN: 1,
    STAFF: 2,
    CUSTOMER: 3,
    GUEST: 4,
} as const;

export const PERMISSIONS = {
    // Chỉ Admin mới được vào
    ADMIN_ONLY: [ROLES.ADMIN] as const,

    // Admin và Nhân viên đều vào được (ví dụ: trang quản lý đơn hàng)
    STAFF_AND_ADMIN: [ROLES.ADMIN, ROLES.STAFF] as const,

    // Tất cả người dùng đã đăng nhập
    AUTHENTICATED: [ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER] as const,
} as const;

// Type helper để sử dụng trong code (nếu cần)
export type RoleValue = typeof ROLES[keyof typeof ROLES];