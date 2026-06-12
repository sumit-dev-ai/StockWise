import { useEffect, useState } from "react";
import { productApi } from "../../../api/productApi";

import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../../../types/product.types";

import type { Supplier } from "../../../types/supplier.types";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { StoreCategory } from "../../../types/category.types";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product?: Product | null;
  categories: StoreCategory[];
  suppliers: Supplier[];
  onSuccess: () => void;
};

type FormState = {
  store_category_id: string;
  supplier_id: string;
  name: string;
  sku: string;
  description: string;
  cost_price: string;
  selling_price: string;
  stock_quantity: string;
  low_stock_threshold: string;
  unit: string;
};

const initialFormState: FormState = {
  store_category_id: "",
  supplier_id: "",
  name: "",
  sku: "",
  description: "",
  cost_price: "",
  selling_price: "",
  stock_quantity: "0",
  low_stock_threshold: "10",
  unit: "pcs",
};

export const ProductFormDialog = ({
  open,
  onOpenChange,
  mode,
  product,
  categories,
  suppliers,
  onSuccess,
}: ProductFormDialogProps) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && product) {
      setForm({
        store_category_id: String(product.store_category_id),
        supplier_id: String(product.supplier_id),
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        cost_price: String(product.cost_price),
        selling_price: String(product.selling_price),
        stock_quantity: String(product.stock_quantity),
        low_stock_threshold: String(product.low_stock_threshold),
        unit: product.unit,
      });
    }

    if (mode === "create") {
      setForm(initialFormState);
    }
  }, [mode, product, open]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildPayload = (): CreateProductPayload => {
    return {
      store_category_id: Number(form.store_category_id),
      supplier_id: Number(form.supplier_id),
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim() || undefined,
      cost_price: Number(form.cost_price),
      selling_price: Number(form.selling_price),
      stock_quantity: Number(form.stock_quantity),
      low_stock_threshold: Number(form.low_stock_threshold),
      unit: form.unit.trim() || "pcs",
    };
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const payload = buildPayload();

      if (mode === "create") {
        await productApi.createProduct(payload);
      } else {
        if (!product) return;

        const updatePayload: UpdateProductPayload = payload;
        await productApi.updateProduct(product.id, updatePayload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "create" ? "Add Product" : "Edit Product";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              
              placeholder="Milk Packet 500ml"
            />
          </div>

          <div className="space-y-2">
            <Label>SKU</Label>
            <Input
              value={form.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              placeholder="MILK-500"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.store_category_id}
              onValueChange={(value) => updateField("store_category_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select
              value={form.supplier_id}
              onValueChange={(value) => updateField("supplier_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={String(supplier.id)}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cost Price</Label>
            <Input
              type="number"
              value={form.cost_price}
              onChange={(e) => updateField("cost_price", e.target.value)}
              placeholder="25"
            />
          </div>

          <div className="space-y-2">
            <Label>Selling Price</Label>
            <Input
              type="number"
              value={form.selling_price}
              onChange={(e) => updateField("selling_price", e.target.value)}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label>Opening Stock</Label>
            <Input
              type="number"
              value={form.stock_quantity}
              onChange={(e) => updateField("stock_quantity", e.target.value)}
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label>Low Stock Threshold</Label>
            <Input
              type="number"
              value={form.low_stock_threshold}
              onChange={(e) =>
                updateField("low_stock_threshold", e.target.value)
              }
              placeholder="20"
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={form.unit}
              onChange={(e) => updateField("unit", e.target.value)}
              placeholder="pcs"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Short product description..."
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? "Saving..."
              : mode === "create"
              ? "Create Product"
              : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};