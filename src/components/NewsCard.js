import moment from "moment-timezone";

export default function NewsCard({ headline, description, url, imageUrl, source, publishedAt }) {
  const validImageUrl = imageUrl && imageUrl.trim() !== "" ? imageUrl : "/default-image.jpg";

  const formattedPublishedAt = publishedAt
    ? moment(publishedAt).tz("Asia/Kolkata").format("MMM DD, YYYY, HH:mm z")
    : "N/A";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row p-3 hover:bg-gray-100 transition">
      {/* Image Section - Responsive sizing */}
      <div className="md:w-[150px] md:min-w-[150px] w-full h-40 md:h-[100px] mb-2 md:mb-0">
        <img
          src={validImageUrl}
          alt={headline}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.src = "/default-image.jpg";
          }}
        />
      </div>

      {/* Content Section - Responsive spacing */}
      <div className="md:ml-3 flex flex-col justify-between flex-1">
        {/* Source & Date - Stack on mobile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between text-xs mb-1">
          <span className="text-gray-500 font-semibold">{source || "Unknown"}</span>
          <span className="text-gray-400 md:ml-2">{formattedPublishedAt}</span>
        </div>

        {/* Headline - Responsive text sizing */}
        <h4 className="font-semibold text-base md:text-sm leading-tight line-clamp-2 mb-1">
          {headline}
        </h4>

        {/* Description - Adjust line clamp for different screens */}
        <p className="text-gray-600 text-sm md:text-xs line-clamp-2 md:line-clamp-3 mb-2">
          {description}
        </p>

        {/* Read More Link - Right-aligned on desktop */}
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 text-sm md:text-xs font-semibold hover:underline self-start md:self-end"
        >
          Read more →
        </a>
      </div>
    </div>
  );
}