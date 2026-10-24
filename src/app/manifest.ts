import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LoveMatch — Who Knows Who Better?",
    short_name: "LoveMatch",
    description: "The mobile-first multiplayer couples quiz. Answer. Reveal. Discover.",
    start_url: "/",
    display: "standalone",
    background_color: "#25112F",
    theme_color: "#25112F",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      }
    ]
  };
}
