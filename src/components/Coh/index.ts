export interface CohTarget {
  image: string;
  title: string;
  desc: string;
}
export const COH_TARGETS = [
  {
    image: '/assets/img/coh/target/aid.svg',
    title: 'Emergency aid',
    desc: 'Provides immediate financial and humanitarian aid as well as psychological support, and when required, temporary shelter.',
  },
  {
    image: '/assets/img/coh/target/support.svg',
    title: 'Essential support',
    desc: 'Ensures all basic needs of the children are met, such as food and warm clothing, along with legal support and counseling for families.',
  },
  {
    image: '/assets/img/coh/target/education.svg',
    title: 'Education and development',
    desc: 'Ensures all the children are set up for a bright future by organizing schooling, language courses, sports and various other activities that are catered to the needs and goals of each child.',
  },
  {
    image: '/assets/img/coh/target/healthcare.svg',
    title: 'Healthcare',
    desc: 'Covers the medical expenses of all the children until they reach adulthood.',
  },
  {
    image: '/assets/img/coh/target/socialization.svg',
    title: 'Socialization',
    desc: 'Funds camps, recreational activities and their organization, giving the children opportunities to interact with other kids and take part in leadership activities.',
  },
  {
    image: '/assets/img/coh/target/mentorship.svg',
    title: 'Mentorship and career planning',
    desc: 'As the fund covers a wide spectrum of age groups, it provides assistance and guidance in finding placements and job opportunities.',
  },
];

export interface StorySlide {
  text: string;
  author: string;
  url: string;
  id: number;
}
export const STORIES_SLIDES: Array<StorySlide> = [
  {
    text: "Received the package! We don't have enough words to thank you!!! Good size, quality stuff! Super! Everything fits perfectly, t-shirts for the summer, jeans and blouses for an eternity, a light jacket for spring! We would have needed to spend a lot of money on such clothes. God bless everyone who helped us, we hug everyone. Thank you very, very much!",
    author: 'Elizaveta and Varvar’s Mom',
    url: '/assets/img/coh/stories/story-1.jpg',
    id: 1,
  },
  {
    text: "The children are happy, &#10084;&#65039; thank you very much for everything you do for the children, for your care, for your sensitivity. I don't know what I would do without you. My soul is happy when the children are happy and I bow to you and your foundation. Thank you, thank you, thank you!”",
    author: 'Grandmother of Mykyta, Maryna, Kristina, Nadiya and Bohdan',
    url: '/assets/img/coh/stories/story-2.jpg',
    id: 2,
  },
  {
    text: "Thank you from the bottom of my heart for the timely and much needed help. In such difficult times, when it seems that I was left alone with a problem in my life, you appeared. I thank you very much. It's nice to know that such people are around.",
    author: 'Anya’s Mom',
    url: '/assets/img/coh/stories/story-3.jpg',
    id: 3,
  },
  {
    text: 'I am very grateful to the psychologist Victoria for my son. A great job was done and he has changed a lot. Ilya is unrecognizable – he draws, sculpts Smesharikis with Victoria, makes up various stories, she plays various games with him. His emotional state is stabilized.',
    author: 'Kiril’s Mom',
    url: '/assets/img/coh/stories/story-4.jpg',
    id: 4,
  },
  {
    text: 'Hello, today we’ve received a package with clothes. It all fits Katrusia well. It’s beautiful and of high quality. We very much appreciate it and are grateful to the Fund and everyone involved. The last few days were awful – a missile attack at night, then power, heat and water were cut off in the house, but today it’s all restored. And we’ve received such pretty gifts! It gives us faith and strength and the positive emotions that we need! Thank you so much!”',
    author: 'Katrusia’s Family',
    url: '/assets/img/coh/stories/story-5.jpg',
    id: 5,
  },
];
