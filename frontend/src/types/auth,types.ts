export type User ={
    id: number;
    google_id: string;
    full_name : string;
    email : string;
    avatar_url : string | null;
    created_at : string;
    updated_at : string;
};


export type UserAuthContextType= {
    user : User | null;
    loading : boolean;
    isAuthenticated : boolean;
    checkAuth : ()=>Promise<void>;
    logout : ()=>Promise<void>;
};