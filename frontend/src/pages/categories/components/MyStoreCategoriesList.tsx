import {  Trash2 } from "lucide-react";
import { storeCategoryApi } from "../../../api/categoryApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import type { StoreCategory } from "../../../types/category.types";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

type Props = {
  storeCategories: StoreCategory[];
  onSuccess: () => void ;
};

export const MyStoreCategoriesList = ({
  storeCategories,
  onSuccess,
}: Props) => {
  const handleDeactivate = async (id: number) => {
    const confirmDelete = confirm("Remove this category from your store?");

    if (!confirmDelete) return;

    try {
      await storeCategoryApi.deactivate(id);
      onSuccess();
    } catch (error) {
      console.log(error);
      alert("Failed to remove category");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Store Categories</CardTitle>
        <CardDescription>Categories currently used by your store.</CardDescription>
      </CardHeader>

      <CardContent>
        {storeCategories.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No categories added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {storeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.description ?? "No description"}
                  </p>

                  <Badge variant="outline" className="mt-2">
                    {category.is_custom ? "Custom" : "Master"}
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeactivate(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};