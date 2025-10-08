import { useEffect, useState } from "react";
import { api } from "../../api";

export const DashboardPage = () => {
   const [portfolio, setPortfolio] = useState<string>('');
   
     useEffect(() => {
      api.GetBio()
         .then(setPortfolio)
     }, []);
   
     return (
       <div>
         <h1></h1>
         {portfolio}
       </div>
     );
}