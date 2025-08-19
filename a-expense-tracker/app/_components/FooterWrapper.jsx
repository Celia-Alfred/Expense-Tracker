"use client";

import { usePathname } from "next/navigation";
import Footer from "../(routes)/dashboard/_components/Footer"; // ✅ Corrected import

const FooterWrapper = () => {
  const pathname = usePathname();
  const hideFooterOn = ["/dashboard"]; // Add any additional routes here

  const shouldHide = hideFooterOn.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return !shouldHide ? <Footer /> : null;
};

export default FooterWrapper;
