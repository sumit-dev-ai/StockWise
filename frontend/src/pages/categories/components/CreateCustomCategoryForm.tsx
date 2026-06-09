
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { storeCategoryApi } from "../../../api/categoryApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
//planning
//I would need to submit a form 
// input values will change so i need a state for name and description
// i would also need a loading state to disable button and show loading on screen
// the form will have 2 fiels name and discription i would need Input and Textarea
// after taking data from user in need to create a handle submit method
// i will call the api to createCustom and send that data to backend // will add validation later 
//after creating the custom category i need to call onSuccess() so changes happen in all three componenet

type Props = {
  onSuccess: () => void | Promise<void>;
};

export const CreateCustomCategoryForm = ({ onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async (e:  React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      await storeCategoryApi.createCustom({
        name,
        description,
        is_custom : true,
      });

      setName("");
      setDescription("");
      onSuccess();
    } catch (error) {
      console.log(error);
      alert("Failed to create custom category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1 className="text-muted-foreground animate-pulse">Categoris Loading....</h1>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Category</CardTitle>
        <CardDescription>
          Add a category that does not exist in the master list.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div className="space-y-2">
            <Label>Category name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Imported Chocolates"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write small description..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};