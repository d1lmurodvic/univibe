import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const EventCard = ({ activeEvents }) => {
  const [countdowns, setCountdowns] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = activeEvents.reduce(
        (acc, event) => ({
          ...acc,
          [event.id]: calculateTimeLeft(event.deadline),
        }),
        {}
      );
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeEvents]);

  const toggleExpand = (id) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-wrap gap-6 p-4">
      {activeEvents.map((event) => {
        const countdown = countdowns[event.id] || {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };

        const isExpanded = expandedEvents[event.id];

        return (
          <motion.div
            key={event.id}
            className="bg-base-300 w-full max-w-md shadow-md rounded-lg overflow-hidden flex flex-col"
            layout // Enable layout animations for the card
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-4 px-2 pt-2 mb-2">
              <Link to={`/clubs/${event?.club_id?.id}`} className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-10 md:w-12 rounded-full">
                    <img
                      src={event?.club_id?.logo || "default-logo.jpg"}
                      alt={event?.club_id?.name || "Club Logo"}
                    />
                  </div>
                </div>
              </Link>
              <Link to={`/clubs/${event?.id}`} className="truncate">
                {event?.club_id?.name || "Unknown Club"}
              </Link>
            </div>

            <img
              src={event.img || "default-image.jpg"}
              alt={event.title || "Event Image"}
              className="w-full h-50 object-cover aspect-[4/3]"
            />

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-md md:text-xl font-bold md:mb-2 truncate">
                {event.club_id?.name || "Unknown Club"}
              </h3>

              <button
                onClick={() => toggleExpand(event.id)}
                className="text-sm text-primary hover:underline mb-2 self-start"
              >
                {isExpanded ? "hide" : "more"}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col gap-2 overflow-hidden"
                  >
                    <p>Event - {event.title || "Untitled Event"}</p>

                    <p className="text-sm">
                      Deadline:{" "}
                      {new Date(event.deadline).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>

                    <a
                      href={event.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info underline"
                    >
                      Learn More
                    </a>

                    <div className="grid grid-flow-col gap-3 justify-center text-center auto-cols-max">
                      <div className="flex flex-col">
                        <span className="countdown font-mono text-4xl">
                          <span>{countdown.days}</span>
                        </span>
                        d
                      </div>
                      <div className="flex flex-col">
                        <span className="countdown font-mono text-4xl">
                          <span>{countdown.hours}</span>
                        </span>
                        h
                      </div>
                      <div className="flex flex-col">
                        <span className="countdown font-mono text-4xl">
                          <span>{countdown.minutes}</span>
                        </span>
                        m
                      </div>
                      <div className="flex flex-col">
                        <span className="countdown font-mono text-4xl">
                          <span>{countdown.seconds}</span>
                        </span>
                        s
                      </div>
                    </div>

                    <button className="btn w-full mt-2">Register</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EventCard;