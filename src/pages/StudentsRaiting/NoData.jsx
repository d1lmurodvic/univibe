import React from 'react';
import { TbMoodSad } from "react-icons/tb";

const NoData = () => {
  return (
    <div className="text-center py-8">
      <div className="flex flex-col items-center justify-center">
        <img src="/notfound.png" alt="No data found" className="w-24 mb-4" />
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">No data found</p>
          <TbMoodSad className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default NoData;