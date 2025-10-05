import hero1 from '../../../assets/img/Desktop-SolarPanels.jpg';
import hero2 from '../../../assets/img/Desktop-SolarRoof.jpg';

import hero1Mobile from '../../../assets/img/Mobile-SolarPanels.jpg';
import hero2Mobile from '../../../assets/img/Mobile-SolarRoof.jpg';

const TextSubTitle = ({ text }: { text: string }) => <p>{text}</p>;

const models = [
  {
    id: 'hero1',
    title: 'See How Solar-Ready Your Roof Is — Instantly',
    Description: <TextSubTitle text="An estimate is free and fast thanks to advanced AI and satellite imagery" />,
    text1: 'Analyze My Roof',
    text2: 'How it Works',
    link1: '/lookup',
    link2: '/about',
    background: hero1,
    backgroundMobile: hero1Mobile,
  },
  {
    id: 'hero2',
    title: 'Behind the Scenes: Our Smart, Simple and Accurate System',
    Description: <TextSubTitle text="Type your address, and SolarSpot geocodes your location, finds your rooftop, and calculates energy, cost, and carbon savings" />,
    text1: 'Try it Yourself',
    text2: 'View the Tech',
    link1: '/lookup',
    link2: '/about',
    background: hero2,
    backgroundMobile: hero2Mobile,
  }
];

export default models;
