export type Listing = {
  title: string;
  price: string;
  specs?: string;
  banner?: string;
  link: string;
  thumbnail: string;
};

const CDN = 'https://content.mediastg.net/dyna_images/mls/105605/';
const DET = 'https://andrealarsen.foxroach.com/realestate/details/';

export const listings: Listing[] = [
  {
    price: '$18,800,000',
    title: '465 Pineville Road, Newtown PA',
    specs: '4 Beds · 6 Baths · 8,050 Sq Ft · 147.73 Acres',
    link: DET + '12814728/465-pineville-road-newtown-pa-18940',
    thumbnail: '/listings/casa-01.jpg',
  },
  {
    price: '$5,500,000',
    title: '658 Rock Cove Lane, Severna Park MD',
    specs: '5 Beds · 7 Baths · 9,152 Sq Ft · 1.71 Acres',
    link: DET + '9620326/658-rock-cove-lane-severna-park-md-21146',
    thumbnail: '/listings/casa-02.jpg',
  },
  {
    price: '$5,495,000',
    title: '6908 Carmichael Avenue, Bethesda MD',
    specs: '7 Beds · 8 Baths · 8,827 Sq Ft · 0.46 Acres',
    link: DET + '58582425/6908-carmichael-avenue-bethesda-md-20817',
    thumbnail: '/listings/casa-03.jpg',
  },
  {
    price: '$5,295,000',
    title: '15325 Masonwood Drive, North Potomac MD',
    specs: '9 Beds · 14 Baths · 16,332 Sq Ft · 34.8 Acres',
    link: DET + '9373371/15325-masonwood-drive-north-potomac-md-20878',
    thumbnail: '/listings/casa-04.jpg',
  },
  {
    price: '$5,200,000',
    title: '3910 Underwood Street, Chevy Chase MD',
    specs: '6 Beds · 8 Baths · 6,783 Sq Ft · 0.25 Acres',
    link: DET + '58554598/3910-underwood-street-chevy-chase-md-20815',
    thumbnail: '/listings/casa-05.jpg',
  },
  {
    price: '$4,495,000',
    title: '11218 River View Drive, Potomac MD',
    specs: '6 Beds · 6 Baths · 10,150 Sq Ft · 1.61 Acres',
    link: DET + '10649248/11218-river-view-drive-potomac-md-20854',
    thumbnail: '/listings/casa-06.jpg',
  },
  {
    price: '$4,195,000',
    title: '7200 Millwood Road, Bethesda MD',
    specs: '6 Beds · 7 Baths · 6,976 Sq Ft · 0.28 Acres',
    link: DET + '58578414/7200-millwood-road-bethesda-md-20817',
    thumbnail: '/listings/casa-07.jpg',
  },
  {
    price: '$4,158,000',
    title: '319 Blue Bay Road, Stevensville MD',
    specs: '9 Beds · 8 Baths · 10,152 Sq Ft · 2.78 Acres',
    link: DET + '12935337/319-blue-bay-road-stevensville-md-21666',
    thumbnail: '/listings/casa-08.jpg',
  },
  {
    price: '$3,975,000',
    title: '5114 Wessling Lane, Bethesda MD',
    specs: '6 Beds · 6 Baths · 6,552 Sq Ft · 0.18 Acres',
    banner: 'Price Reduced',
    link: DET + '58605244/5114-wessling-lane-bethesda-md-20814',
    thumbnail: '/listings/casa-09.jpg',
  },
  {
    price: '$3,950,000',
    title: '6693 Groveland Road, Pipersville PA',
    specs: '5 Beds · 6 Baths · 4,177 Sq Ft · 33.46 Acres',
    link: DET + '46206480/6693-groveland-road-pipersville-pa-18947',
    thumbnail: '/listings/casa-10.jpg',
  },
];
