// 'use client';
//
// import { useEffect, useState } from 'react';
// import { AlertCircle } from 'lucide-react';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import { testApiConnectivity } from '@/lib/api';
//
// export default function ApiStatus() {
//     const [status, setStatus] = useState({
//         serpApi: null,
//         geminiApi: null,
//     });
//     const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
//
//     useEffect(() => {
//         const checkApis = async () => {
//             const results = await testApiConnectivity();
//             setStatus(results);
//         };
//
//         // Initial API check
//         checkApis();
//
//         // Set a 1-minute timeout to show the alert if there are connection issues
//         const timer = setTimeout(() => {
//             if (!status.serpApi || !status.geminiApi) {
//                 setShowAlert(true);
//             }
//         }, 60000); // 60 seconds (1 minute)
//
//         // Clear the timer if the component unmounts or if status changes
//         return () => clearTimeout(timer);
//     }, [status.serpApi, status.geminiApi]);
//
//     // Check if there's a persistent error after the timeout
//     if (showAlert && (!status.serpApi || !status.geminiApi)) {
//         return (
//             <Alert variant="destructive" className="mt-4">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>API Connection Error</AlertTitle>
//                 <AlertDescription>
//                     An error occurred while connecting to our services. Please try again in 30 minutes or contact support at <a href="mailto:ndiyizeye123@gmail.com" className="underline">ndiyizeye123@gmail.com</a>.
//                 </AlertDescription>
//             </Alert>
//         );
//     }
//
//     return null;
// }
