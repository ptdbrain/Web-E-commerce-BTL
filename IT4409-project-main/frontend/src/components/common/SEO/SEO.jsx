import { Helmet } from "react-helmet-async";
import { storeConfig } from "../../../data/menuData";

function SEO({
  title = `${storeConfig.name} - Fast food ga gion, burger va combo`,
  description = storeConfig.description,
  keywords = "fast food, burger, ga ran, combo, do an nhanh, firebite",
  image = "/logo.png",
  url = typeof window !== "undefined" ? window.location.href : "",
}) {
  const fullTitle = title.includes(storeConfig.name)
    ? title
    : `${title} | ${storeConfig.name}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={storeConfig.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

export default SEO;
