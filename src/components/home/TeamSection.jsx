import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react"; // Added Linkedin Icon

// --- IMPORTANT ---
// Update this teamMembers array with your actual team data,
// including image paths, summaries, and LinkedIn URLs.
const teamMembers = [
  {
    name: "Umer Farooq", // Replace
    role: "Chief Executive Officer", // Replace
    image: "/Umer Farooq.jpg", // Replace with actual image path
    summary:
      "Shapes the company’s vision and strategic direction, spearheads growth initiatives, and ensures operational excellence to drive sustainable success and innovation.", // Replace
    linkedin: "https://linkedin.com/in/umer-profile-link",
    // description: "Optional longer description if needed",
    // specialization: "Optional specialization field"
  },
  {
    name: "Waqas Mukhtar", // Replace
    role: "Director, Immigration Sales & Business Development", // Replace
    image: "/Waqas Mukhtar.jpg", // Replace with actual image path
    summary:
      "Leads sales strategy and business growth in the immigration sector, building strong client relationships, expanding market reach, and driving revenue through innovative, results focused initiatives.", // Replace
    linkedin: "https://www.linkedin.com/in/waqasmukhtar", // Replace
  },
  {
    name: "Amna Yasser", // Replace
    role: "Chief Operating Officer", // Define Amna's role
    image: "/Amna Yasser.jpg", // Replace with actual image path
    summary:
      "A results driven visionary, Amna Yasser leads the seamless execution of company strategies, optimizing operations to drive growth, efficiency, and long term success across all business functions.", // Replace
    linkedin:
      "https://www.linkedin.com/in/amna-yasser-83ab554b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", // Replace
  },
  {
    name: "Maira Khan", // Replace
    role: "Client Relationship and Leads Manager", // Define Abdullah's role
    image: "/Maira Khan.jpg", // Replace with actual image path
    summary:
      "Oversees lead acquisition and conversion strategies, ensuring efficient engagement and a seamless transition from prospect to client across all touchpoints.", // Replace
    linkedin: "https://www.linkedin.com/in/maira-khan45/", // Replace
  },
  {
    name: "Abdullah Khan", // Replace
    role: "Senior Student Counselor & Finance Manager", // Define Abdullah's role
    image: "/Abdullah Khan.jpg", // Replace with actual image path
    summary:
      "A seasoned advisor and financial strategist, expertly guiding students toward international academic success while ensuring robust fiscal management and planning.", // Replace
    linkedin:
      "https://www.linkedin.com/in/abdullah-khan-aaa2a121a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", // Replace
  },
  {
    name: "Wajiha Farooq", // Replace
    role: "Associate Admissions", // Define Abdullah's role
    image: "/Wajiha Farooq.jpg", // Replace with actual image path
    summary:
      "A dedicated professional, Wajiha Farooq helps students navigate the admissions process, offering expert guidance and support to ensure a smooth and successful transition to their academic journey.", // Replace
    linkedin: "http://www.linkedin.com/in/wajiha-farooq-297a3635a", // Replace
  },
  {
    name: "Furqan Ali", // Replace
    role: "Manager Placements", // Define Abdullah's role
    image: "/Furqan Ali.jpg", // Replace with actual image path
    summary:
      "A trusted advisor, Furqan Ali provides expert guidance on academic pathways, helping students make informed decisions while ensuring seamless coordination between institutions and clients to drive academic success.", // Replace
    linkedin:
      "https://www.linkedin.com/in/furqan-ali-231865253?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", // Replace
  },
  {
    name: "Hamza Ahmed", // Replace
    role: "Manager Admissions", // Define Abdullah's role
    image: "/Hamza Ahmed.jpg", // Replace with actual image path
    summary:
      "A dedicated professional, Hamza Ahmed assists students through the admissions process, offering expert support and ensuring a smooth transition from application to enrollment for academic success.", // Replace
    linkedin:
      "https://www.linkedin.com/in/i-hamza-ahmed?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", // Replace
  },
  {
    name: "Zeeshan Ali Raza", // Replace
    role: "Marketing & Advertising Specialist/IT Expert",
    image: "/Zeeshan Ali.png", // Replace with actual image path
    summary:
      "Zeeshan Ali Raza is experienced in digital marketing advertising, and IT solutions. He has helped interface grow through smart strategies and the right tech. Always learning and improving to deliver better results.", // Replace
    linkedin:
      "https://www.linkedin.com/in/xishanaliraza?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", // Replace
  },
  {
    name: "Muhammad Mehmood Ahmed",
    role: "Lead Graphic Designer",
    image: "/Muhammad Mehmood.jpg",
    summary:
      "Muhammad Mehmood Ahmed is a talented Graphic Designer with expertise in creating visually compelling designs across various platforms. His innovative approach and attention to detail make him a key asset in our creative team.",
    linkedin: "https://www.linkedin.com/in/muhammad-mehmood-ahmed-049284335/", // Replace
  },
  {
    name: "Iqra Rajput",
    role: "Associate Leads Manager",
    image: "/Iqra Rajput.jpg",
    summary:
      "Iqra is at the frontline of building strong relationships with prospective clients, guiding them through Interface’s services and ensuring every interaction is smooth, informative, and tailored to their goals.",
    linkedin:
      "https://www.linkedin.com/in/iqra-rajput?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", // Replace
  },
  {
    name: "Abdul Manan",
    role: "Branch Manager",
    image: "/Abdul Manan.jpg",
    summary:
      "Dedicated Sales and Admission Specialist with expertise in educational consultancy and student counseling. Committed to guiding students through seamless admission processes and helping them achieve their academic goals.",
    linkedin:
      "https://linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=abdul-manan-8a9b30130", // Replace
  },
  {
    name: "Sohail Khan",
    role: "Content Writer",
    image: "/sohail-khan.jpg",
    summary:
      "Creative and detail-oriented Content Writer with a passion for crafting compelling narratives. Experienced in writing for diverse platforms, with a focus on clarity, engagement, and audience impact.",
    linkedin: "",
  },
];

