import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Don't Block Me 2 — Find Your Fake Friends",
    short_name: "DontBlockMe2",
    description: "Find friends you can't trust with Don't Block Me 2! Create your quiz, test your friends, and see who gets blocked!",
    start_url: "/",
    display: "standalone",
    background_color: "#8AC0EF",
    theme_color: "#8AC0EF",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
