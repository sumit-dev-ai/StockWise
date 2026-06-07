import { GoogleLogin } from "@react-oauth/google";
import { api } from "../../api/authApi";
import loginImage from "../../assets/images/loginImage.png"
import logo from "../../assets/images/logo.png"
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { storeApi } from "../../api/storeApi";


export const LoginPage = () => {
  const navigate = useNavigate();
  const {checkAuth}=useAuth();

    const handleGoogleSuccess = async (credentialResponse: any) =>{
          try {
          const credential = credentialResponse.credential;
          console.log(credential);
  
          if(!credential){
            console.log("no credentials received");
            return;
          }
          const response =await api.post("/auth/google",{credential})
          console.log("Backend response:", response.data);
          await checkAuth();

          //directing to signUp Page if not logged in 
          //
          navigate("/store-setup");
          const storeRes = await storeApi.getMyStore();
          const store = storeRes.data.data.store;
          
          if (store) {
            navigate("/dashboard");
          }
          else {
            navigate("/store-setup");
          }


          

          }  catch (error) {
          console.log(error) 
}
}
  return (
  <div className="flex flex-col overflow-hidden bg-slate-50 h-screen" >
      <div className="flex items-center justify-between mx-6 ">
        <img src={logo} alt="Logo" className="h-7 md:h-16" />
        <div className="flex items-center gap-2"><ShieldCheck /> Secured Sign in</div>
      </div>
    {/* Login Section center screen */}
    <div className= "flex-1 flex items-center bg-slate-50 min-h-0 border shadow-md border-slate-400">
      {/* Left side login form */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8">
          <h1 className="text-2xl md:text-3xl text-slate-950 font-bold tracking-tight ">
            Welcome to StockWise
            </h1>
            {/* Helping line */}
            <p className="text-slate-500 mt-4">
              Manage inventory, purchases, sales,</p>
               <p className="text-slate-500 mb-8">
                and stock insights in one place
               </p>
          
              <div className="w-full max-w-70">
                <GoogleLogin
                onSuccess={handleGoogleSuccess}
                width="280"
                theme="outline"
                onError={() => {
                  console.log("Google login failed");
                }}
                />
              </div>
               <p className="text-xs text-slate-500 mt-4 ">
                Login with google to access our app
               </p>
                <hr className="w-full  border-slate-200 mt-8 max-w-3/4" />

                
                <div className="flex flex-col items-center ">
                  <div className="flex-1 flex justify-start gap-4 mt-8">

                  <ShieldCheck />
                  <div>
                      <h1>Secure By Gooogle</h1>
                      <div className="text-xs text-slate-500 ">
                          <p>Your data is protected with Google's</p>
                          <p>secure infrastructure</p>
                      </div>
                  </div>
                  </div>
                
                </div>
        </div>
       

      {/* image section right side desktop no functionality so ignore if you are reading my code */}
      <div className="hidden h-full overflow-hidden md:block w-1/2">
        <img src={loginImage } alt="Hero Image" className="w-full h-full  object-cover  rounded-l-4xl" />
      </div>
    </div>


    <div className="flex items-center justify-between mx-6 my-2">
        <div className="text-slate-500 flex-1">2026 Stockwise</div>
        <div className="flex gap-6 text-slate-500">
          {/* Dummy button for now they dont work */}
            <button className="cursor-pointer">Terms</button>
           <button className="cursor-pointer">Privacy</button>
           <button className="cursor-pointer">Help</button>
        </div>
    </div>
  </div>
  )
}
