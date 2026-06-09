import { useEffect, useState } from "react";
import type { MasterCategory, StoreCategory } from "../../types/category.types";
import { masterCategoryApi } from "../../api/masterCategoryApi";
import { storeCategoryApi } from "../../api/categoryApi";
import { CreateCustomCategoryForm } from "./components/CreateCustomCategoryForm";
import { MasterCategoryList } from "./components/MasterCategoryComponents";
import { MyStoreCategoriesList } from "./components/MyStoreCategoriesList";

export const CategoriesSetupPage = () => {
  const [masterCategories, setMasterCategories] = useState<MasterCategory[]>([]);
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [masterRes, storeRes] = await Promise.all([
        masterCategoryApi.getAll(),
        storeCategoryApi.getMyCategories(),
      ]);

      setMasterCategories(masterRes.data.data);
      setStoreCategories(storeRes.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load categories");
    //   toast.error("Failed to load categories");  // havent set it up yet too lazy to do it right now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground animate-pulse">Loading categories...</p>
      </div>
    );
  }
  return (
 <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Category Setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose master categories for your store or create a custom one.
        </p>
      </div>
    {/* dividing into 3 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <MasterCategoryList
          masterCategories={masterCategories}
          storeCategories={storeCategories}
          onSuccess={fetchData}
        />

        <CreateCustomCategoryForm onSuccess={fetchData} />

        <MyStoreCategoriesList
          storeCategories={storeCategories}
          onSuccess={fetchData}
        />
      </div>
    </div>
  )
}
