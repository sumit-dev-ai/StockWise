import { useMemo, useState } from "react";
import { storeCategoryApi } from "../../../api/categoryApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

import { Button } from "../../../components/ui/button";
import type { MasterCategory, StoreCategory } from "../../../types/category.types";
import { Checkbox } from "../../../components/ui/checkbox";

type Props = {
  masterCategories: MasterCategory[];
  storeCategories: StoreCategory[];
  onSuccess: () => void;
};

export const MasterCategoryList = ({
  masterCategories,
  storeCategories,
  onSuccess,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedMasterCategoryIds = storeCategories
    .map((category) => category.master_category_id)
    .filter(Boolean);

  const filteredCategories = useMemo(() => {
    return masterCategories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [masterCategories, search]);

  const toggleCategory = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  const handleAddSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      setLoading(true);

      await storeCategoryApi.selectFromMaster({
        masterCategoryIds: selectedIds,
      });

      setSelectedIds([]);
      onSuccess();
    } catch (error) {
      console.log(error);
      alert("Failed to add selected categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Categories</CardTitle>
        <CardDescription>Select from our master category list.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search master categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-105 space-y-2 overflow-y-auto pr-1">
          {filteredCategories.map((category) => {
            const alreadyAdded = selectedMasterCategoryIds.includes(category.id);
            const checked = selectedIds.includes(category.id) || alreadyAdded;

            return (
              <div
                key={category.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={checked}
                  disabled={alreadyAdded}
                  onCheckedChange={() => toggleCategory(category.id)}
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.description ?? "No description"}
                  </p>

                  {alreadyAdded && (
                    <p className="mt-1 text-xs text-green-600">
                      Already added
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          className="w-full"
          disabled={selectedIds.length === 0 || loading}
          onClick={handleAddSelected}
        >
          {loading
            ? "Adding..."
            : `Add Selected Categories (${selectedIds.length})`}
        </Button>
      </CardContent>
    </Card>
  );
};