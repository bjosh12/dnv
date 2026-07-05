"use client";

import dynamic from "next/dynamic";

const Newsletter = dynamic(() => import("./Newsletter"), { ssr: false });

export default Newsletter;
