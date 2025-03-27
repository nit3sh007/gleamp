// import "@/pages/styles/global.css"; // Import global styles
// import React, { useEffect } from "react";
// import { useRouter } from "next/router";
// import Layout from "@/components/layout"; // Import Layout component

// function MyApp({ Component, pageProps }) {
//   const router = useRouter();
  
//   // Track whether the route is changing
//   const isHomePage = router.pathname === "/"; // Home page check
  
//   // Adding a smoother transition during route changes
//   useEffect(() => {
//     document.body.style.transition = 'background 0.3s ease'; // Optional: smoother page transition
//   }, [router.pathname]);

//   return (
//     <Layout>
//       <Component {...pageProps} />
//     </Layout>
//   );
// }

// export default MyApp;

import "@/pages/styles/global.css"; // Import global styles
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout"; // Import Layout component

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Adding a smoother transition during route changes
  useEffect(() => {
    document.body.style.transition = 'background 0.3s ease'; // Optional: smoother page transition
  }, [router.pathname]);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;