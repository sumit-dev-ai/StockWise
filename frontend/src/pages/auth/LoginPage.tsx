import { GoogleLogin } from "@react-oauth/google";
import { api } from "../../api/authApi";


export const LoginPage = () => {
    const handleGoogleSuccess = async (credentialResponse: any) =>{
      const credential = credentialResponse.credential;
        console.log(credential);

        if(!credential){
          console.log("no credentials received");
          return;
        }
        const response =await api.post("/auth/google",{credential})
        console.log(response?.data);
    }
  return (
    <div className= "flex  items-center justify-between min-h-screen">

        <div>
          <h1>Welcome to StockWise</h1>
        <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Google login failed");
        }}
        />
        </div>
       

      <div>

      </div>
    </div>
  
  )
}
