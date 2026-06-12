import { useEffect, useMemo, useState } from "react";
import type { StoreCategory } from "../../types/category.types";
import type { Product } from "../../types/product.types";
import type { Supplier } from "../../types/supplier.types";
import { AlertTriangle, MoreHorizontal, Package, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { ProductFormDialog } from "./components/ProductFormDialog";
import { productApi } from "../../api/productApi";
import { storeCategoryApi } from "../../api/categoryApi";
import { SupplierApi } from "../../api/supplierApi";
import { Badge } from "../../components/ui/badge";


export const ProductsPage = () => {
      const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<StoreCategory[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("all");
    const [supplierId, setSupplierId] = useState("all");
    const [activeStatus, setActiveStatus] = useState("true");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await productApi.getProducts({
        search: search || undefined,
        store_category_id: categoryId === "all" ? undefined : categoryId,
        supplier_id: supplierId === "all" ? undefined : supplierId,
        is_active: activeStatus === "all" ? undefined : activeStatus,
      });

      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [categoryResponse, supplierResponse] = await Promise.all([
        storeCategoryApi.getMyCategories(),
        SupplierApi.getAll(),
      ]);

      setCategories(categoryResponse.data.data);
      setSuppliers(supplierResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, supplierId, activeStatus]);

  const handleSearch = () => {
    fetchProducts();
  };

  const handleDeactivateProduct = async (productId: number) => {
    try {
      await productApi.deactivateProduct(productId);
      await fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const lowStockCount = useMemo(() => {
    return products.filter(
      (product) => product.stock_quantity <= product.low_stock_threshold
    ).length;
  }, [products]);

  return (
    <div className="space-y-6 p-4 md:p-6">
        {/* page head */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Products
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage products, store levels, categories and supplies
                </p>
            </div>
        </div>
        {/* header part done */}
        {/* button */}
        <Button className="w-full md:w-auto"
        //to open dialog box
        onClick={()=>setIsAddOpen(true)}
        >
            <Plus className="mr-2 h4 w-4" />
            Add Product
        </Button>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Products
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground"  />
                        <span className="text-2xl font-bold">{products.length}</span>

                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground " />
                        <span className="text-2xl font-bold">{lowStockCount}</span>             
                    </div>
                </CardContent>
            </Card>
            
                    <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="">
              {activeStatus === "all"
                ? "All"
                : activeStatus === "true"
                ? "Active"
                : "Inactive"}
            </Badge>
          </CardContent>
        </Card>
        </div>
        {/* Filters */}
        <Card>
            <CardContent>
                {/* card grid layout for 4 div */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex md:col-span-1 border border-gray-200 rounded-xl">
                        {/* for searching products by name and sku */}
                        <Input
                            className="border-0"
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={(e)=> setSearch(e.target.value)}
                            onKeyDown={(e)=>{
                                if (e.key==="Enter") handleSearch();
                                
                            }}
                        />
                        <Button variant="JustForInput" onClick={handleSearch} className="border-l-gray-200 rounded-b-none ">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="flex md:col-span-1">
                    <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Category"/>
                            </SelectTrigger>
                            <SelectContent>

                             <SelectItem value="all">All categories</SelectItem>
                             {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                    </SelectItem>
                            ))}
                            </SelectContent>

                    </Select>
                    </div>
                    <div className="flex md:col-span-1">
                    <Select value={supplierId} onValueChange={setSupplierId}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                                <SelectItem value="all">All suppliers</SelectItem>
                                    {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={String(supplier.id)}>
                                    {supplier.name}
                                </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div>
                        <Select value={activeStatus} onValueChange={setActiveStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            </CardContent>
        </Card>
         {/* Product Table */}
        <Card>
            <CardHeader>
                <CardTitle>Product List</CardTitle>
                </CardHeader>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-sm text-muted-foreground">
                Add your first product to start managing inventory.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {products.map((product) => {
                      const isLowStock =
                        product.stock_quantity <= product.low_stock_threshold;

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.description || "No description"}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category_name || "-"}</TableCell>
                          <TableCell>{product.supplier_name || "-"}</TableCell>
                          <TableCell>₹{product.selling_price}</TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>
                                {product.stock_quantity} {product.unit}
                              </span>
                              {isLowStock && (
                                <Badge variant="destructive">Low</Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            {(product.is_active) ? (
                              <Badge>Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingProduct(product)}
                                >
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeactivateProduct(product.id)
                                  }
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
            )}
        </Card>
      <ProductFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        mode="create"
        categories={categories}
        suppliers={suppliers}
        onSuccess={fetchProducts}
      />

      <ProductFormDialog
        open={Boolean(editingProduct)}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
        mode="edit"
        product={editingProduct}
        categories={categories}
        suppliers={suppliers}
        onSuccess={fetchProducts}
      />
    </div>
  )

}
