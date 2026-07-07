const LOGO =
  "https://res.cloudinary.com/dha44tosd/image/upload/c_pad,w_512,h_512,b_black/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png";
const LOGO_192 =
  "https://res.cloudinary.com/dha44tosd/image/upload/c_pad,w_192,h_192,b_black/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png";

export default function manifest() {
  return {
    name: "Kappa Theta Pi - Mu Chapter at UT Dallas",
    short_name: "KTP UTD",
    description:
      "Kappa Theta Pi (KTP) Mu Chapter at UT Dallas, a professional technology fraternity.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#00542C",
    icons: [
      { src: LOGO_192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: LOGO, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: LOGO_192, sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: LOGO, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
