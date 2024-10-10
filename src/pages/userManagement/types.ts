export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    organisationId: string|null;
    email?: string;
    role: string;
    roles: string[];
    phone: string;
    createdBy?: string;
    createdDate?: string;
    updatedBy?: string|null;
    updatedDate?: number;
    key?: string|number;
}

export interface CreateUser {
    firstName: string;
    lastName: string;
    roles?: string[]|undefined;
    phone?: string;
}