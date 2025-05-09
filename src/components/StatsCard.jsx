import React from "react";
const StatsCard = ({
  title,
  value,
  icon,
  bgColor = "bg-blue-500",
  textColor = "text-white",
}) => {
  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${bgColor}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt
                className={`text-sm font-medium truncate ${textColor} opacity-80`}
              >
                {title}
              </dt>
              <dd>
                <div className={`text-lg font-bold ${textColor}`}>{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
