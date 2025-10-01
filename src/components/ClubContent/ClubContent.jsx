import React from "react";
import ClubCard from "../ClubCard/ClubCard";

const ClubContent = ({ clubs, loading, error, searchTerm, setSearchTerm, currentUserId, onUpdate }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div> 
      <input
        type="text"
        placeholder="Search clubs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered mb-4 w-full"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            currentUserId={currentUserId} 
            onClick={() => console.log("View club", club.id)}
            onUpdate={onUpdate}         
          />
        ))}
      </div>
    </div>
  );
};

export default ClubContent;
