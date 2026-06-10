import { useEffect, useState } from "react";
import type { Supplier } from "../../types/supplier.types";
import { SupplierApi } from "../../api/supplierApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { AddSupplierDialog } from "./components/AddSupplierDialog";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { EditSupplierDialog } from "./components/editSupplierDialog";


export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const response = await SupplierApi.getAll();

      setSuppliers(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: number) => {
  const confirmed = confirm("Are you sure you want to remove this supplier?");

  if (!confirmed) return;

  try {
    await SupplierApi.deactivate(id);
    fetchSuppliers();
  } catch (error) {
    console.log(error);
    alert("Failed to remove supplier");
  }
};

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
            <p className="text-sm text-muted-foreground">
                Manage suppliers for your store products and stock purchases.
            </p>
    </div>

  <AddSupplierDialog onSuccess={fetchSuppliers} />
</div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>
            These suppliers will be available while creating products.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading suppliers...</p>
          ) : filteredSuppliers.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No suppliers found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Address</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{supplier.name}</td>
                      <td className="px-4 py-3">{supplier.phone || "-"}</td>
                      <td className="px-4 py-3">{supplier.email || "-"}</td>
                      <td className="px-4 py-3">{supplier.address || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSupplier(supplier)}
                            >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => handleDeactivate(supplier.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
        {editingSupplier && (
        <EditSupplierDialog
            supplier={editingSupplier}
            open={!!editingSupplier}
            onOpenChange={(open) => {
            if (!open) setEditingSupplier(null);
            }}
            onSuccess={() => {
            setEditingSupplier(null);
            fetchSuppliers();
            }}
        />
        )}
    </div>
  );
};