const TeamSection = ({ isLargeScreen }) => {
  // Removed teamMembers from props, using local const now
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const teamCarouselRef = useRef(null);

  // ... (rest of the existing carousel logic: teamVariants, nextTeam, prevTeam, useEffect) ...
  const teamVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
      },
    }),
  };

  const nextTeam = () => {
    setDirection(1);
    setActiveTeamIndex((prev) =>
      prev === teamMembers.length - 1 ? 0 : prev + 1
    );
  };

  const prevTeam = () => {
    setDirection(-1);
    setActiveTeamIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  // Auto-advance team carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextTeam();
    }, 5000); // Increased interval slightly
    return () => clearInterval(interval);
  }, [activeTeamIndex]);

  // Get visible team members based on screen size
  const getVisibleTeamMembers = () => {
    if (!teamMembers || teamMembers.length === 0) return []; // Handle empty team

    // Always include the active member
    let visibleMembersIndices = [activeTeamIndex];

    // On larger screens, show more members (e.g., 3 total)
    if (isLargeScreen && teamMembers.length > 1) {
      const nextIndex = (activeTeamIndex + 1) % teamMembers.length;
      if (teamMembers.length > 2) {
        // Only add a third if available
        const next2Index = (activeTeamIndex + 2) % teamMembers.length;
        visibleMembersIndices = [activeTeamIndex, nextIndex, next2Index];
      } else {
        visibleMembersIndices = [activeTeamIndex, nextIndex];
      }
    }
    // On smaller screens, show only the active one
    // (Handled by default structure, only activeTeamIndex is used below if not isLargeScreen)

    // Map indices back to members
    return visibleMembersIndices.map((index) => teamMembers[index]);
  };

  return (
    <motion.section
      id="team"
      className="flex items-center justify-center w-full min-h-screen py-20 px-4 overflow-hidden" // Added overflow hidden
    >
      {/* Animated background elements - Kept as is */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#FF6B00]/20 to-[#FF6B00]/5 blur-3xl -z-10" // Ensure background elements are behind content
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gradient-to-l from-[#FF6B00]/20 to-[#FF6B00]/5 blur-3xl -z-10" // Ensure background elements are behind content
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="max-w-6xl mx-auto space-y-12 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <motion.h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            className="text-white/70 max-w-3xl mx-auto" // Increased max-width
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Updated intro text */}
            Our team is a diverse group of professionals with deep knowledge and
            experience in education, immigration, and business development. We
            pride ourselves on our personalized approach and commitment to
            providing tailored solutions for each individual.
          </motion.p>
        </motion.div>

        {/* Framer Motion Team Carousel */}
        <div className="relative mt-16 px-10" ref={teamCarouselRef}>
          {/* Ensure container allows enough height */}
          <div
            className={`flex justify-center items-start gap-8 h-[550px] md:h-[500px]`}
          >
            {" "}
            {/* Increased height, align items start */}
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout" // Use popLayout for smoother transitions with varying content heights
            >
              {/* Logic for displaying members depends on isLargeScreen */}
              {isLargeScreen
                ? getVisibleTeamMembers().map((member, index) => (
                    <motion.div
                      key={`${member.name}-${index}`} // Use a unique key
                      custom={direction}
                      variants={teamVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      layout // Enable layout animations
                      // Apply different styles based on position for large screens
                      className={`bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-auto max-w-xs w-full flex flex-col
                         ${
                           index === 0
                             ? "z-20"
                             : index === 1
                             ? "z-10 opacity-80 scale-90 mt-4"
                             : "z-0 opacity-60 scale-85 mt-8"
                         }`}
                      whileHover={{
                        scale: index === 0 ? 1.03 : index === 1 ? 0.93 : 0.88, // Adjust hover scale
                        boxShadow: "0 0 20px rgba(255, 107, 0, 0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {/* Card Content */}
                      <TeamMemberCard member={member} isActive={index === 0} />
                    </motion.div>
                  ))
                : // On smaller screens, only show the active member centered
                  teamMembers.length > 0 && (
                    <motion.div
                      key={`${teamMembers[activeTeamIndex]?.name}-active`}
                      custom={direction}
                      variants={teamVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      layout
                      className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-auto max-w-xs w-full flex flex-col z-20"
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 0 20px rgba(255, 107, 0, 0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <TeamMemberCard
                        member={teamMembers[activeTeamIndex]}
                        isActive={true}
                      />
                    </motion.div>
                  )}
            </AnimatePresence>
          </div>

          {/* Team Carousel Dots */}
          {teamMembers.length > 1 && ( // Only show dots if more than one member
            <div className="flex justify-center mt-8">
              {teamMembers.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2.5 h-2.5 mx-1.5 rounded-full transition-colors duration-300 ${
                    // Adjusted size/margin
                    activeTeamIndex === index
                      ? "bg-[#FF6B00] scale-125"
                      : "bg-white/40" // Scale active dot
                  }`}
                  onClick={() => {
                    if (index === activeTeamIndex) return; // Don't re-trigger for active dot
                    setDirection(index > activeTeamIndex ? 1 : -1);
                    setActiveTeamIndex(index);
                  }}
                  whileHover={{
                    scale: 1.3,
                    backgroundColor: "rgba(255, 107, 0, 0.7)",
                  }} // Hover effect
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }} // Springy tap
                />
              ))}
            </div>
          )}

          {/* Team Carousel Navigation */}
          {teamMembers.length > 1 && ( // Only show arrows if more than one member
            <>
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-white hover:bg-[#FF6B00] transition-colors z-30 shadow-md" // Added shadow
                onClick={prevTeam}
                whileHover={{ scale: 1.1, x: -3 }} // Enhanced hover
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-label="Previous team member"
              >
                <ChevronLeft size={20} /> {/* Slightly smaller icon */}
              </motion.button>
              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-white hover:bg-[#FF6B00] transition-colors z-30 shadow-md" // Added shadow
                onClick={nextTeam}
                whileHover={{ scale: 1.1, x: 3 }} // Enhanced hover
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-label="Next team member"
              >
                <ChevronRight size={20} /> {/* Slightly smaller icon */}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// Helper component for Team Member Card Content
const TeamMemberCard = ({ member, isActive }) => {
  if (!member) return null; // Return null if member data is missing

  return (
    <>
      <div className="relative mb-4 team-image-container flex-shrink-0">
        {" "}
        {/* Added flex-shrink-0 */}
        <div className="w-full pt-[100%] rounded-xl overflow-hidden relative group shadow-lg">
          {" "}
          {/* Added shadow */}
          <motion.img
            src={member.image || "/placeholder-avatar.png"} // Fallback image
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110" // Use CSS transition for smoother hover
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>{" "}
          {/* Slightly darker gradient */}
          {/* Optional hover effect */}
          {/* <motion.div
             className="absolute inset-0 bg-[#FF6B00]/10 opacity-0 group-hover:opacity-100"
             transition={{ duration: 0.3 }}
           /> */}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-gradient-to-t from-black/80 to-transparent pt-10">
          {" "}
          {/* Gradient ensures text visibility */}
          <h3 className="text-lg font-semibold text-white drop-shadow-md">
            {member.name}
          </h3>{" "}
          {/* Added drop shadow */}
          <p className="text-[#FFAB7A] font-medium text-sm">
            {member.role}
          </p>{" "}
          {/* Adjusted color slightly */}
        </div>
      </div>
      <div className="space-y-3 flex-grow flex flex-col justify-between mt-2">
        {" "}
        {/* Added mt-2 */}
        {/* Display summary */}
        <p className="text-white/70 text-sm text-center flex-grow min-h-[60px]">
          {" "}
          {/* Ensure minimum height */}
          {member.summary ||
            "Experienced professional dedicated to client success."}{" "}
          {/* Fallback summary */}
        </p>
        {/* LinkedIn Link */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-sm text-[#FFAB7A] hover:text-[#FF6B00] transition-colors mt-3 py-1 rounded-md bg-black/20 hover:bg-black/30"
          >
            <Linkedin size={14} /> View Profile
          </a>
        )}
        {/* Optional Specialization - Uncomment if needed
          {member.specialization && (
            <div className="bg-black/30 rounded-lg p-2 text-center mt-auto text-xs">
              <p className="text-white/50">Specialization</p>
              <p className="text-white">{member.specialization}</p>
            </div>
         )} */}
      </div>
    </>
  );
};

export default TeamSection;
