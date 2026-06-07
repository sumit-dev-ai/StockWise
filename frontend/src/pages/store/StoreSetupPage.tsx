import { ArrowRight, BarChart3, Building2, Coins, MapPin, ShieldCheck, Store } from 'lucide-react';

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import SignUpPageImage from "../../assets/images/StoreSignUpImage.png"
import { storeApi } from '../../api/storeApi';

export const StoreSetupPage = () => {
     const navigate = useNavigate();
     const [loading , setLoading] = useState(false)
     const [formData, setFormData] = useState({
    name: "",
    location:"",
    business_type: "",
    currency: "INR",
  });
  const handleInputChange = (event)=>{
        const {name , value} = event.target;
        setFormData((prev)=>({
            ...prev,
            [name] : value
        }))
  }
const handleBusinessTypeChange = (value: string) => {
  setFormData((prev) => ({
    ...prev,
    business_type: value,
  }));
};

const handleCurrencyChange = (value: string) => {
  setFormData((prev) => ({
    ...prev,
    currency: value,
  }));
};

  const handleSubmit = async(event) => {
     event.preventDefault();

     try {
        setLoading(true);
        await storeApi.createStore(formData);
        navigate("/dashboard", {replace : true});
     } catch (error) {
        console.log("Store Creation Failed",error);
     }finally{
        setLoading(false)
     }

    
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-slate-50">
        <div className='flex items-center justify-center gap-4 border border-slate-300 shadow-md p-4 
        ' >
            {/* login div */}
            <div>
                {/* logo */}
            <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <BarChart3 className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Stock<span className="text-blue-600">Wise</span>
            </h1>
          </div>

   
            {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Let's set up your store 
            </h2>
            <p className="mt-3 text-base text-slate-500">
              This information helps us personalize your experience.
            </p>
          </div>

           {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store name */}
             <div className="space-y-2">
              <Label htmlFor="name">
                Store Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your store name"
                  className="h-12 rounded-xl pl-12"
                  required
                />
              </div>
              {/* div to seprate store type and currency */}
                <div className='flex items-center justify-between'>
                {/* store type div  */}
              <div className='space-y-2'>
                <Label>
                Store Type 
               </Label>
               <div className='relative'>
                    <Select
                        value={formData.business_type}
                        onValueChange={handleBusinessTypeChange}
                >
                        <SelectTrigger className="h-12 rounded-xl">
                            <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-slate-400" />
                            <SelectValue placeholder="Select store type" />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Grocery">Grocery</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Stationery">Stationery</SelectItem>
                            <SelectItem value="General Store">General Store</SelectItem>
                        </SelectContent>
                    </Select>
               </div>
              </div>
              {/* currency seect */}
            <div className='space-y-2'>
                <Label>
                Currency
               </Label>
               <div className='relative'>
                    <Select
                        value={formData.currency}
                        onValueChange={handleCurrencyChange}
                >
                        <SelectTrigger className="h-12 rounded-xl md:w-40">
                            <div className="flex items-center gap-3">
                            <Coins className="h-5 w-5 text-slate-400" />
                            <SelectValue placeholder="Select Currency type" />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="DOLLAR">DOLLAR</SelectItem>
                            <SelectItem value="EURO">EURO</SelectItem>
                        </SelectContent>
                    </Select>
               </div>
              </div>

                </div>



                {/* Location */}
              <div className='space-y-2'>
                <Label>
                    Currency Type 
                </Label>
                <div className='relative'>
                     <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <Textarea
                  id="address"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter complete store address"
                  className="min-h-24 resize-none rounded-xl pl-12 pt-3"
                />

                </div>
              </div>

              </div>
                <Button
                type="submit"
                disabled={loading}
                className="h-12 rounded-xl bg-blue-600 px-8 text-white hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Continue"}
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

             <p className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Your information is secure and will only be used to improve your
              experience.
            </p>
            
            </form>

            


            </div>
            
            <div className=''>
                <img src={SignUpPageImage} alt="" className='h-screen w-full rounded-2xl py-2' />
            </div>
        </div>

    </div>
  )
}
