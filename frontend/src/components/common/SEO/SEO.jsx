import { Helmet } from "react-helmet-async";

/**
 * Component SEO - Quản lý meta tags cho từng trang
 *
 * @param {string} title - Tiêu đề trang (hiện trên tab browser)
 * @param {string} description - Mô tả trang (hiện trên Google search)
 * @param {string} keywords - Từ khóa SEO
 * @param {string} image - Ảnh đại diện khi share lên Facebook
 * @param {string} url - URL của trang
 */
function SEO({
  title = "Tech-Geeks - Cửa hàng laptop, PC chính hãng",
  description = "Mua laptop, PC, phụ kiện công nghệ chính hãng, giá tốt nhất. Bảo hành 12 tháng, giao hàng toàn quốc.",
  keywords = "laptop, pc, máy tính, phụ kiện, công nghệ",
  image = "/logo.png",
  url = typeof window !== "undefined" ? window.location.href : "",
}) {
  // Tạo title đầy đủ với tên website
  const fullTitle = title.includes("Tech-Geeks")
    ? title
    : `${title} | Tech-Geeks`;

  return (
    <Helmet>
      {/* ===== BASIC META TAGS ===== */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* ===== OPEN GRAPH (Facebook, LinkedIn) ===== */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tech-Geeks" />

      {/* ===== TWITTER CARD ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ===== CANONICAL URL ===== */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

export default SEO;
