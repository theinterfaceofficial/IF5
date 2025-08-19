import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ParallaxBg from "../components/ParallaxBg";

export default function HomeLayout() {
  return (
    <div>
      <ParallaxBg imageUrl="/parallax-bg.png" />
      <Navbar />
      <Outlet />
    </div>
  );
}
