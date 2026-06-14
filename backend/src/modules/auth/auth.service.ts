import { googleClient } from "../../config/google";
import { env } from "../../config/env";
import ApiError from "../../utils/ApiError";
import { RowDataPacket } from "mysql2";
import { db } from "../../config/db";


export const verifyGoogleToken = async (credential: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(401, "Invalid Google token");
  }

  if (!payload.email) {
    throw new ApiError(400, "Google account email not found");
  }

  if (!payload.email_verified) {
    throw new ApiError(401, "Google email is not verified");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    fullName: payload.name || payload.email.split("@")[0],
    profilePicture: payload.picture || null,
  };
};


//onboarding

type StoreRow = {
  id: number;
  user_id : number;
  name : string;
  location: string | null;
  business_type: string | null;
  currency: string;
}& RowDataPacket;

type CountRow = {
  total: number;
} & RowDataPacket;

export type NextStep =  "store" | "categories" | "suppliers" | "products" | "dashboard";

export const getOnboardingStatus = async (userId: number) =>{
   // 1. Check store
  const [stores] = await db.query<StoreRow[]>(
    `
    SELECT 
      id, 
      user_id,
      name,
      location,
      business_type,
      currency
    FROM stores
    WHERE user_id = ?
    LIMIT 1
    `,
    [userId]
  )

  const store = stores[0] || null;

  if (!store) {
    return {
      store : null,
      onBoarding : {
        hasStore : false,
        hasCategories : false,
        hasSuppliers : false,
        hasProducts : false,
        nextStep : "store" as NextStep
      }
    }
  }

  // 2. category

  const [categories] = await db.query<CountRow[]>(
    `
    SELECT COUNT(*) AS total
    FROM store_categories
    WHERE store_id = ?
    AND is_active = true

    `, [store.id]
  )

  const hasCategories = Number(categories[0]?.total || 0) > 0;

  if (!hasCategories) {
    return {
      store,
      onBoarding : {
        hasStore : true,
        hasCategories : false,
        hasSuppliers : false,
        hasProducts : false,
        nextStep : "categories" as NextStep
      }
    }
  }

  //3/suppliers
  const [supplierRows] = await db.query<CountRow[]>(
  `
  SELECT COUNT(*) as total
  FROM suppliers
  WHERE store_id = ?
  AND is_active = TRUE
  `, [store.id]
  
  );
  const hasSuppliers = Number(supplierRows[0]?.total || 0) > 0;
  if (!hasSuppliers) {
    return{
      store,
       onBoarding : {
        hasStore : true,
        hasCategories : true,
        hasSuppliers : false,
        hasProducts : false,
        nextStep : "suppliers" as NextStep
      }     
    }
  }
// 4. Check products
  const [productRows] = await db.query<CountRow[]>(
    `
    SELECT COUNT(*) AS total
    FROM products
    WHERE store_id = ?
    AND is_active = TRUE
    `,
    [store.id]
  );

  const hasProducts = Number(productRows[0]?.total || 0) > 0;

  if (!hasProducts) {
    return {
      store,
      onBoarding: {
        hasStore: true,
        hasCategories: true,
        hasSuppliers: true,
        hasProducts: false,
        nextStep: "products" as NextStep,
      },
    };
  }

  // 5. Everything completed
  return {
    store,
    onBoarding: {
      hasStore: true,
      hasCategories: true,
      hasSuppliers: true,
      hasProducts: true,
      nextStep: "dashboard" as NextStep,
    },
  };
};

