// This is a mock data file. Replace with your actual data source (API, database, etc.)
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  images?: string[];
  date: string;
  author: string;
  slug: string;
}

export const newsData: NewsItem[] = [
  {
    id: "7",
    title: "YLY Partners with Global Tech Giants for Youth Employment",
    description:
      "Major technology companies join forces with YLY to create job opportunities and internships for Egyptian youth in the tech sector.",
    content: `<p>YLY has secured groundbreaking partnerships with several international technology companies to boost employment opportunities for Egyptian youth in the rapidly growing tech sector.</p>

    <h2>Partnership Highlights</h2>
    <ul>
      <li>500+ internship positions across various tech companies</li>
      <li>Specialized training programs in software development</li>
      <li>Remote work opportunities with global teams</li>
      <li>Fast-track recruitment for top performers</li>
    </ul>

    <p>The initiative aims to bridge the gap between education and industry requirements, providing practical experience to young professionals. Partners include leading companies in software development, artificial intelligence, and digital transformation.</p>

    <h2>Training Programs</h2>
    <p>Participants will receive comprehensive training in:</p>
    <ul>
      <li>Full-stack development</li>
      <li>Cloud computing</li>
      <li>Data science</li>
      <li>Project management</li>
    </ul>`,
    image: "/images/Board/Youssef Mohamed.jpg",
    images: ["/images/Board/Youssef Mohamed.jpg", "/images/about.png"],
    date: "June 11, 2025",
    author: "Youssef Mohamed",
    slug: "yly-partners-with-tech-giants",
  },
  {
    id: "6",
    title: "YLY Environmental Leadership Program Makes Waves",
    description:
      "Youth-led environmental initiatives show remarkable success in first quarter, with over 50 community projects launched across Egypt.",
    content: `<p>The YLY Environmental Leadership Program has exceeded expectations in its first quarter, with young leaders implementing innovative solutions to local environmental challenges.</p>

    <h2>Program Achievements</h2>
    <ul>
      <li>50+ community environmental projects launched</li>
      <li>Over 10,000 trees planted nationwide</li>
      <li>15 waste management initiatives implemented</li>
      <li>20 clean energy awareness campaigns completed</li>
    </ul>

    <p>Young leaders have shown exceptional creativity and dedication in addressing environmental challenges, from coastal cleanup projects to urban farming initiatives.</p>

    <h2>Upcoming Initiatives</h2>
    <p>The program is set to expand with new projects focusing on:</p>
    <ul>
      <li>Renewable energy adoption</li>
      <li>Water conservation</li>
      <li>Sustainable agriculture</li>
      <li>Environmental education</li>
    </ul>`,
    image: "/images/Board/Aml Ayman.jpg",
    images: ["/images/Board/Aml Ayman.jpg", "/images/about.png"],
    date: "June 9, 2025",
    author: "Aml Ayman",
    slug: "yly-environmental-program-success",
  },
  {
    id: "5",
    title: "YLY Arts and Culture Festival Showcases Young Talent",
    description:
      "Annual festival brings together young artists, musicians, and performers from across Egypt in a celebration of creativity and cultural expression.",
    content: `<p>The YLY Arts and Culture Festival has once again proven to be a powerful platform for young Egyptian artists to showcase their talents and creative vision.</p>

    <h2>Festival Highlights</h2>
    <ul>
      <li>Musical performances from emerging artists</li>
      <li>Contemporary art exhibitions</li>
      <li>Theater and dance productions</li>
      <li>Traditional crafts workshops</li>
      <li>Digital art installations</li>
    </ul>

    <p>This year's festival featured over 200 young artists and attracted more than 5,000 visitors, making it the largest celebration of youth arts in the country.</p>

    <h2>Impact on Young Artists</h2>
    <p>The festival has created numerous opportunities for young artists:</p>
    <ul>
      <li>Gallery partnerships for emerging visual artists</li>
      <li>Record label interest in musicians</li>
      <li>Theater company collaborations</li>
      <li>International exhibition invitations</li>
    </ul>`,
    image: "/images/Board/Verina Shokry.jpg",
    images: ["/images/Board/Verina Shokry.jpg", "/images/about.png"],
    date: "June 7, 2025",
    author: "Verina Shokry",
    slug: "yly-arts-culture-festival",
  },
  {
    id: "4",
    title: "YLY Launches Revolutionary Women's Sports Initiative",
    description:
      "YLY (Youth Leading Youth) introduces a groundbreaking initiative to promote women's participation in sports across Egypt, targeting universities and youth centers.",
    content: `<p>In a landmark move towards gender equality in sports, YLY has launched its highly anticipated Women's Sports Initiative. This comprehensive program aims to break down barriers and create new opportunities for young women in athletics across Egypt.</p>
    
    <h2>Key Program Components</h2>
    <ul>
      <li>Partnership with major universities and sports facilities</li>
      <li>Professional training programs led by experienced coaches</li>
      <li>Monthly sports tournaments and competitions</li>
      <li>Mentorship opportunities with established female athletes</li>
      <li>Scholarships for promising young talents</li>
    </ul>

    <p>The initiative has already garnered support from several national sports federations and is expected to reach over 10,000 young women in its first year. YLY's commitment to empowering women through sports represents a significant step forward in promoting gender equality in Egyptian athletics.</p>

    <h2>Community Impact</h2>
    <p>Beyond individual development, the program aims to create lasting change in how women's sports are perceived and supported in Egypt. Through partnerships with media outlets and social campaigns, YLY is working to challenge stereotypes and create a more inclusive sporting environment.</p>`,
    image: "/images/about.png",
    date: "June 10, 2025",
    author: "Sarah Ahmed",
    slug: "yly-launches-womens-sports-initiative",
  },
  {
    id: "3",
    title: "YLY Celebrates International Youth Day with Multiple Initiatives",
    description:
      "Youth Leading Youth marks International Youth Day with the launch of several groundbreaking programs focusing on leadership development and community engagement.",
    content: `<p>YLY commemorated International Youth Day with an impressive array of new initiatives designed to empower young leaders and create lasting positive change in communities across Egypt.</p>

    <h2>New Programs Launched</h2>
    <ul>
      <li>Digital Skills Academy: Free coding and tech workshops</li>
      <li>Environmental Leadership Program: Focus on sustainable development</li>
      <li>Creative Arts Initiative: Supporting young artists and performers</li>
      <li>Youth Entrepreneurship Hub: Mentorship and funding opportunities</li>
    </ul>

    <p>The celebration, attended by over 500 youth leaders from various governorates, showcased the organization's commitment to nurturing the next generation of change-makers. Special focus was placed on sustainable development goals and digital transformation.</p>

    <h2>Impact and Future Plans</h2>
    <p>These initiatives are expected to reach more than 20,000 young people across Egypt in the coming year, providing them with the skills and resources needed to become effective leaders in their communities.</p>`,
    image: "/images/hero.jpg",
    date: "June 8, 2025",
    author: "Mohamed Hassan",
    slug: "yly-celebrates-international-youth-day",
  },
  {
    id: "2",
    title: "YLY Launches Tech Innovation Lab",
    description:
      "Youth Leading Youth unveils state-of-the-art technology innovation lab to foster digital skills and entrepreneurship among Egyptian youth.",
    content: `<p>YLY has taken a bold step into the future with the inauguration of its Tech Innovation Lab, a cutting-edge facility designed to bridge the digital skills gap among Egyptian youth.</p>

    <h2>Lab Features</h2>
    <ul>
      <li>Advanced AI and Machine Learning workstations</li>
      <li>Virtual and Augmented Reality development tools</li>
      <li>3D printing and prototyping equipment</li>
      <li>Collaborative workspace for startups</li>
      <li>High-speed internet and cloud computing resources</li>
    </ul>

    <p>The lab will offer free training programs in partnership with leading tech companies, providing young innovators with the tools and knowledge they need to compete in the digital economy.</p>

    <h2>Programs and Opportunities</h2>
    <p>Initial programs will focus on web development, mobile app creation, artificial intelligence, and digital marketing. The lab aims to train over 5,000 youth in its first year of operation.</p>`,
    image: "/images/Board/Ahmed Tarek.jpg",
    images: ["/images/Board/Ahmed Tarek.jpg", "/images/about.png"],
    date: "June 5, 2025",
    author: "Nour El-Din",
    slug: "yly-launches-tech-innovation-lab",
  },
  {
    id: "1",
    title: "Youth Leadership Summit 2025",
    description:
      "Join us for our annual Youth Leadership Summit where young leaders from across the country gather to share ideas and experiences.",
    content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <h2>Event Highlights</h2>
    <ul>
      <li>Keynote speakers from leading organizations</li>
      <li>Interactive workshops and sessions</li>
      <li>Networking opportunities</li>
      <li>Leadership development activities</li>
    </ul>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
    image: "/images/hero.jpg",
    images: ["/images/hero.jpg", "/images/about.png"],
    date: "June 15, 2025",
    author: "Ahmed Tarek",
    slug: "youth-leadership-summit-2025",
  },
  // Add more news items here
];

export const getNewsById = (id: string) => {
  return newsData.find((news) => news.slug === id);
};
