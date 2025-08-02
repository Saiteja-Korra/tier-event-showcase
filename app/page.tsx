import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Tier-Based Events</h1>
      <p className="text-gray-600 mt-4">Please sign in to explore events by your tier</p>
    </div>
  )
}
