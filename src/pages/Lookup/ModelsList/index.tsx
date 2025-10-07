import hero1 from '../../../assets/img/Desktop-SolarPanels.jpg';
import hero2 from '../../../assets/img/Desktop-SolarRoof.jpg';

import hero1Mobile from '../../../assets/img/Mobile-SolarPanels.jpg';
import hero2Mobile from '../../../assets/img/Mobile-SolarRoof.jpg';

import AddressInput from '../../../components/AddressInput/index';

const TextSubTitle = ({ text }: { text: string }) => <p>{text}</p>;

const models = [
  {
    id: 'lookup',
    title: 'Discover Your Home’s Solar Potential',
    Description: (
      <>
        <TextSubTitle text="Enter your address to see how much clean energy your roof could generate" />
        <AddressInput />
      </>
    ),
    text1: 'Go!',
    link1: '/lookup/#results',
    background: hero1,
    backgroundMobile: hero1Mobile,
  },
  {
    id: 'results',
    title: 'Results: See How Ready Your Roof Is',
    Description: <TextSubTitle text="Type your address, and SolarSpot geocodes your location, finds your rooftop, and calculates energy, cost, and carbon savings" />,
    text1: 'Email Me My Results',
    link1: '/lookup/#lookup',
    background: hero2,
    backgroundMobile: hero2Mobile,
  }
];

export default models;
