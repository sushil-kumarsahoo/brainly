import ShareIcon from "../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

const Card = ({ title, link, type }: CardProps) => {
  return (
    <div>
      <div className="bg-white rounded-md border shadow-md border-gray-100 p-4 max-w-72 w-72 h-80">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="pr-2 text-gray-500">
              <ShareIcon size="md" />
            </div>
            <div className="font-normal text-md">{title}</div>
          </div>
          <div className="flex items-center">
            <div className="pr-2 text-gray-500">
              <a href={link} target="_blank" rel="noopener noreferrer">
                <ShareIcon size="md" />
              </a>
            </div>
            <div className="text-gray-500">
              <ShareIcon size="md" />
            </div>
          </div>
        </div>
        <div className="w-full pt-4 h-64 overflow-scroll scrollbar-hide">
          {type === "youtube" && (
            <iframe
              className="w-full aspect-video rounded-sm"
              src={`https://www.youtube.com/embed/${
                new URL(link).searchParams.get("v") ||
                new URL(link).pathname.split("/").pop()
              }`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}

          {type == "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link}></a>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
