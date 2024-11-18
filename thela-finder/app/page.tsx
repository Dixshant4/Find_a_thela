"use client";

import React from "react";
import { useRouter } from "next/navigation";

import MapButton from "./components/button";

const LandingPage: React.FC = () => {
  const router = useRouter();

  const navigateToMap = () => {
    router.push("/map");
  };

  return (
    <>
      <h1 className="fw-100 fs-100 text-4xl font-bold">
        Welcome to the Landing Page
      </h1>
      <MapButton callback={navigateToMap}></MapButton>
    </>
  );
};

export default LandingPage;
