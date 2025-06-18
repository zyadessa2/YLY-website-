export interface EventItem {
  id: string;
  title: string;
  description: string;
  content: string;
  logo: string;
  images?: string[];
  date: string;
  location: string;
  registrationLink?: string;
  slug: string;
}

export type EventPageParams = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const eventsData: EventItem[] = [
  {
    id: "5-in-1",
    title: "5 in 1 Championship",
    description:
      "A unique multi-sport championship that combines five different sports disciplines, testing athletes' versatility and overall fitness.",
    content: `<p>The 5 in 1 Championship is YLY's premier multi-sport event, designed to discover and showcase the most versatile young athletes in Egypt.</p>
    
    <h2>Event Components</h2>
    <ul>
      <li>Swimming: Testing endurance and technique</li>
      <li>Running: Speed and stamina challenges</li>
      <li>Basketball: Team coordination and skill</li>
      <li>Football: Strategic thinking and teamwork</li>
      <li>Volleyball: Agility and cooperation</li>
    </ul>

    <p>Athletes compete across all five disciplines, with points awarded for performance in each sport. The overall champion will demonstrate exceptional all-round athletic ability and sportspersonship.</p>

    <h2>Competition Format</h2>
    <p>The championship spans three days of intense competition, with participants grouped by age and skill level. Professional coaches and officials oversee each sport, ensuring fair play and proper technique.</p>`,
    logo: "/images/eventLogos/5-1n-1-1024x1024.png",
    images: [
      "/images/eventLogos/5-1n-1.png",
      "/images/eventLogos/5-in-1-1.png",
    ],
    date: "August 15, 2025",
    location: "YLY Sports Complex, Cairo",
    registrationLink: "/register/5-in-1",
    slug: "5-in-1",
  },
  {
    id: "girls-power",
    title: "Girls Power Initiative",
    description:
      "Empowering young women through sports and leadership activities, creating opportunities for growth and development.",
    content: `<p>Girls Power is more than just a sports event - it's a movement to empower young women through athletics, leadership training, and community building.</p>
    
    <h2>Program Elements</h2>
    <ul>
      <li>Sports Training: Professional coaching in various sports</li>
      <li>Leadership Workshops: Building confidence and communication skills</li>
      <li>Mentorship Program: Connecting with successful female athletes</li>
      <li>Health & Wellness Sessions: Focus on physical and mental well-being</li>
    </ul>

    <p>Our initiative has already impacted thousands of young women, providing them with the tools and confidence to pursue their athletic and leadership ambitions.</p>

    <h2>Event Schedule</h2>
    <p>The program includes monthly training sessions, quarterly tournaments, and annual leadership camps, creating a continuous support system for participants.</p>`,
    logo: "/images/eventLogos/Girls-Power.png",
    date: "September 1, 2025",
    location: "Multiple Venues Across Egypt",
    registrationLink: "/register/girls-power",
    slug: "girls-power",
  },
  {
    id: "its-on",
    title: "It's On Challenge",
    description:
      "An exciting fitness challenge that pushes participants to their limits while fostering teamwork and determination.",
    content: `<p>The It's On Challenge is YLY's high-intensity fitness competition that tests both physical and mental limits.</p>
    
    <h2>Challenge Components</h2>
    <ul>
      <li>High-Intensity Interval Training (HIIT)</li>
      <li>Obstacle Course Racing</li>
      <li>Team Challenges</li>
      <li>Endurance Tests</li>
    </ul>

    <p>Participants work both individually and in teams, facing increasingly difficult challenges that require strength, agility, and strategic thinking.</p>

    <h2>Competition Categories</h2>
    <p>The event features different difficulty levels to accommodate all fitness levels, from beginners to advanced athletes. Special categories for youth and team competitions are available.</p>`,
    logo: "/images/eventLogos/Its-On-1024x1024.png",
    images: ["/images/eventLogos/Its-On.png", "/images/eventLogos/Run-1.png"],
    date: "September 20, 2025",
    location: "New Cairo Sports Club",
    registrationLink: "/register/its-on",
    slug: "its-on",
  },
  // More events can be added here
];

export const getEventBySlug = (slug: string): EventItem | undefined => {
  return eventsData.find((event) => event.slug === slug);
};
