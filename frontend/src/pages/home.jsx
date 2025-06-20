import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopSneakersOfWeek from "./TopSneakersOfWeek";
import MensTshirtsOfWeek from "./MensTshirtCard";
import MultiCarouselbanner from "../components/MultiCarouselbanner";
import NewArrivals from "./NewArrival";
import Featurecard from "../components/Featurecard";
import CategorySection from "./CategorySection";
import CustomerReviewsCarousel from "../components/Customerreview";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token && !localStorage.getItem("trendify_token")) {
      localStorage.setItem("trendify_token", token);
      // Clean up the token from the URL after setting it
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      <MultiCarouselbanner />
      <Featurecard />
      <TopSneakersOfWeek />
      <CategorySection />
      <MensTshirtsOfWeek />
      <NewArrivals />
      <CustomerReviewsCarousel />
    </>
  );
}
